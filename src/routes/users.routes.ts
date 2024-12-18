import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateUserData } from '../validators/users.validator';

const router = Router();

router.post('/discordUserData', authMiddleware, validateUserData, UsersController.upsertUsers);
router.get('/userRankings', UsersController.getUserRankings);

export default router;