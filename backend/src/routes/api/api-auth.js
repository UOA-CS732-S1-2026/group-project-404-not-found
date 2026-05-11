import express from "express";
import {
  findUserByEmail,
  verifyUserPassword,
  createUser,
} from "../../data/user-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";
import { addCreditLog } from "../../data/credit-dao.js";
import User from "../../models/User.js";

const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";

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
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    //Add the creteria for the phone number
    const phoneRegex = /^[0-9\-\+]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number. Only numbers are allowed." });
    }

    const emailLower = email.trim().toLowerCase();
    if (!emailLower.endsWith("@aucklanduni.ac.nz") && !emailLower.endsWith("@auckland.ac.nz")) {
      return res.status(400).json({ error: "Please use your University of Auckland email address to sign up." });
    }

    // Force isVerified to true and remove verification code logic
    req.body.isVerified = true;
    const newUser = await createUser(req.body);

    // Give 1000 welcome bonus immediately
    await addCreditLog({
      userId: newUser._id,
      amount: 1000,
      reason: "Welcome bonus",
      type: "earn",
    });

    // newUser.creditBalance = (newUser.creditBalance || 0) + 1000;
    // await newUser.save();

    const token = createUserJWT(newUser.email);

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    const safeUser = newUser.toObject();
    delete safeUser.password;

    res.status(201).json({ message: "Registered", user: safeUser });
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