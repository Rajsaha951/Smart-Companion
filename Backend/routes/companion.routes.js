import express from "express";
import auth from "../middleware/auth.middleware.js";
import { respond } from "../controllers/companion.controller.js";

const router = express.Router();

// All companion routes require authentication
router.use(auth);

// Get AI companion response
router.post("/respond", respond);

export default router;
