import { Router } from 'express';
const router = Router();

import { getCurrentUser } from '../controllers/userController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

router.get(
  '/current-user',
  authenticateUser,
  getCurrentUser
);
export default router;
