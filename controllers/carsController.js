import { BadRequestError } from '../errors/customErrors.js';
import RentalCars from '../models/RentalCars.js';

export const createCar = async (req, res) => {
  const {
    name,
    price_per_day,
    year,
    color,
    steering_type,
    number_of_seats,
  } = req.body;

  if (
    !name ||
    !price_per_day ||
    !year ||
    !color ||
    !steering_type ||
    !number_of_seats
  ) {
    throw new BadRequestError(
      'Provide all values for the car'
    );
  }

  const car = await RentalCars.create({
    name,
    price_per_day,
    year,
    color,
    steering_type,
    number_of_seats,
    createdBy: req.user.userId,
  });

  return res.status(200).json({ car });
};

export const getAllCars = async (req, res) => {
  const {
    year,
    color,
    steering_type,
    number_of_seats,
    search,
  } = req.query;

  const query = {};

  if (search) {
    query.name = {
      $regex: search,
      $options: 'i',
    };
  }

  if (year) {
    query.year = year;
  }
  if (color) {
    query.color = {
      $regex: color,
      $options: 'i',
    };
  }
  if (steering_type) {
    query.steering_type = steering_type;
  }
  if (number_of_seats) {
    query.number_of_seats = number_of_seats;
  }

  const cars = await RentalCars.find(query).sort(
    'price_per_day'
  );
  return res
    .status(200)
    .json({ cars, count: cars.length });
};
