import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { User } from "../models/User";
import { requireAuth } from "../middleware/auth";

const router = Router();

const createToken = (userId: string, email: string): string =>
  jwt.sign({ userId, email }, config.jwtSecret, { expiresIn: "24h" });

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: config.nodeEnv === "production",
  maxAge: 24 * 60 * 60 * 1000,
};

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ message: "Invalid payload" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalizedEmail, passwordHash });

    const token = createToken(user._id.toString(), user.email);
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ message: "Invalid payload" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = createToken(user._id.toString(), user.email);
    res.cookie("token", token, cookieOptions);

    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: config.nodeEnv === "production",
  });
  res.json({ message: "Logout successful" });
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.userId).select("_id email");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user: { id: user._id, email: user.email } });
  } catch (error) {
    next(error);
  }
});

export default router;
