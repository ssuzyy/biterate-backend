import { config } from 'dotenv';
config();

export const HOST = process.env.DB_HOST || "localhost";
export const USER = process.env.DB_USER || "suzy";
export const PASSWORD = process.env.DB_PASSWORD || "password";
export const DB = process.env.DB_NAME || "biterate";
export const dialect = "postgres";
export const pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
};