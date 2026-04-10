import { Types } from "mongoose";

declare global {
  namespace Express {
    interface UserPayload {
      userId: Types.ObjectId;
      email: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
