import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {
  verifyUserPassword,
} from "../../data/user-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";
import { addCreditLog } from "../../data/credit-dao.js";
import User from "../../models/User.js";
import { sendVerificationEmail } from "../../utils/mailer.js";

const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";

// POST /improved register feature: verify users with UoA email.
router.post("/register", async (req, res) => {
  try {
    const { email, password, upi } = req.body;
    const phone = req.body.phone?.trim();

    if (!email?.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!upi?.trim()) {
      return res.status(400).json({ error: "UPI is required" });
    }
    if (!phone) return res.status(400).json({ error: "Phone number is required" });
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const phoneRegex = /^[0-9\-\+]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number. Only numbers, dashes(-), and plus(+) are allowed." });
    }

    const emailLower = email.trim().toLowerCase();
    if (!emailLower.endsWith("@aucklanduni.ac.nz")) {
      return res.status(400).json({ error: "Please use your University of Auckland email address to sign up." });
    }

    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ error: "Email already exists and is verified." });
    }

    //Verify via the uni address.
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser && !existingUser.isVerified) {
     
      existingUser.username = emailLower;
      existingUser.password = hashedPassword;
      existingUser.upi = upi;
      existingUser.phone = phone;
      existingUser.verificationCode = verificationCode;
      await existingUser.save();
    } else {
      await User.create({
        username: emailLower, 
        email: emailLower,
        password: hashedPassword,
        upi,
        phone,
        verificationCode,
        isVerified: false,
      });
    }
    
    //send the verification code to the user's email
    await sendVerificationEmail(emailLower, verificationCode);

    res.status(200).json({ message: "Verification code sent to your school email." });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(400).json({ error: "Failed to start registration process." });
  }
});

/**
 * final step of the registration process: user submits the code they received via email.
 * If the code is correct, we mark the user as verified and complete the registration by giving them the welcome bonus and returning the JWT.
 */
router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email?.trim() || !code?.trim()) {
      return res.status(400).json({ error: "Invalid code or email." });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({ error: "Invalid code or email." });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      verificationCode: code,
      isVerified: false 
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid code or email." });
    }

    //Approve sign up
    user.isVerified = true;
    user.verificationCode = null; 
    await user.save();

    // Give 1000 welcome bonus immediately
    await addCreditLog({
      userId: user._id,
      amount: 1000,
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

    res.status(201).json({ message: "Registered", user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid code or email." });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if(!user || !user.isVerified) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await verifyUserPassword(user, password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
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

export default router;
