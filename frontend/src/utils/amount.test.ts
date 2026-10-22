import { describe, it, expect } from "vitest";
import { parseAmount, formatAmount } from "./amount";

describe("parseAmount edge cases (negative, excessive precision, rounding)", () => {
  it("handles negative amounts correctly", () => {
    // parseAmount treats negative values as invalid/zero (returns 0n)
    expect(parseAmount("-1.5", 7)).toBe(0n);
    expect(parseAmount("-0", 7)).toBe(0n);
  });

  it("handles excessive precision by truncating extra decimal places", () => {
    // 7 decimals max, input has 9
    expect(parseAmount("1.123456789", 7)).toBe(11234567n);
    expect(parseAmount("0.000000123", 7)).toBe(1n);
  });

  it("handles halfway rounding / boundary inputs correctly", () => {
    // parseAmount currently floors/truncates excess precision rather than rounding
    expect(parseAmount("1.12345674", 7)).toBe(11234567n);
    expect(parseAmount("1.12345676", 7)).toBe(11234567n);
  });

  it("round-trips positive boundary values properly", () => {
    const val = 1234567n;
    const formatted = formatAmount(val, 7);
    expect(parseAmount(formatted, 7)).toBe(val);
  });
});
