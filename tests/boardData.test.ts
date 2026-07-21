import { describe, expect, it } from "vitest";
import { shapeBoardState } from "@/lib/boardData";
import { buildFreshBoard } from "@/lib/buildBoard";
import { revealTask, setTaskStatus } from "@/lib/boardMutations";
import type { BoardData } from "@/types/board";

describe("shapeBoardState", () => {
  it("hides which prize is behind an unrevealed task", () => {
    const board = buildFreshBoard();
    const state = shapeBoardState(board);
    for (const task of state.tasks) {
      expect(task.revealed).toBe(false);
      expect(task.prize).toBeNull();
    }
  });

  it("exposes prize identity only once a task is revealed", () => {
    let board = buildFreshBoard();
    board = setTaskStatus(board, 1, "READY_TO_REVEAL");
    board = revealTask(board, 1).board;

    const state = shapeBoardState(board);
    const task1 = state.tasks.find((t) => t.number === 1)!;
    const task2 = state.tasks.find((t) => t.number === 2)!;

    expect(task1.prize).not.toBeNull();
    expect(task1.prize?.name).toBeTruthy();
    expect(task2.prize).toBeNull();
  });

  it("marks a prize as revealed/unlocked only when its owning task is revealed", () => {
    let board = buildFreshBoard();
    board = setTaskStatus(board, 9, "READY_TO_REVEAL");
    board = revealTask(board, 9).board;

    const state = shapeBoardState(board);
    const task9 = board.tasks.find((t) => t.number === 9)!;
    const revealedPrize = state.prizes.find((p) => p.id === task9.prizeId)!;
    expect(revealedPrize.revealed).toBe(true);
    expect(revealedPrize.revealedAt).not.toBeNull();

    const stillLocked = state.prizes.filter((p) => p.id !== task9.prizeId);
    expect(stillLocked.every((p) => !p.revealed)).toBe(true);
  });

  it("never leaks which task a locked prize belongs to", () => {
    // The prize pool view carries no task-number/id field at all, so
    // there's nothing in a PublicPrize that could point back to its task.
    const board = buildFreshBoard();
    const state = shapeBoardState(board);
    for (const prize of state.prizes) {
      expect(Object.keys(prize).sort()).toEqual(
        ["description", "id", "name", "revealed", "revealedAt"].sort()
      );
    }
  });

  it("sets completedAt only once every task is revealed, to the latest revealedAt", () => {
    let board = buildFreshBoard();
    expect(shapeBoardState(board).completedAt).toBeNull();

    for (const task of board.tasks) {
      board = setTaskStatus(board, task.number, "READY_TO_REVEAL");
      board = revealTask(board, task.number).board;
    }

    const state = shapeBoardState(board);
    expect(state.completedCount).toBe(state.totalCount);
    expect(state.completedAt).not.toBeNull();

    const latestRevealedAt = board.tasks
      .map((t) => t.revealedAt)
      .filter((v): v is string => Boolean(v))
      .sort()
      .at(-1);
    expect(state.completedAt).toBe(latestRevealedAt);
  });

  it("reports accurate completed/total counts partway through", () => {
    let board = buildFreshBoard();
    board = setTaskStatus(board, 2, "READY_TO_REVEAL");
    board = revealTask(board, 2).board;
    board = setTaskStatus(board, 5, "READY_TO_REVEAL");
    board = revealTask(board, 5).board;

    const state = shapeBoardState(board);
    expect(state.completedCount).toBe(2);
    expect(state.totalCount).toBe(9);
    expect(state.completedAt).toBeNull();
  });

  it("passes through title/subtitle/releaseName/mysteryPerkOptions unchanged", () => {
    const board: BoardData = {
      ...buildFreshBoard(),
      title: "Custom Title",
      subtitle: "Custom subtitle",
      releaseName: "v10.0-beta.2",
      mysteryPerkOptions: ["Option A", "Option B"],
    };
    const state = shapeBoardState(board);
    expect(state.title).toBe("Custom Title");
    expect(state.subtitle).toBe("Custom subtitle");
    expect(state.releaseName).toBe("v10.0-beta.2");
    expect(state.mysteryPerkOptions).toEqual(["Option A", "Option B"]);
  });
});
