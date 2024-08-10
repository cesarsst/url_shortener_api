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
const globals_1 = require("@jest/globals");
const index_1 = __importDefault(require("../src/index"));
(0, globals_1.describe)("GET /login", () => {
    (0, globals_1.it)("should return 400 Bad Request", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "",
            password: "",
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body).toEqual({
            message: "Email and password are required",
        });
    }));
    (0, globals_1.it)("should return 401 Unauthorized", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "wrong-email",
            password: "wrong-password",
        });
        (0, globals_1.expect)(response.status).toBe(401);
        (0, globals_1.expect)(response.body).toEqual({
            message: "Invalid credentials",
        });
    }));
    (0, globals_1.it)("should return 200 OK", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "test@test.com",
            password: "your_secret_key",
        });
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body).toEqual({
            message: "Login successful",
        });
    }));
});
