import boardJson from "@/data/board.json";
import type {
  BoardData,
  PublicBoardState,
  PublicPrize,
  PublicTask,
  RawPrize,
  RawTask,
} from "@/types/board";

const data = boardJson as BoardData;

function toPublicTask(task: RawTask, prizesById: Map<string, RawPrize>): PublicTask {
  const prize = task.revealed ? prizesById.get(task.prizeId) : undefined;
  return {
    number: task.number,
    name: task.name,
    description: task.description,
    icon: task.icon,
    status: task.status,
    revealed: task.revealed,
    revealedAt: task.revealedAt,
    prize: prize
      ? { id: prize.id, name: prize.name, description: prize.description }
      : null,
  };
}

function toPublicPrize(prize: RawPrize, tasks: RawTask[]): PublicPrize {
  const owningTask = tasks.find((t) => t.prizeId === prize.id);
  return {
    id: prize.id,
    name: prize.name,
    description: prize.description,
    revealed: Boolean(owningTask?.revealed),
    revealedAt: owningTask?.revealed ? owningTask.revealedAt : null,
  };
}

/**
 * Shapes raw board data into what the page renders. Critically, an
 * unrevealed task's `prize` field is stripped out entirely here — at build
 * time, before anything is sent to the browser — rather than merely hidden
 * by CSS, so the mystery prize for a still-locked task never shows up in
 * the page's HTML or hydration payload.
 *
 * Note: this only protects site *visitors*. Anyone who reads
 * src/data/board.json in the repository (or its git history) can see the
 * full assignment, since a fully static, git-committed site has no
 * server-side place to keep a secret from people with read access to the
 * source. See the README for more on this tradeoff.
 *
 * Exported separately from `getBoardState()` (which reads the real,
 * currently-committed board.json) so tests can exercise the shaping logic
 * against a fixture instead of whatever state the live file happens to be
 * in — the actual board changes over time as tasks get revealed.
 */
export function shapeBoardState(data: BoardData): PublicBoardState {
  const prizesById = new Map(data.prizes.map((p) => [p.id, p] as const));
  const tasks = [...data.tasks]
    .sort((a, b) => a.number - b.number)
    .map((task) => toPublicTask(task, prizesById));
  const prizes = data.prizes.map((prize) => toPublicPrize(prize, data.tasks));

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.revealed).length;
  const completedAt =
    completedCount === totalCount && totalCount > 0
      ? tasks.reduce<string | null>((latest, t) => {
          if (!t.revealedAt) return latest;
          return !latest || t.revealedAt > latest ? t.revealedAt : latest;
        }, null)
      : null;

  return {
    title: data.title,
    subtitle: data.subtitle,
    releaseName: data.releaseName,
    tasks,
    prizes,
    mysteryPerkOptions: data.mysteryPerkOptions,
    completedCount,
    totalCount,
    completedAt,
  };
}

/** The board state for the currently-committed src/data/board.json. */
export function getBoardState(): PublicBoardState {
  return shapeBoardState(data);
}
