import dotenv from 'dotenv';

dotenv.config();

export const config = {
  FRONT_END_DEV_URL: process.env.FRONT_END_DEV_URL || 'http://localhost:5173'
};
