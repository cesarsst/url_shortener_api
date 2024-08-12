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
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const shortenUrl_1 = require("../src/utils/shortenUrl");
const url_1 = require("../src/utils/url");
(0, globals_1.describe)("Utils", () => {
    (0, globals_1.it)("should return a valid hash with lenght 6", () => __awaiter(void 0, void 0, void 0, function* () {
        const hash = (0, shortenUrl_1.generateShortHash)();
        (0, globals_1.expect)(hash).toHaveLength(6);
    }));
    (0, globals_1.it)("Should return true if the url is valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const url = "https://www.google.com";
        (0, globals_1.expect)((0, url_1.verifyIfUrlIsValid)(url)).toBe(true);
    }));
    (0, globals_1.it)("Should return false if the url is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const url = "www.google.com";
        (0, globals_1.expect)((0, url_1.verifyIfUrlIsValid)(url)).toBe(false);
    }));
});
