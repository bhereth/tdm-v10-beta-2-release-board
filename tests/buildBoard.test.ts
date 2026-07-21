import { describe, expect, it } from "vitest";
import { buildFreshBoard } from "@/lib/buildBoard";

describe("buildFreshBoard", () => {
  it("creates nine tasks and nine prizes", () => {
    const board = buildFreshBoard();
    expect(board.tasks).toHaveLength(9);
    expect(board.prizes).toHaveLength(9);
  });

  it("always assigns the final prize (Team Outing) to task 9", () => {
    for (let i = 0; i < 20; i++) {
      const board = buildFreshBoard();
      const task9 = board.tasks.find((t) => t.number === 9)!;
      const prize = board.prizes.find((p) => p.id === task9.prizeId)!;
      expect(prize.isFinalPrize).toBe(true);
      expect(prize.name).toBe("Team Outing");
    }
  });

  it("assigns each of the 8 non-final prizes to exactly one of tasks 1-8, with no duplicates", () => {
    const board = buildFreshBoard();
    const nonFinalTasks = board.tasks.filter((t) => t.number !== 9);
    const assignedIds = nonFinalTasks.map((t) => t.prizeId);

    expect(assignedIds).toHaveLength(8);
    expect(new Set(assignedIds).size).toBe(8); // no duplicates

    const nonFinalPrizeIds = board.prizes
      .filter((p) => !p.isFinalPrize)
      .map((p) => p.id);
    expect([...assignedIds].sort()).toEqual([...nonFinalPrizeIds].sort());
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
});
