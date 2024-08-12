import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../index";
import { db } from "../db/index";
import bycrypt from "bcrypt";

describe("Users controller", () => {
  beforeAll(async () => {
    await db.query("DROP TABLE IF EXISTS users");
    await db.query("DROP TABLE IF EXISTS urls");

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

    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      ["Jane Doe", "jane@test.com", hashedPassword]
    );

    // create urls table
    await db.query(
      "CREATE TABLE urls (id VARCHAR(6) PRIMARY KEY, owner INTEGER, url_target TEXT, access_counter INTEGER, last_update TIMESTAMP, exclude_date TIMESTAMP DEFAULT NULL)"
    );

    // create url
    await db.query(
      "INSERT INTO urls (id, owner, url_target, access_counter, last_update) VALUES ($1, $2, $3, $4, $5)",
      ["abc123", 1, "http://test.com", 0, new Date()]
    );

    // delete url
    await db.query(
      "INSERT INTO urls (id, owner, url_target, access_counter, last_update) VALUES ($1, $2, $3, $4, $5)",
      ["del123", 1, "http://test.com", 0, new Date()]
    );
  });

  afterAll(async () => {
    // drop the table
    await db.query("DROP TABLE users");
    await db.query("DROP TABLE urls");
  });

  describe("GET /users/getUserUrls", () => {
    it("should return all the URLs for a user", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "jhon@test.com",
        password: "tester123",
      });
      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.token;
      const response = await request(app)
        .get("/users/getUserUrls")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("owner");
      expect(response.body[0]).toHaveProperty("url_target");
      expect(response.body[0]).toHaveProperty("access_counter");
      expect(response.body[0]).toHaveProperty("last_update");
      expect(response.body[0]).toHaveProperty("exclude_date");
    });

    it("Should return error if the user is not authenticated", async () => {
      const response = await request(app).get("/users/getUserUrls");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Unauthorized");
    });
  });

  describe("PUT /users/updateUrl/:id", () => {
    it("Should update the URL", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "jhon@test.com",
        password: "tester123",
      });
      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.token;

      // update the URL
      const response = await request(app)
        .put("/users/updateUrl/abc123")
        .set("Authorization", `Bearer ${token}`)
        .send({ url: "http://newtest.com" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("URL updated successfully");
    });

    it("Should return error if the URL is not found", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "jhon@test.com",
        password: "tester123",
      });
      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.token;

      // update the URL
      const response = await request(app)
        .put("/users/updateUrl/wrongId")
        .set("Authorization", `Bearer ${token}`)
        .send({ url: "http://newtest.com" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("URL not found");
    });

    it("Should return error if the user is not the owner of the URL", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "jane@test.com",
        password: "tester123",
      });
      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.token;

      // update the URL
      const response = await request(app)
        .put("/users/updateUrl/abc123")
        .set("Authorization", `Bearer ${token}`)
        .send({ url: "http://newtest.com" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Forbidden");
    });

    it("Should return error if the URL is not provided", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "jhon@test.com",
        password: "tester123",
      });
      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.token;

      // update the URL
      const response = await request(app)
        .put("/users/updateUrl/abc123")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("URL is required");
    });

    it("Should return 404 if the ID is not provided", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "jhon@test.com",
        password: "tester123",
      });
      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.token;

      // update the URL
      const response = await request(app)
        .put("/users/updateUrl/")
        .set("Authorization", `Bearer ${token}`)
        .send({ url: "http://newtest.com" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /users/deleteUrl/:id", () => {
    it("Should delete the URL", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "jhon@test.com",
        password: "tester123",
      });
      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.token;

      // delete the URL
      const response = await request(app)
        .delete("/users/deleteUrl/abc123")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("URL deleted successfully");
    });

    it("Should return error if the URL is not found", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "jhon@test.com",
        password: "tester123",
      });
      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.token;

      // delete the URL
      const response = await request(app)
        .delete("/users/deleteUrl/wrongId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("URL not found");
    });

    it("Should return error if the user is not the owner of the URL", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "jane@test.com",
        password: "tester123",
      });

      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.token;

      // delete the URL
      const response = await request(app)
        .delete("/users/deleteUrl/abc123")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Forbidden");
    });

    it("Should return error if URL was deleted before", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "jhon@test.com",
        password: "tester123",
      });

      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.token;

      // delete the URL
      const response = await request(app)
        .delete("/users/deleteUrl/del123")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("URL deleted successfully");

      const secondResponse = await request(app)
        .delete("/users/deleteUrl/del123")
        .set("Authorization", `Bearer ${token}`);

      expect(secondResponse.status).toBe(400);
      expect(secondResponse.body).toHaveProperty("message");
      expect(secondResponse.body.message).toBe("URL already deleted");
    });
  });
});
