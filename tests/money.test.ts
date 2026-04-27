import { describe, expect, it } from "vitest";
import { toMinor, toMajorString, formatINR } from "../lib/money";

describe("money helpers", () => {
  it("parses rupees with no decimal", () => {
    expect(toMinor("100")).toBe(10000);
  });

  it("parses rupees with two decimals", () => {
    expect(toMinor("1234.56")).toBe(123456);
  });

  it("handles single-decimal inputs", () => {
    expect(toMinor("0.5")).toBe(50);
  });

  it("rejects negative amounts", () => {
    expect(() => toMinor("-10")).toThrow();
  });

  it("rejects zero", () => {
    expect(() => toMinor("0")).toThrow();
    expect(() => toMinor("0.00")).toThrow();
  });

  it("rejects more than 2 decimals (no silent rounding)", () => {
    expect(() => toMinor("1.234")).toThrow();
  });

  it("round-trips through toMajorString", () => {
    expect(toMajorString(toMinor("999.99"))).toBe("999.99");
    expect(toMajorString(toMinor("1"))).toBe("1.00");
  });

  it("formats INR with grouping", () => {
    // 10,00,000 rupees in en-IN grouping
    expect(formatINR(toMinor("100000.50"))).toContain("₹");
    expect(formatINR(toMinor("100000.50"))).toContain("1,00,000");
  });
});
