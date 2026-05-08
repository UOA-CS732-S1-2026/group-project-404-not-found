import express from "express";
import {
  findUserByEmail,
  verifyUserPassword,
  createUser,
} from "../../data/user-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";
import { addCreditLog } from "../../data/credit-dao.js";
import nodemailer from "nodemailer";
import User from "../../models/User.js";

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";
let transporter;
async function getTransporter() {
  if (!transporter) {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      if (isProduction) {
        transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
      } else {
        transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
      }
      console.log("Using real Gmail SMTP for sending emails.");
    } else {
      console.warn("No EMAIL_USER found in .env. Falling back to Ethereal mock email.");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
  }
  return transporter;
}

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { email, password, upi, phone } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!upi?.trim()) {
      return res.status(400).json({ error: "UPI is required" });
    }

    if (!phone?.trim()) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const emailLower = email.trim().toLowerCase();
    if (!emailLower.endsWith("@aucklanduni.ac.nz") && !emailLower.endsWith("@auckland.ac.nz")) {
      return res.status(400).json({ error: "Please use your University of Auckland email address to sign up." });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    req.body.verificationCode = verificationCode;

    const newUser = await createUser(req.body);

    try {
      const mailer = await getTransporter();
      const fromEmail = process.env.EMAIL_USER || "noreply@uoaswap.co.nz";
      const info = await mailer.sendMail({
        from: `"UoA Swap" <${fromEmail}>`,
        to: newUser.email,
        subject: "Verify your UoA Swap account",
        text: `Your verification code is: ${verificationCode}\n\nWelcome to UoA Swap!`,
      });
      
      if (!process.env.EMAIL_USER) {
        console.log("Registration Email Preview URL: %s", nodemailer.getTestMessageUrl(info));
      } else {
        console.log(`[DEBUG] Verification email sent to ${newUser.email}. CODE: ${verificationCode}`);
      }
    } catch (err) {
      console.error("Failed to send verification email", err);
    }

    res.status(201).json({ status: "verification_required", email: newUser.email });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to register" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await verifyUserPassword(user, password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isVerified) {
      // Auto-resend verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      await User.findByIdAndUpdate(user._id, { verificationCode });
      try {
        const mailer = await getTransporter();
        const fromEmail = process.env.EMAIL_USER || "noreply@uoaswap.co.nz";
        await mailer.sendMail({
          from: `"UoA Swap" <${fromEmail}>`,
          to: user.email,
          subject: "Verify your UoA Swap account (Login Attempt)",
          text: `Your new verification code is: ${verificationCode}\n\nPlease use this to verify your account.`,
        });
        console.log(`[DEBUG] Login auto-resend to ${user.email}. CODE: ${verificationCode}`);
      } catch (err) {
        console.error("Failed to resend verification email during login", err);
      }
      return res.status(403).json({ error: "Please verify your email first. A new code has been sent.", status: "verification_required" });
    }

    const token = createUserJWT(user.email);

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ message: "Logged in", user: safeUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to login" });
  }
});

// POST /logout
router.post("/logout", (req, res) => {
  res.cookie("authToken", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });

  return res.sendStatus(204);
});

// POST /verify-email
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) return res.status(400).json({ error: "Already verified" });

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    await User.findByIdAndUpdate(user._id, { isVerified: true, verificationCode: null });

    await addCreditLog({
      userId: user._id,
      amount: 500,
      reason: "Welcome bonus",
      type: "earn",
    });

    const token = createUserJWT(user.email);
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    const safeUser = user.toObject();
    delete safeUser.password;
    safeUser.isVerified = true;

    res.json({ message: "Verified and logged in", user: safeUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to verify email" });
  }
});

// POST /resend-verification
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) return res.status(400).json({ error: "Already verified" });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await User.findByIdAndUpdate(user._id, { verificationCode });

    const mailer = await getTransporter();
    const fromEmail = process.env.EMAIL_USER || "noreply@uoaswap.co.nz";
    const info = await mailer.sendMail({
      from: `"UoA Swap" <${fromEmail}>`,
      to: user.email,
      subject: "Verify your UoA Swap account (Resend)",
      text: `Your new verification code is: ${verificationCode}`,
    });
    
    if (!process.env.EMAIL_USER) {
      console.log("Resend Email Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } else {
      console.log(`[DEBUG] Verification email resent to ${user.email}. CODE: ${verificationCode}`);
    }

    res.json({ message: "Verification code resent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to resend code" });
  }
});

export default router;