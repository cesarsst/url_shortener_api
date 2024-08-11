import { describe, it, expect } from "@jest/globals";

import { generateShortHash } from "../src/utils/shortenUrl";

describe("Utils", () => {
  it("should return a valid hash with lenght 6", async () => {
    const hash = generateShortHash();
    expect(hash).toHaveLength(6);
  });
});
