import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../index";
import { db } from "../db/index";
import bycrypt from "bcrypt";

describe("Shorten URL controller", () => {
  beforeAll(async () => {
    await db.query("DROP TABLE IF EXISTS urls");
    await db.query("DROP TABLE IF EXISTS users");

    // create users table
    await db.query(
      "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))"
    );

    // create a user
    const hashedPassword = await bycrypt.hash("tester123", 10);
    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      ["Jhon Doe", "jhon@test.com", hashedPassword]
    );

    // create urls table
    await db.query(
      "CREATE TABLE urls (id VARCHAR(6) PRIMARY KEY, owner INTEGER REFERENCES users(id) ON DELETE SET NULL, url_target TEXT NOT NULL, access_counter INTEGER DEFAULT 0, last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP, exclude_date TIMESTAMP DEFAULT NULL)"
    );

    // create url
    await db.query(
      "INSERT INTO urls (id, owner, url_target, access_counter, last_update) VALUES ($1, $2, $3, $4, $5)",
      ["abc123", 1, "http://test.com", 0, new Date()]
    );
  });

  afterAll(async () => {
    // drop the table
    await db.query("DROP TABLE IF EXISTS urls");
    await db.query("DROP TABLE IF EXISTS users");
  });

  it("Should return a shortened URL and save with owner reference", async () => {
    const loginResponse = await request(app).post("/auth/login").send({
      email: "jhon@test.com",
      password: "tester123",
    });

    expect(loginResponse.status).toBe(200);

    const token = loginResponse.body.token;

    const response = await request(app)
      .post("/generateShortLink")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "http://test.com" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("shortUrl");

    const shortUrl = response.body.shortUrl.split("/");
    const baseUrl = `${shortUrl[0]}//${shortUrl[2]}`;
    const path = shortUrl[3];

    expect(baseUrl).toBe(process.env.BASE_URL);
    expect(path).toHaveLength(6);

    // verify if the URL is in the database
    const url = await db.query("SELECT * FROM urls WHERE id = $1", [path]);
    expect(url.rows.length).toBe(1);
  });

  it("Should return a shortened URL without owner reference", async () => {
    const response = await request(app)
      .post("/generateShortLink")
      .send({ url: "http://test.com" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("shortUrl");

    const shortUrl = response.body.shortUrl.split("/");
    const baseUrl = `${shortUrl[0]}//${shortUrl[2]}`;
    const path = shortUrl[3];

    expect(baseUrl).toBe(process.env.BASE_URL);
    expect(path).toHaveLength(6);

    // verify if the URL is in the database
    const url = await db.query("SELECT * FROM urls WHERE id = $1", [path]);
    expect(url.rows.length).toBe(1);
    expect(url.rows[0].owner).toBeNull();
  });

  it("Should return an error when URL is not provided", async () => {
    const response = await request(app).post("/generateShortLink").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatchObject([
      { location: "body", msg: "Invalid URL", path: "url", type: "field" },
    ]);
  });

  it("Should return an error when URL is invalid", async () => {
    const response = await request(app)
      .post("/generateShortLink")
      .send({ url: "test" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatchObject([
      {
        location: "body",
        msg: "Invalid URL",
        path: "url",
        type: "field",
        value: "test",
      },
    ]);
  });

  it("Should return target URL when short URL is provided", async () => {
    const response = await request(app).get("/abc123").send();

    expect(response.status).toBe(302);
    expect(response.header.location).toBe("http://test.com");

    // verify if the access_counter is updated
    const url = await db.query("SELECT * FROM urls WHERE id = $1", ["abc123"]);
    expect(url.rows[0].access_counter).toBe(1);
  });

  it("Should return an error when short URL is not found", async () => {
    const response = await request(app).get("/notfound").send();

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("URL not found");
  });
});
