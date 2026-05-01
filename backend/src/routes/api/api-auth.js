import express from "express";
import {
  findUserByEmail,
  verifyUserPassword,
  createUser,
} from "../../data/user-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";
import { addCreditLog } from "../../data/credit-dao.js";

const router = express.Router();

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const newUser = await createUser(req.body);

    // Record welcome bonus credit log
    await addCreditLog({
      userId: newUser.id,
      amount: 500,
      reason: "Welcome bonus",
      type: "earn",
    });

    res.status(201).json({ userId: newUser.id });
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

    const token = createUserJWT(user);

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
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
  });

  return res.sendStatus(204);
});

export default router;