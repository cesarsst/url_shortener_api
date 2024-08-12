import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../index";
import { db } from "../db/index";
import bycrypt from "bcrypt";

describe("Auth middleware", () => {
  beforeAll(async () => {
    // create the table
    await db.query(
      "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))"
    );

    // create a user
    const hashedPassword = await bycrypt.hash("tester123", 10);
    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      ["Jhon Doe", "jhon@test.com", hashedPassword]
    );
  });

  afterAll(async () => {
    // drop the table
    await db.query("DROP TABLE users");
  });

  it("should return 401 if the user is not authenticated", async () => {
    const response = await request(app).get("/users/me");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  it("should return 401 if the token is invalid", async () => {
    const response = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  it("should return 401 if the user does not exist", async () => {
    const response = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  it("should return 200 if the user is authenticated", async () => {
    const loginResponse = await request(app).post("/auth/login").send({
      email: "jhon@test.com",
      password: "tester123",
    });
    expect(loginResponse.status).toBe(200);

    const token = loginResponse.body.token;
    const meResponse = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body).toHaveProperty("id");
    expect(meResponse.body).toHaveProperty("email");
  });
});
