"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const index_1 = __importDefault(require("../src/index"));
const index_2 = require("../src/db/index");
const bcrypt_1 = __importDefault(require("bcrypt"));
(0, globals_1.describe)("Shorten URL controller", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_2.db.query("DROP TABLE IF EXISTS urls");
        yield index_2.db.query("DROP TABLE IF EXISTS users");
        // create users table
        yield index_2.db.query("CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))");
        // create a user
        const hashedPassword = yield bcrypt_1.default.hash("tester123", 10);
        yield index_2.db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", ["Jhon Doe", "jhon@test.com", hashedPassword]);
        // create urls table
        yield index_2.db.query("CREATE TABLE urls (id VARCHAR(6) PRIMARY KEY, owner INTEGER REFERENCES users(id) ON DELETE SET NULL, url_target TEXT NOT NULL, access_counter INTEGER DEFAULT 0, last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP, exclude_date TIMESTAMP DEFAULT NULL)");
        // create url
        yield index_2.db.query("INSERT INTO urls (id, owner, url_target, access_counter, last_update) VALUES ($1, $2, $3, $4, $5)", ["abc123", 1, "http://test.com", 0, new Date()]);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // drop the table
        yield index_2.db.query("DROP TABLE IF EXISTS urls");
        yield index_2.db.query("DROP TABLE IF EXISTS users");
    }));
    (0, globals_1.it)("Should return a shortened URL and save with owner reference", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "jhon@test.com",
            password: "tester123",
        });
        (0, globals_1.expect)(loginResponse.status).toBe(200);
        const token = loginResponse.body.token;
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/generateShortLink")
            .set("Authorization", `Bearer ${token}`)
            .send({ url: "http://test.com" });
        (0, globals_1.expect)(response.status).toBe(201);
        (0, globals_1.expect)(response.body).toHaveProperty("shortUrl");
        const shortUrl = response.body.shortUrl.split("/");
        const baseUrl = `${shortUrl[0]}//${shortUrl[2]}`;
        const path = shortUrl[3];
        (0, globals_1.expect)(baseUrl).toBe(process.env.BASE_URL);
        (0, globals_1.expect)(path).toHaveLength(6);
        // verify if the URL is in the database
        const url = yield index_2.db.query("SELECT * FROM urls WHERE id = $1", [path]);
        (0, globals_1.expect)(url.rows.length).toBe(1);
    }));
    (0, globals_1.it)("Should return a shortened URL without owner reference", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/generateShortLink")
            .send({ url: "http://test.com" });
        (0, globals_1.expect)(response.status).toBe(201);
        (0, globals_1.expect)(response.body).toHaveProperty("shortUrl");
        const shortUrl = response.body.shortUrl.split("/");
        const baseUrl = `${shortUrl[0]}//${shortUrl[2]}`;
        const path = shortUrl[3];
        (0, globals_1.expect)(baseUrl).toBe(process.env.BASE_URL);
        (0, globals_1.expect)(path).toHaveLength(6);
        // verify if the URL is in the database
        const url = yield index_2.db.query("SELECT * FROM urls WHERE id = $1", [path]);
        (0, globals_1.expect)(url.rows.length).toBe(1);
        (0, globals_1.expect)(url.rows[0].owner).toBeNull();
    }));
    (0, globals_1.it)("Should return an error when URL is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/generateShortLink").send({});
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body).toHaveProperty("message");
        (0, globals_1.expect)(response.body.message).toMatchObject([
            { location: "body", msg: "Invalid URL", path: "url", type: "field" },
        ]);
    }));
    (0, globals_1.it)("Should return an error when URL is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/generateShortLink")
            .send({ url: "test" });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body).toHaveProperty("message");
        (0, globals_1.expect)(response.body.message).toMatchObject([
            {
                location: "body",
                msg: "Invalid URL",
                path: "url",
                type: "field",
                value: "test",
            },
        ]);
    }));
    (0, globals_1.it)("Should return target URL when short URL is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).get("/abc123").send();
        (0, globals_1.expect)(response.status).toBe(302);
        (0, globals_1.expect)(response.header.location).toBe("http://test.com");
        // verify if the access_counter is updated
        const url = yield index_2.db.query("SELECT * FROM urls WHERE id = $1", ["abc123"]);
        (0, globals_1.expect)(url.rows[0].access_counter).toBe(1);
    }));
    (0, globals_1.it)("Should return an error when short URL is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).get("/notfound").send();
        (0, globals_1.expect)(response.status).toBe(404);
        (0, globals_1.expect)(response.body).toHaveProperty("message");
        (0, globals_1.expect)(response.body.message).toBe("URL not found");
    }));
});
