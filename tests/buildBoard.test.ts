import { describe, expect, it } from "vitest";
import { buildFreshBoard } from "@/lib/buildBoard";

describe("buildFreshBoard", () => {
  it("creates nine tasks and nine prizes", () => {
    const board = buildFreshBoard();
    expect(board.tasks).toHaveLength(9);
    expect(board.prizes).toHaveLength(9);
  });

  it("assigns each of the 9 prizes to exactly one task, with no duplicates and no task special-cased", () => {
    const board = buildFreshBoard();
    const assignedIds = board.tasks.map((t) => t.prizeId);

    expect(assignedIds).toHaveLength(9);
    expect(new Set(assignedIds).size).toBe(9); // no duplicates

    const prizeIds = board.prizes.map((p) => p.id);
    expect([...assignedIds].sort()).toEqual([...prizeIds].sort());
  });

  it("starts every task In Progress and unrevealed", () => {
    const board = buildFreshBoard();
    for (const task of board.tasks) {
      expect(task.status).toBe("IN_PROGRESS");
      expect(task.revealed).toBe(false);
      expect(task.revealedAt).toBeNull();
    }
  });

  it("produces more than one distinct assignment across repeated calls (it's actually randomized)", () => {
    const assignments = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const board = buildFreshBoard();
      const key = [...board.tasks]
        .sort((a, b) => a.number - b.number)
        .map((t) => t.prizeId)
        .join(",");
      assignments.add(key);
    }
    expect(assignments.size).toBeGreaterThan(1);
  });

  it("can assign any prize to task 9 across repeated calls (no task is special-cased)", () => {
    const prizesSeenOnTask9 = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const board = buildFreshBoard();
      const task9 = board.tasks.find((t) => t.number === 9)!;
      prizesSeenOnTask9.add(task9.prizeId);
    }
    expect(prizesSeenOnTask9.size).toBeGreaterThan(1);
  });
});
