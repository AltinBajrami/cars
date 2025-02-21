import { Router } from 'express';
const router = Router();

import {
  createCar,
  getAllCars,
} from '../controllers/carsController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

router
  .route('/')
  .post(authenticateUser, createCar)
  .get(getAllCars);

export default router;
