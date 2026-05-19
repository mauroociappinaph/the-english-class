import { describe, it, expect } from "vitest";
import { CefrClassifier } from "../CefrClassifier";

describe("CefrClassifier", () => {
  it("should classify extremely common A1 words correctly", () => {
    expect(CefrClassifier.classify("how")).toBe("A1");
    expect(CefrClassifier.classify("hello")).toBe("A1");
    expect(CefrClassifier.classify("dog")).toBe("A1");
    expect(CefrClassifier.classify("work")).toBe("A1");
    expect(CefrClassifier.classify("  how  ")).toBe("A1"); // trim check
    expect(CefrClassifier.classify("HOW")).toBe("A1"); // case insensitivity check
  });

  it("should classify common A2 words correctly", () => {
    expect(CefrClassifier.classify("airport")).toBe("A2");
    expect(CefrClassifier.classify("computer")).toBe("A2");
    expect(CefrClassifier.classify("expensive")).toBe("A2");
  });

  it("should classify numeric strings as A1", () => {
    expect(CefrClassifier.classify("123")).toBe("A1");
    expect(CefrClassifier.classify("7")).toBe("A1");
  });

  it("should return null for less common words", () => {
    expect(CefrClassifier.classify("serendipity")).toBeNull();
    expect(CefrClassifier.classify("quintessential")).toBeNull();
    expect(CefrClassifier.classify("chock-a-block")).toBeNull();
  });
});
