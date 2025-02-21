import 'express-async-errors';
import express from 'express';
const app = express();
import morgan from 'morgan';
import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

//routers
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import carsRouter from './routes/carsRouter.js';

//middlewares
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cars', carsRouter);

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
