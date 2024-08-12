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
(0, globals_1.describe)("Users controller", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_2.db.query("DROP TABLE IF EXISTS users");
        yield index_2.db.query("DROP TABLE IF EXISTS urls");
        // create users table
        yield index_2.db.query("CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))");
        // create a user
        const hashedPassword = yield bcrypt_1.default.hash("tester123", 10);
        yield index_2.db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", ["Jhon Doe", "jhon@test.com", hashedPassword]);
        yield index_2.db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", ["Jane Doe", "jane@test.com", hashedPassword]);
        // create urls table
        yield index_2.db.query("CREATE TABLE urls (id VARCHAR(6) PRIMARY KEY, owner INTEGER, url_target TEXT, access_counter INTEGER, last_update TIMESTAMP, exclude_date TIMESTAMP DEFAULT NULL)");
        // create url
        yield index_2.db.query("INSERT INTO urls (id, owner, url_target, access_counter, last_update) VALUES ($1, $2, $3, $4, $5)", ["abc123", 1, "http://test.com", 0, new Date()]);
        // delete url
        yield index_2.db.query("INSERT INTO urls (id, owner, url_target, access_counter, last_update) VALUES ($1, $2, $3, $4, $5)", ["del123", 1, "http://test.com", 0, new Date()]);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // drop the table
        yield index_2.db.query("DROP TABLE users");
        yield index_2.db.query("DROP TABLE urls");
    }));
    (0, globals_1.describe)("GET /users/getUserUrls", () => {
        (0, globals_1.it)("should return all the URLs for a user", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
                email: "jhon@test.com",
                password: "tester123",
            });
            (0, globals_1.expect)(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            const response = yield (0, supertest_1.default)(index_1.default)
                .get("/users/getUserUrls")
                .set("Authorization", `Bearer ${token}`);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body[0]).toHaveProperty("id");
            (0, globals_1.expect)(response.body[0]).toHaveProperty("owner");
            (0, globals_1.expect)(response.body[0]).toHaveProperty("url_target");
            (0, globals_1.expect)(response.body[0]).toHaveProperty("access_counter");
            (0, globals_1.expect)(response.body[0]).toHaveProperty("last_update");
            (0, globals_1.expect)(response.body[0]).toHaveProperty("exclude_date");
        }));
        (0, globals_1.it)("Should return error if the user is not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default).get("/users/getUserUrls");
            (0, globals_1.expect)(response.status).toBe(401);
            (0, globals_1.expect)(response.body).toHaveProperty("message");
            (0, globals_1.expect)(response.body.message).toBe("Unauthorized");
        }));
    });
    (0, globals_1.describe)("PUT /users/updateUrl/:id", () => {
        (0, globals_1.it)("Should update the URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
                email: "jhon@test.com",
                password: "tester123",
            });
            (0, globals_1.expect)(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            // update the URL
            const response = yield (0, supertest_1.default)(index_1.default)
                .put("/users/updateUrl/abc123")
                .set("Authorization", `Bearer ${token}`)
                .send({ url: "http://newtest.com" });
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty("message");
            (0, globals_1.expect)(response.body.message).toBe("URL updated successfully");
        }));
        (0, globals_1.it)("Should return error if the URL is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
                email: "jhon@test.com",
                password: "tester123",
            });
            (0, globals_1.expect)(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            // update the URL
            const response = yield (0, supertest_1.default)(index_1.default)
                .put("/users/updateUrl/wrongId")
                .set("Authorization", `Bearer ${token}`)
                .send({ url: "http://newtest.com" });
            (0, globals_1.expect)(response.status).toBe(404);
            (0, globals_1.expect)(response.body).toHaveProperty("message");
            (0, globals_1.expect)(response.body.message).toBe("URL not found");
        }));
        (0, globals_1.it)("Should return error if the user is not the owner of the URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
                email: "jane@test.com",
                password: "tester123",
            });
            (0, globals_1.expect)(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            // update the URL
            const response = yield (0, supertest_1.default)(index_1.default)
                .put("/users/updateUrl/abc123")
                .set("Authorization", `Bearer ${token}`)
                .send({ url: "http://newtest.com" });
            (0, globals_1.expect)(response.status).toBe(403);
            (0, globals_1.expect)(response.body).toHaveProperty("message");
            (0, globals_1.expect)(response.body.message).toBe("Forbidden");
        }));
        (0, globals_1.it)("Should return error if the URL is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
                email: "jhon@test.com",
                password: "tester123",
            });
            (0, globals_1.expect)(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            // update the URL
            const response = yield (0, supertest_1.default)(index_1.default)
                .put("/users/updateUrl/abc123")
                .set("Authorization", `Bearer ${token}`)
                .send({});
            (0, globals_1.expect)(response.status).toBe(400);
            (0, globals_1.expect)(response.body).toHaveProperty("message");
            (0, globals_1.expect)(response.body.message).toBe("URL is required");
        }));
        (0, globals_1.it)("Should return 404 if the ID is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
                email: "jhon@test.com",
                password: "tester123",
            });
            (0, globals_1.expect)(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            // update the URL
            const response = yield (0, supertest_1.default)(index_1.default)
                .put("/users/updateUrl/")
                .set("Authorization", `Bearer ${token}`)
                .send({ url: "http://newtest.com" });
            (0, globals_1.expect)(response.status).toBe(404);
        }));
    });
    (0, globals_1.describe)("DELETE /users/deleteUrl/:id", () => {
        (0, globals_1.it)("Should delete the URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
                email: "jhon@test.com",
                password: "tester123",
            });
            (0, globals_1.expect)(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            // delete the URL
            const response = yield (0, supertest_1.default)(index_1.default)
                .delete("/users/deleteUrl/abc123")
                .set("Authorization", `Bearer ${token}`);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty("message");
            (0, globals_1.expect)(response.body.message).toBe("URL deleted successfully");
        }));
        (0, globals_1.it)("Should return error if the URL is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
                email: "jhon@test.com",
                password: "tester123",
            });
            (0, globals_1.expect)(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            // delete the URL
            const response = yield (0, supertest_1.default)(index_1.default)
                .delete("/users/deleteUrl/wrongId")
                .set("Authorization", `Bearer ${token}`);
            (0, globals_1.expect)(response.status).toBe(404);
            (0, globals_1.expect)(response.body).toHaveProperty("message");
            (0, globals_1.expect)(response.body.message).toBe("URL not found");
        }));
        (0, globals_1.it)("Should return error if the user is not the owner of the URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
                email: "jane@test.com",
                password: "tester123",
            });
            (0, globals_1.expect)(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            // delete the URL
            const response = yield (0, supertest_1.default)(index_1.default)
                .delete("/users/deleteUrl/abc123")
                .set("Authorization", `Bearer ${token}`);
            (0, globals_1.expect)(response.status).toBe(403);
            (0, globals_1.expect)(response.body).toHaveProperty("message");
            (0, globals_1.expect)(response.body.message).toBe("Forbidden");
        }));
        (0, globals_1.it)("Should return error if URL was deleted before", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
                email: "jhon@test.com",
                password: "tester123",
            });
            (0, globals_1.expect)(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            // delete the URL
            const response = yield (0, supertest_1.default)(index_1.default)
                .delete("/users/deleteUrl/del123")
                .set("Authorization", `Bearer ${token}`);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty("message");
            (0, globals_1.expect)(response.body.message).toBe("URL deleted successfully");
            const secondResponse = yield (0, supertest_1.default)(index_1.default)
                .delete("/users/deleteUrl/del123")
                .set("Authorization", `Bearer ${token}`);
            (0, globals_1.expect)(secondResponse.status).toBe(400);
            (0, globals_1.expect)(secondResponse.body).toHaveProperty("message");
            (0, globals_1.expect)(secondResponse.body.message).toBe("URL already deleted");
        }));
    });
});
