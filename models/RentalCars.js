import mongoose from 'mongoose';

const RentalCarsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide car name'],
    minlength: 3,
  },
  price_per_day: {
    type: Number,
    required: [
      true,
      'Please provide price per day',
    ],
    min: 0,
  },
  year: {
    type: Number,
    required: [
      true,
      'Please provide year of manufacture',
    ],
    min: 1900,
    max: new Date().getFullYear(),
  },
  color: {
    type: String,
    required: [true, 'Please provide car color'],
  },
  steering_type: {
    type: String,
    enum: ['manual', 'automatic'],
    required: [
      true,
      'Please provide steering type',
    ],
  },
  number_of_seats: {
    type: Number,
    required: [
      true,
      'Please provide number of seats',
    ],
    min: 2,
    max: 8,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model(
  'RentalCar',
  RentalCarsSchema
);
