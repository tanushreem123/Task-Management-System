import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "CLIENT_ORIGIN"] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  clientOrigin: process.env.CLIENT_ORIGIN as string,
  nodeEnv: process.env.NODE_ENV || "development",
};
