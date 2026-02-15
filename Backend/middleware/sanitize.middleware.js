/**
 * Sanitize middleware
 * Removes PII (Personally Identifiable Information) from task text
 */
export default function sanitize(req, res, next) {
  try {
    // Check if task exists in request body
    if (!req.body.task) {
      return next();
    }

    let taskText = req.body.task;
    
    // Handle both string and object format
    if (typeof taskText === 'object' && taskText.task_text) {
      taskText = taskText.task_text;
    }
    
    if (typeof taskText !== 'string') {
      return next();
    }

    // Sanitize PII
    let sanitized = taskText;

    // Remove proper names (capitalized words that aren't at sentence start)
    sanitized = sanitized.replace(/(?<!^|[.!?]\s)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g, '[PERSON]');

    // Remove times (e.g., 3:30, 14:00)
    sanitized = sanitized.replace(/\b\d{1,2}:\d{2}\b/g, '[TIME]');

    // Remove dates (various formats)
    sanitized = sanitized.replace(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g, '[DATE]');

    // Remove phone numbers
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');

    // Remove email addresses
    sanitized = sanitized.replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, '[EMAIL]');

    // Remove addresses with "near" keyword
    sanitized = sanitized.replace(/near\s+[\w\s]+/gi, 'near [LOCATION]');

    // Remove street addresses
    sanitized = sanitized.replace(/\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd)/gi, '[ADDRESS]');

    // Update the task in request body
    if (typeof req.body.task === 'object') {
      req.body.task.task_text = sanitized;
    } else {
      req.body.task = sanitized;
    }

    // Log sanitization (only in development)
    if (process.env.NODE_ENV === 'development' && taskText !== sanitized) {
      console.log('Sanitized task:', { original: taskText, sanitized });
    }

    next();

  } catch (error) {
    console.error('Sanitize middleware error:', error);
    // Continue even if sanitization fails
    next();
  }
}
