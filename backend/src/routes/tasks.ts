import { Router } from "express";
import { isValidObjectId, type Types } from "mongoose";
import { requireAuth } from "../middleware/auth";
import { Task, type TaskStatus } from "../models/Task";

const router = Router();

router.use(requireAuth);

router.post("/", async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== "string") {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    const task = await Task.create({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      userId: req.user!.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const status = req.query.status as TaskStatus | undefined;
    const filter: { userId: Types.ObjectId; status?: TaskStatus } = { userId: req.user!.userId };

    if (status && ["Pending", "Completed"].includes(status)) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid task id" });
      return;
    }

    const task = await Task.findOne({ _id: id, userId: req.user!.userId });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid task id" });
      return;
    }

    const { title, description, status } = req.body as {
      title?: string;
      description?: string;
      status?: TaskStatus;
    };

    const updates: {
      title?: string;
      description?: string;
      status?: TaskStatus;
    } = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        res.status(400).json({ message: "Title must be a non-empty string" });
        return;
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        res.status(400).json({ message: "Description must be a string" });
        return;
      }
      updates.description = description.trim();
    }

    if (status !== undefined) {
      if (!["Pending", "Completed"].includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }
      updates.status = status;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user!.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid task id" });
      return;
    }

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user!.userId });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
