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
// src/__tests__/index.test.ts
const supertest_1 = __importDefault(require("supertest"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const globals_1 = require("@jest/globals");
const index_1 = __importDefault(require("../src/index"));
const index_2 = require("../src/db/index");
(0, globals_1.describe)("GET /register", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // create the table
        yield index_2.db.query("CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))");
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // drop the table
        yield index_2.db.query("DROP TABLE users");
    }));
    (0, globals_1.it)("should register user and return a token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            name: "Jhon tester",
            email: "jhon@test.com",
            password: "tester123",
        });
        (0, globals_1.expect)(response.status).toBe(201);
        (0, globals_1.expect)(response.body).toHaveProperty("token");
    }));
    (0, globals_1.it)("should return 400 if user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            name: "Jhon tester",
            email: "jhon@test.com",
            password: "tester123",
        });
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            name: "Jhon tester",
            email: "jhon@test.com",
            password: "tester123",
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body).toHaveProperty("message", "User already exists");
    }));
    (0, globals_1.it)("should return 400 if name, email or password is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            name: "",
            email: "jhon@test.com",
            password: "tester123",
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body).toHaveProperty("message", [
            {
                location: "body",
                msg: "Invalid value",
                path: "name",
                type: "field",
                value: "",
            },
        ]);
        const response2 = yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            name: "Jhon tester",
            email: "",
            password: "tester123",
        });
        (0, globals_1.expect)(response2.status).toBe(400);
        (0, globals_1.expect)(response2.body).toHaveProperty("message", [
            {
                location: "body",
                msg: "Invalid value",
                path: "email",
                type: "field",
                value: "",
            },
        ]);
        const response3 = yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            name: "Jhon tester",
            email: "jhon@test.com",
            password: "",
        });
        (0, globals_1.expect)(response3.status).toBe(400);
        (0, globals_1.expect)(response3.body).toHaveProperty("message", [
            {
                location: "body",
                msg: "Invalid value",
                path: "password",
                type: "field",
                value: "",
            },
        ]);
    }));
    (0, globals_1.it)("should return 400 if password is less than 6 characters or invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            name: "Jhon tester",
            email: "jhon@test.com",
            password: "test",
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body.message).toMatchObject([
            {
                type: "field",
                value: "test",
                msg: "Invalid value",
                path: "password",
                location: "body",
            },
        ]);
    }));
    (0, globals_1.it)("Should return 400 if email is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            name: "Jhon tester",
            email: "jhon@test",
            password: "tester123",
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body.message).toMatchObject([
            {
                type: "field",
                value: "jhon@test",
                msg: "Invalid value",
                path: "email",
                location: "body",
            },
        ]);
    }));
});
(0, globals_1.describe)("GET /login", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // create the table
        yield index_2.db.query("CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))");
        // insert a user
        const hashedPassword = yield bcrypt_1.default.hash("tester123", 10);
        yield index_2.db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", ["Jhon tester", "jhon@test.com", hashedPassword]);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // drop the table
        yield index_2.db.query("DROP TABLE users");
    }));
    (0, globals_1.it)("should login user and return a token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "jhon@test.com",
            password: "tester123",
        });
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body).toHaveProperty("token");
    }));
    (0, globals_1.it)("should return 400 if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "usernotexist@test.com",
            password: "tester123",
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body).toHaveProperty("message", "User does not exist");
    }));
    (0, globals_1.it)("should return 400 if password is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "usernotexist@test.com",
            password: "tester123",
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body).toHaveProperty("message", "User does not exist");
    }));
});
