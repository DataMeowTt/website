  import express from "express";
  import cors from "cors";
  import http from "http";
  import { Server as SocketIOServer } from "socket.io";
  import cookieParser from "cookie-parser";
  import helmet from "helmet";
  import {protect} from "./src/middleware/authMiddleware.js";
  import csrfConfig from "./src/middleware/csrfConfig.js";
  import session from "express-session";
  import dotenv from "dotenv";
  import adminRoute from "./src/routes/adminRoute.js";
  import UserManageRoute from "./src/routes/userManageRoute.js";
  import userRoutes from "./src/routes/userRoute.js";
  import connectDB from "./src/config/Mongodb.js";
  import centerRoute from "./src/routes/centerRoute.js";
  import { initSocket } from "./src/config/socket.js";
  import bookingPendingRoute from "./src/routes/bookingRoute.js";
  import contactRoutes from "./src/routes/contactRoute.js";
  import newsRoutes from "./src/routes/newsRoutes.js";
  import billManageRoute from "./src/routes/billManageRoute.js";
  import centerStatusRoute from "./src/routes/centerStatusRoute.js";
  import path from "path";
  import inventoriesRoute from "./src/routes/inventoryRoutes.js";
  import ratingClientRoute from "./src/routes/ratingsClientRoute.js";
  import newsClientRoute from "./src/routes/newsClientRoute.js";
  import inventoryClientRoute from "./src/routes/inventoryClientRoutes.js";
  import ratingRoute from "./src/routes/ratingRoutes.js";
  import AccountRoute from "./src/routes/accountRoutes.js";
  import sellHistoryRoutes from "./src/routes/sellhistoryRoutes.js";
  import Report from "./src/routes/reportRoutes.js";
  import sellHistoryRoutesClient from "./src/routes/sellhistoryRoutesClient.js";

  if (process.env.NODE_ENV !== 'test') {
    dotenv.config();
  }

  const app = express();
  const csrfProtection = csrfConfig;

  // Middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }))

  const whitelist = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean);
  app.use(
    cors({
      origin: function (origin, callback) {
        // Cho phép request không có origin (như Postman hoặc thiết bị di động)
        // Hoặc origin nằm trong whitelist
        if (!origin || whitelist.includes(origin)) {
          callback(null, true);
        } else {
          console.log("CORS bị chặn từ nguồn:", origin); // Giúp bạn debug xem origin nào đang bị chặn
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
      credentials: true, // Bắt buộc nếu bạn dùng Cookie hoặc JWT trong Header
      optionsSuccessStatus: 200 // Một số trình duyệt cũ (IE11) gặp lỗi với 204
    })
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", process.env.FRONTEND_URL, process.env.ADMIN_URL],
          styleSrc: ["'self'", "'unsafe-inline'", process.env.FRONTEND_URL, process.env.ADMIN_URL],
          imgSrc: ["'self'", "data:", process.env.FRONTEND_URL, process.env.ADMIN_URL],
          fontSrc: ["'self'"],
          connectSrc: ["'self'", "https:", "wss:", 
                        process.env.FRONTEND_URL, process.env.ADMIN_URL],
          frameSrc: ["'self'"],
        },
      },
    })
  );

  app.use(cookieParser());

  // Configure session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      },
    })
  );

  // Endpoint to get CSRF token (unprotected)
  app.get('/api/csrf-token', protect, csrfProtection, (req, res) => {
    try {
      const token = req.csrfToken();
      res.json({ csrfToken: token });
    } catch (error) {
      console.error('Error generating CSRF token:', error);
      res.status(500).json({ success: false, error: 'Failed to generate CSRF token' });
    }
  });

  // Serve static files from uploads directory
  const uploadDir = path.join(process.cwd(), "uploads");
  app.use('/uploads', express.static(uploadDir));

  // Routes (CSRF protection applied in specific routes)
  app.use("/api/users", userRoutes);
  app.use("/api/centers", centerRoute);
  app.use("/api/booking", bookingPendingRoute);
  app.use("/api/contact", contactRoutes);
  app.use("/api/admin/news", newsRoutes);
  app.use("/api/admin/user-manage", UserManageRoute);
  app.use("/api/admin", adminRoute);
  app.use("/api/admin/bill-manage", billManageRoute);
  app.use("/api/admin/center-status", centerStatusRoute);
  app.use("/api/admin/inventories", inventoriesRoute);
  app.use("/api/inventories", inventoryClientRoute);
  app.use("/api/admin/account", AccountRoute);
  app.use("/api/admin/sell-histories", sellHistoryRoutes);
  app.use("/api/admin/report/", Report);
  app.use("/api/admin/ratings", ratingRoute);
  app.use("/api/news", newsClientRoute);
  app.use("/api/sell-histories", sellHistoryRoutesClient);

  const server = http.createServer(app);

  // Chỉ khởi tạo Socket.IO khi không ở trong môi trường test
  let io;
  if (process.env.NODE_ENV !== 'test') {
    io = new SocketIOServer(server, {
      cors: {
        origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    initSocket(io);
    global.io = io; // Gán io vào global chỉ trong môi trường không phải test
  } else {
    console.log("Socket.IO không được khởi tạo trong môi trường TEST.");
  }

  // Error handling middleware
  app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({ success: false, error: 'Invalid CSRF token' });
    }
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Đã có lỗi xảy ra, vui lòng thử lại sau!" });
  });

  export { app, server, io };

  if (process.env.NODE_ENV !== 'test') {
    connectDB();
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));
  } else {
    console.log("Server Express đã được khởi tạo nhưng không lắng nghe cổng trong môi trường TEST.");
  }

  app.get("/", (req, res) => {
    res.send("API is running....");
  });