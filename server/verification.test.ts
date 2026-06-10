import { describe, it, expect, vi } from "vitest";
import {
  generateVerificationCode,
  calculateExpiryDate,
} from "./verificationDb";

describe("Verification Database Helpers", () => {
  describe("generateVerificationCode", () => {
    it("should generate a unique verification code", () => {
      const code1 = generateVerificationCode();
      const code2 = generateVerificationCode();

      expect(code1).toMatch(/^VER-[A-Z0-9]+-[A-Z0-9]+$/);
      expect(code2).toMatch(/^VER-[A-Z0-9]+-[A-Z0-9]+$/);
      expect(code1).not.toBe(code2);
    });

    it("should generate code with correct format", () => {
      const code = generateVerificationCode();
      const parts = code.split("-");

      expect(parts.length).toBe(3);
      expect(parts[0]).toBe("VER");
      expect(parts[1]).toMatch(/^[A-Z0-9]+$/);
      expect(parts[2]).toMatch(/^[A-Z0-9]+$/);
    });
  });

  describe("calculateExpiryDate", () => {
    it("should calculate expiry date 365 days from now by default", () => {
      const now = new Date();
      const expiryDate = calculateExpiryDate();

      const diffInMs = expiryDate.getTime() - now.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      expect(diffInDays).toBe(365);
    });

    it("should calculate expiry date with custom validity days", () => {
      const now = new Date();
      const validityDays = 90;
      const expiryDate = calculateExpiryDate(validityDays);

      const diffInMs = expiryDate.getTime() - now.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      expect(diffInDays).toBe(validityDays);
    });

    it("should return a future date", () => {
      const now = new Date();
      const expiryDate = calculateExpiryDate();

      expect(expiryDate.getTime()).toBeGreaterThan(now.getTime());
    });
  });
});
