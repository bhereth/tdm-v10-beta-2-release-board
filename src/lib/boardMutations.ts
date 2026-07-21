import type { BoardData, TaskStatusValue } from "@/types/board";

export class BoardMutationError extends Error {}

function findTaskOrThrow(board: BoardData, taskNumber: number) {
  const task = board.tasks.find((t) => t.number === taskNumber);
  if (!task) {
    throw new BoardMutationError(`No task numbered ${taskNumber}.`);
  }
  return task;
}

/** Moves a task between "In Progress" and "Ready to Reveal". Once a task
 * has been revealed, its status is locked — this mirrors "a completed card
 * can't be hidden or unrevealed" from the original interactive design. */
export function setTaskStatus(
  board: BoardData,
  taskNumber: number,
  status: TaskStatusValue
): BoardData {
  const task = findTaskOrThrow(board, taskNumber);
  if (task.revealed) {
    throw new BoardMutationError(
      `Task ${taskNumber} has already been revealed; its status can't change.`
    );
  }
  return {
    ...board,
    tasks: board.tasks.map((t) =>
      t.number === taskNumber ? { ...t, status } : t
    ),
  };
}

export interface RevealOutcome {
  board: BoardData;
  alreadyRevealed: boolean;
}

/** Reveals a task's prize. Requires the task to already be "Ready to
 * Reveal". Calling it again on an already-revealed task is a no-op that
 * reports `alreadyRevealed: true` rather than an error, so re-running the
 * script is always safe. */
export function revealTask(
  board: BoardData,
  taskNumber: number,
  now: Date = new Date()
): RevealOutcome {
  const task = findTaskOrThrow(board, taskNumber);

  if (task.revealed) {
    return { board, alreadyRevealed: true };
  }

  if (task.status !== "READY_TO_REVEAL") {
    throw new BoardMutationError(
      `Task ${taskNumber} isn't marked Ready to Reveal yet. Run ` +
        `"npm run board -- status ${taskNumber} READY_TO_REVEAL" first.`
    );
  }

  const revealedAt = now.toISOString();
  return {
    board: {
      ...board,
      tasks: board.tasks.map((t) =>
        t.number === taskNumber ? { ...t, revealed: true, revealedAt } : t
      ),
    },
    alreadyRevealed: false,
  };
}
