import nodemailer from "nodemailer";
import axios from "axios";
import User from "../models/users.js"; // Assuming User model is defined


// Validate email format
const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if email exists using Hunter.io API
export const checkEmailExistsService = async (email) => {
  // Step 1: Validate email format
  if (!validateEmailFormat(email)) {
    return { success: false, message: "Định dạng email không hợp lệ!" };
  }

  // Step 2: Check email existence via Hunter.io
  const apiKey = "b70f4eb3ad5581c2dafeffb3a8583b75fe275225";
  const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;
  try {
    const response = await axios.get(url);
    const data = response.data.data;

    if (data.status === "invalid") {
      return { success: false, message: "Email không hợp lệ hoặc không tồn tại!" };
    }
    if (data.disposable) {
      return { success: false, message: "Email này là email tạm thời (disposable)!" };
    }
    if (data.block) {
      return { success: false, message: "Email bị chặn hoặc thuộc danh sách đen!" };
    }
    if (data.score < 50) {
      return { success: false, message: "Email không tồn tại hoặc không đáng tin cậy!" };
    }
    return {
      success: true,
      message: `Email hợp lệ! (Độ tin cậy: ${data.score}%)`,
    };
  } catch (error) {
    console.error("❌ Lỗi kiểm tra email:", error.response?.data || error.message);
    return { success: false, message: "Lỗi hệ thống khi kiểm tra email!" };
  }
};

// Check if email is already used by another user
export const checkEmailUniqueness = async (email, userId) => {
  try {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return { success: false, message: "Email này đã được sử dụng bởi người dùng khác!" };
    }
    return { success: true, message: "Email chưa được sử dụng." };
  } catch (error) {
    console.error("❌ Lỗi kiểm tra email trùng lặp:", error.message);
    return { success: false, message: "Lỗi hệ thống khi kiểm tra email trùng lặp!" };
  }
};

export const sendEmailService = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            logger: true,  // Bật log chi tiết
            debug: true,   // Bật debug
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM_ADDRESS, // Địa chỉ gửi email
            to: to,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email đã được gửi:", info.messageId);
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
        throw new Error("Không thể gửi email.");
    }
};
