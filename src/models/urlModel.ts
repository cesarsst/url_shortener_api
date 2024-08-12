import { db } from "../db";
import { QueryResult } from "pg";

export default class UrlModel {
  static async getUrlById(id: string): Promise<QueryResult> {
    const result = await db.query("SELECT * FROM urls WHERE id = $1", [id]);
    return result;
  }

  static async getUrlActiveById(id: string): Promise<QueryResult> {
    const result = await db.query(
      "SELECT * FROM urls WHERE id = $1 AND exclude_date IS NULL",
      [id]
    );
    return result;
  }

  static async createUrl(
    url: string,
    hash: string,
    ownerId: number | null
  ): Promise<QueryResult> {
    if (ownerId === null) {
      return await db.query(
        "INSERT INTO urls (id, url_target, access_counter, last_update) VALUES ($1, $2, $3, $4)",
        [hash, url, 0, new Date()]
      );
    }
    return await db.query(
      "INSERT INTO urls (id, owner, url_target, access_counter, last_update) VALUES ($1, $2, $3, $4, $5)",
      [hash, ownerId, url, 0, new Date()]
    );
  }

  static async updateUrl(id: string, url: string): Promise<QueryResult> {
    const result = await db.query(
      "UPDATE urls SET url_target = $1, last_update = $2 WHERE id = $3",
      [url, new Date(), id]
    );
    return result;
  }

  static async deleteUrl(id: string): Promise<QueryResult> {
    const result = await db.query(
      "UPDATE urls SET exclude_date = $1 WHERE id = $2",
      [new Date(), id]
    );
    return result;
  }

  static incrementAccessCounter(id: string): Promise<QueryResult> {
    return db.query(
      "UPDATE urls SET access_counter = access_counter + 1, last_update = $2 WHERE id = $1",
      [id, new Date()]
    );
  }
}
