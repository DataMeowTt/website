import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";

import { protect } from "./src/middleware/authMiddleware.js";
import csrfConfig from "./src/middleware/csrfConfig.js";

import connectDB from "./src/config/Mongodb.js";
import { initSocket } from "./src/config/socket.js";


import userRoutes from "./src/routes/userRoute.js"
import adminRoute from "./src/routes/adminRoute.js";
import AccountRoute from "./src/routes/accountRoutes.js";

import bookingRoutes from "./src/routes/bookingRoute.js";
import centersRoutes from "./src/routes/centersRoute.js";
import centerRoutes from "./src/routes/centerRoute.js";
import billManageRoutes from "./src/routes/billManageRoute.js";
import centerStatusRoute from "./src/routes/centerStatusRoute.js";
import ratingClientRoute from "./src/routes/ratingsClientRoute.js";
import ratingRoute from "./src/routes/ratingRoutes.js";

if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const app = express();
const csrfProtection = csrfConfig;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "http://localhost:5173", "http://localhost:5174"],
        styleSrc: ["'self'", "'unsafe-inline'", "http://localhost:5173", "http://localhost:5174"],
        imgSrc: ["'self'", "data:", "http://localhost:5173", "http://localhost:5174"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'", "ws://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
        frameSrc: ["'self'"],
      },
    },
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    credentials: true,
  })
);

app.use(cookieParser());

// Cấu hình Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'Strict',
    },
  })
);

// CSRF Token endpoint
app.get('/api/csrf-token', protect, csrfProtection, (req, res) => {
  try {
    const token = req.csrfToken();
    res.json({ csrfToken: token });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({ success: false, error: 'Failed to generate CSRF token' });
  }
});

const uploadDir = path.join(process.cwd(), "uploads");
app.use('/uploads', express.static(uploadDir));

// Áp dụng bảo vệ CSRF cho các phương thức thay đổi dữ liệu
app.use(["/api/booking", "/api/bill"], csrfProtection); // Đảm bảo các route đặt sân/thanh toán được bảo vệ

app.use("/api/users", userRoutes);


app.use("/api/booking", bookingRoutes);   
app.use("/api/centers", centersRoutes);   
app.use("/api/center", centerRoutes);     
app.use("/api/bill", billManageRoutes);    
app.use("/api/admin/center-status", centerStatusRoute);
app.use("/api/admin/ratings", ratingRoute);
app.use("/api/admin/account", AccountRoute);
app.use("/api/admin", adminRoute);

const server = http.createServer(app);

// Khởi tạo Socket.IO (Quan trọng cho tính năng Booking realtime)
let io;
if (process.env.NODE_ENV !== 'test') {
  io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  initSocket(io);
  global.io = io; 
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
}

app.get("/", (req, res) => {
  res.send("API is running....");
});