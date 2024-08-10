// db.ts
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const db_dev = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db_test = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_TEST,
});

export const db = process.env.NODE_ENV === "test" ? db_test : db_dev;
