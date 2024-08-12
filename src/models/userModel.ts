import { db } from "../db";
import { QueryResult } from "pg";

export default class UserModel {
  static async getAllUsers(): Promise<QueryResult> {
    const result = await db.query("SELECT * FROM users");
    return result;
  }

  static async getUserById(id: number): Promise<QueryResult> {
    const result = await db.query("SELECT id, email FROM users WHERE id = $1", [
      id,
    ]);
    return result;
  }

  static async getUserByEmail(email: string): Promise<QueryResult> {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result;
  }

  static async getUserUrls(id: number): Promise<QueryResult> {
    const result = await db.query(
      "SELECT * FROM urls WHERE owner = $1 and exclude_date IS NULL",
      [id]
    );
    return result;
  }

  static async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<QueryResult> {
    return await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
  }
}
