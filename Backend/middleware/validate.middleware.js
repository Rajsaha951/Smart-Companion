import { validationResult } from 'express-validator';

/**
 * Validate request using express-validator
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
  }
  
  next();
}
