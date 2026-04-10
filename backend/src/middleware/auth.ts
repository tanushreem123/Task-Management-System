import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../config";

interface JwtPayload {
  userId: string;
  email: string;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = {
      userId: new Types.ObjectId(decoded.userId),
      email: decoded.email,
    };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
