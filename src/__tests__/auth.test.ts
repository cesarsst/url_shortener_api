// src/__tests__/index.test.ts
import request from "supertest";
import bcrypt from "bcrypt";
import { describe, it, expect } from "@jest/globals";
import app from "../index";
import { db } from "../db/index";

describe("GET /register", () => {
  beforeAll(async () => {
    // create the table
    await db.query(
      "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))"
    );
  });

  afterAll(async () => {
    // drop the table
    await db.query("DROP TABLE users");
  });

  it("should register user and return a token", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Jhon tester",
      email: "jhon@test.com",
      password: "tester123",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 400 if user already exists", async () => {
    await request(app).post("/auth/register").send({
      name: "Jhon tester",
      email: "jhon@test.com",
      password: "tester123",
    });

    const response = await request(app).post("/auth/register").send({
      name: "Jhon tester",
      email: "jhon@test.com",
      password: "tester123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "User already exists");
  });

  it("should return 400 if name, email or password is missing", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "",
      email: "jhon@test.com",
      password: "tester123",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", [
      {
        location: "body",
        msg: "Invalid value",
        path: "name",
        type: "field",
        value: "",
      },
    ]);

    const response2 = await request(app).post("/auth/register").send({
      name: "Jhon tester",
      email: "",
      password: "tester123",
    });
    expect(response2.status).toBe(400);
    expect(response2.body).toHaveProperty("message", [
      {
        location: "body",
        msg: "Invalid value",
        path: "email",
        type: "field",
        value: "",
      },
    ]);

    const response3 = await request(app).post("/auth/register").send({
      name: "Jhon tester",
      email: "jhon@test.com",
      password: "",
    });
    expect(response3.status).toBe(400);
    expect(response3.body).toHaveProperty("message", [
      {
        location: "body",
        msg: "Invalid value",
        path: "password",
        type: "field",
        value: "",
      },
    ]);
  });

  it("should return 400 if password is less than 6 characters or invalid", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Jhon tester",
      email: "jhon@test.com",
      password: "test",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatchObject([
      {
        type: "field",
        value: "test",
        msg: "Invalid value",
        path: "password",
        location: "body",
      },
    ]);
  });

  it("Should return 400 if email is invalid", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Jhon tester",
      email: "jhon@test",
      password: "tester123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatchObject([
      {
        type: "field",
        value: "jhon@test",
        msg: "Invalid value",
        path: "email",
        location: "body",
      },
    ]);
  });
});

describe("GET /login", () => {
  beforeAll(async () => {
    // create the table
    await db.query(
      "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))"
    );

    // insert a user
    const hashedPassword = await bcrypt.hash("tester123", 10);
    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      ["Jhon tester", "jhon@test.com", hashedPassword]
    );
  });

  afterAll(async () => {
    // drop the table
    await db.query("DROP TABLE users");
  });

  it("should login user and return a token", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "jhon@test.com",
      password: "tester123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 400 if user does not exist", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "usernotexist@test.com",
      password: "tester123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "User does not exist");
  });

  it("should return 400 if password is invalid", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "usernotexist@test.com",
      password: "tester123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "User does not exist");
  });
});
