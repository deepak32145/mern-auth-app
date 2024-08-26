import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateVerificationCode } from "../utills/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utills/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetMail,
  sendPasswordResetSuccessfulEmail,
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 12);
    const verificationCode = generateVerificationCode();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationCode,
      verificationCodeExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await user.save();
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationCode);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  console.log("login");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or passworld" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or passworld" });
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({
      success: true,
      message: "logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationCode: code,
      verificationCodeExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetMail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({ success: true, message: "Succesfully send mail" });
  } catch (err) {
    console.log("error in sending mail", err);
    res.status(400).json({ success: false, message: "error in sending mail" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendPasswordResetSuccessfulEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "password reset successful" });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
