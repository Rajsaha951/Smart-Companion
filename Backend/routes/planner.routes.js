import express from "express";
import auth from "../middleware/auth.middleware.js";
import sanitize from "../middleware/sanitize.middleware.js";
import { 
  decompose, 
  getTaskSessions, 
  updateProgress 
} from "../controllers/planner.controller.js";

const router = express.Router();

// All planner routes require authentication
router.use(auth);

// Decompose task into micro-steps
router.post("/decompose", sanitize, decompose);

// Get user's task sessions
router.get("/sessions", getTaskSessions);

// Update task session progress
router.put("/sessions/:sessionId", updateProgress);
router.patch("/sessions/:sessionId", updateProgress);

export default router;
