import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authLimiter, authRoutes);
app.use("/tasks", taskRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    app.listen(config.port, () => {
      console.log(`Backend server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

void start();
