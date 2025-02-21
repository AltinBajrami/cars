import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/UserModel.js';
import {
  comparePassword,
  hashPassword,
} from '../utils/passwordUtils.js';
import {
  BadRequestError,
  UnauthenticatedError,
} from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    throw new BadRequestError(
      'please provide fullName,email and password'
    );
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new BadRequestError(
      'invalid email format'
    );
  }

  const emailAlreadyExists =
    await UserModel.findOne({
      email,
    });
  if (emailAlreadyExists) {
    throw new BadRequestError(
      'Email already exists'
    );
  }

  const hashedPassword = await hashPassword(
    req.body.password
  );
  req.body.password = hashedPassword;

  const user = await UserModel.create(req.body);

  const token = createJWT({
    userId: user._id,
    role: user.role,
  });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'user created', user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(
      'please provide email and password'
    );
  }
  const user = await UserModel.findOne({
    email: req.body.email,
  });

  const isValidUser =
    user &&
    (await comparePassword(
      req.body.password,
      user.password
    ));

  if (!isValidUser) {
    throw new UnauthenticatedError(
      'invalid credentials'
    );
  }

  const token = createJWT({
    userId: user._id,
    role: user.role,
  });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'user logged in', user });
};

export const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: 'user logged out' });
};
