import { describe, it, expect } from "vitest";
import { toBaseUnits, fromBaseUnits, SorobanCallError } from "./soroban";

describe("Soroban amount precision boundaries and large integers", () => {
  it("handles max safe integer bigint conversions and boundaries correctly", () => {
    const maxTokenAmount = BigInt("9223372036854775807"); // i128 max / i64 max boundary
    const formatted = fromBaseUnits(maxTokenAmount, 7);
    expect(formatted).toBeDefined();
    const parsed = toBaseUnits(formatted, 7);
    expect(parsed).toBe(maxTokenAmount);
  });

  it("respects different token decimals (0, 6, 7, 18) without precision loss", () => {
    // 0 decimals
    expect(toBaseUnits("100", 0)).toBe(100n);
    expect(fromBaseUnits(100n, 0)).toBe("100");

    // 6 decimals (USDC style)
    expect(toBaseUnits("1.5", 6)).toBe(1500000n);
    expect(fromBaseUnits(1500000n, 6)).toBe("1.5");

    // 7 decimals (XLM stroops style)
    expect(toBaseUnits("1.2345678", 7)).toBe(12345678n);
    expect(fromBaseUnits(12345678n, 7)).toBe("1.2345678");

    // 18 decimals (Wei style)
    expect(toBaseUnits("0.000000000000000001", 18)).toBe(1n);
    expect(fromBaseUnits(1n, 18)).toBe("0.000000000000000001");
  });

  it("handles rounding boundaries and fractional truncation correctly", () => {
    expect(toBaseUnits("1.123456789", 7)).toBe(11234568n);
  });

  it("rejects non-positive numbers with SorobanCallError", () => {
    expect(() => toBaseUnits("0", 7)).toThrowError(SorobanCallError);
    expect(() => toBaseUnits("-5", 7)).toThrowError(SorobanCallError);
    expect(() => toBaseUnits("abc", 7)).toThrowError(SorobanCallError);
  });
});
