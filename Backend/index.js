import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import session from "express-session";
import dotenv from "dotenv";

import {protect} from "./src/middleware/authMiddleware.js";
import csrfConfig from "./src/middleware/csrfConfig.js";

import connectDB from "./src/config/Mongodb.js";
import { initSocket } from "./src/config/socket.js";

import path from "path";


  if (process.env.NODE_ENV !== 'test') {
    dotenv.config();
  }

  const app = express();
  const csrfProtection = csrfConfig;

  // Middleware
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


  // Configure session
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

  // Apply CSRF Protection on post
  app.put(csrfProtection)
  app.post(csrfProtection)
  app.patch(csrfProtection)
  app.delete(csrfProtection)

  app.use("/api/users", userRoutes);

  // Server BackEnd
  const server = http.createServer(app);

  // Chỉ khởi tạo Socket.IO khi không ở trong môi trường test
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