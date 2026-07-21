import { describe, expect, it } from "vitest";
import { shuffle } from "@/lib/shuffle";

describe("shuffle", () => {
  it("returns a permutation containing exactly the same elements", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...input].sort());
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it("eventually produces more than one distinct ordering", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const orderings = new Set<string>();
    for (let i = 0; i < 50; i++) {
      orderings.add(shuffle(input).join(","));
    }
    expect(orderings.size).toBeGreaterThan(1);
  });
});
