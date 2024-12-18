import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateUserData = [
  body('users').isArray(),
  body('users.*.discord_id').isString(),
  body('users.*.osu_id').isString(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];