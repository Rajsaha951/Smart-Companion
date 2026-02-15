import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  setupProfile,
  updatePreferences,
  getProfile,
  updateVolatileMetrics
} from "../controllers/profile.controller.js";

const router = express.Router();

// All profile routes require authentication
router.use(auth);

// Setup profile (onboarding)
router.post("/setup", setupProfile);

// Get user profile
router.get("/", getProfile);

// Update preferences (stable)
router.post("/preferences", updatePreferences);
router.put("/preferences", updatePreferences);

// Update volatile metrics
router.post("/metrics", updateVolatileMetrics);

export default router;
