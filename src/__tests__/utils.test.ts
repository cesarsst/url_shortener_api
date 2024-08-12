import { describe, it, expect } from "@jest/globals";

import { generateShortHash } from "../utils/shortenUrl";
import { verifyIfUrlIsValid } from "../utils/url";

describe("Utils", () => {
  it("should return a valid hash with lenght 6", async () => {
    const hash = generateShortHash();
    expect(hash).toHaveLength(6);
  });

  it("Should return true if the url is valid", async () => {
    const url = "https://www.google.com";
    expect(verifyIfUrlIsValid(url)).toBe(true);
  });

  it("Should return false if the url is invalid", async () => {
    const url = "www.google.com";
    expect(verifyIfUrlIsValid(url)).toBe(false);
  });
});
