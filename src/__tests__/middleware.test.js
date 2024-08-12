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
(0, globals_1.describe)("Auth middleware", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // create the table
        yield index_2.db.query("CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))");
        // create a user
        const hashedPassword = yield bcrypt_1.default.hash("tester123", 10);
        yield index_2.db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", ["Jhon Doe", "jhon@test.com", hashedPassword]);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // drop the table
        yield index_2.db.query("DROP TABLE users");
    }));
    (0, globals_1.it)("should return 401 if the user is not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).get("/users/me");
        (0, globals_1.expect)(response.status).toBe(401);
        (0, globals_1.expect)(response.body).toHaveProperty("message", "Unauthorized");
    }));
    (0, globals_1.it)("should return 401 if the token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/users/me")
            .set("Authorization", "Bearer invalidtoken");
        (0, globals_1.expect)(response.status).toBe(401);
        (0, globals_1.expect)(response.body).toHaveProperty("message", "Unauthorized");
    }));
    (0, globals_1.it)("should return 401 if the user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/users/me")
            .set("Authorization", "Bearer invalidtoken");
        (0, globals_1.expect)(response.status).toBe(401);
        (0, globals_1.expect)(response.body).toHaveProperty("message", "Unauthorized");
    }));
    (0, globals_1.it)("should return 200 if the user is authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "jhon@test.com",
            password: "tester123",
        });
        (0, globals_1.expect)(loginResponse.status).toBe(200);
        const token = loginResponse.body.token;
        const meResponse = yield (0, supertest_1.default)(index_1.default)
            .get("/users/me")
            .set("Authorization", `Bearer ${token}`);
        (0, globals_1.expect)(meResponse.status).toBe(200);
        (0, globals_1.expect)(meResponse.body).toHaveProperty("id");
        (0, globals_1.expect)(meResponse.body).toHaveProperty("email");
    }));
});
