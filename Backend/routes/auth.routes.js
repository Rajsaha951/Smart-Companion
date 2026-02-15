import express from "express";
import { body } from "express-validator";
import { login, getCurrentUser } from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// Login/Register
router.post(
  "/login",
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ],
  validate,
  login
);

// Get current user (protected route)
router.get("/me", auth, getCurrentUser);

export default router;
