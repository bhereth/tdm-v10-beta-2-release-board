import { describe, expect, it } from "vitest";
import { buildFreshBoard } from "@/lib/buildBoard";
import {
  BoardMutationError,
  revealTask,
  setTaskStatus,
} from "@/lib/boardMutations";

describe("setTaskStatus", () => {
  it("moves a task between In Progress and Ready to Reveal", () => {
    const board = buildFreshBoard();
    const ready = setTaskStatus(board, 1, "READY_TO_REVEAL");
    expect(ready.tasks.find((t) => t.number === 1)!.status).toBe(
      "READY_TO_REVEAL"
    );

    const reverted = setTaskStatus(ready, 1, "IN_PROGRESS");
    expect(reverted.tasks.find((t) => t.number === 1)!.status).toBe(
      "IN_PROGRESS"
    );
  });

  it("does not mutate the input board", () => {
    const board = buildFreshBoard();
    setTaskStatus(board, 1, "READY_TO_REVEAL");
    expect(board.tasks.find((t) => t.number === 1)!.status).toBe(
      "IN_PROGRESS"
    );
  });

  it("throws for an unknown task number", () => {
    const board = buildFreshBoard();
    expect(() => setTaskStatus(board, 99, "READY_TO_REVEAL")).toThrow(
      BoardMutationError
    );
  });

  it("refuses to change status once a task has been revealed", () => {
    let board = buildFreshBoard();
    board = setTaskStatus(board, 1, "READY_TO_REVEAL");
    board = revealTask(board, 1).board;

    expect(() => setTaskStatus(board, 1, "IN_PROGRESS")).toThrow(
      BoardMutationError
    );
  });
});

describe("revealTask", () => {
  it("refuses to reveal a task that is still In Progress", () => {
    const board = buildFreshBoard();
    expect(() => revealTask(board, 1)).toThrow(BoardMutationError);
  });

  it("reveals a Ready to Reveal task", () => {
    let board = buildFreshBoard();
    board = setTaskStatus(board, 3, "READY_TO_REVEAL");

    const { board: revealed, alreadyRevealed } = revealTask(board, 3);
    expect(alreadyRevealed).toBe(false);
    const task = revealed.tasks.find((t) => t.number === 3)!;
    expect(task.revealed).toBe(true);
    expect(task.revealedAt).not.toBeNull();
  });

  it("is idempotent: revealing an already-revealed task is a no-op, not an error", () => {
    let board = buildFreshBoard();
    board = setTaskStatus(board, 4, "READY_TO_REVEAL");
    const first = revealTask(board, 4);

    const second = revealTask(first.board, 4);
    expect(second.alreadyRevealed).toBe(true);
    expect(second.board).toEqual(first.board);
  });

  it("throws for an unknown task number", () => {
    const board = buildFreshBoard();
    expect(() => revealTask(board, 99)).toThrow(BoardMutationError);
  });

  it("never reassigns a different prize on repeated reveals", () => {
    let board = buildFreshBoard();
    board = setTaskStatus(board, 9, "READY_TO_REVEAL");
    const first = revealTask(board, 9);
    const second = revealTask(first.board, 9);

    const prizeIdFirst = first.board.tasks.find((t) => t.number === 9)!.prizeId;
    const prizeIdSecond = second.board.tasks.find((t) => t.number === 9)!
      .prizeId;
    expect(prizeIdFirst).toBe(prizeIdSecond);
  });
});
