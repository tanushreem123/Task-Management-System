import { Schema, model, type Document, type Types } from "mongoose";

export type TaskStatus = "Pending" | "Completed";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  userId: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = model<ITask>("Task", taskSchema, "app_tasks");
