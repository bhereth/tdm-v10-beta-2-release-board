// Pure, runtime-free type definitions for the static board data model.
// The board has no server and no database: `src/data/board.json` is the
// single source of truth, edited by hand or via `scripts/board.ts` and
// updated by committing + pushing to `main`.

export type TaskStatusValue = "IN_PROGRESS" | "READY_TO_REVEAL";

/** A task exactly as stored in src/data/board.json. */
export interface RawTask {
  number: number;
  name: string;
  description: string;
  icon: string;
  status: TaskStatusValue;
  revealed: boolean;
  revealedAt: string | null;
  /** Which prize this task holds — always present in the file, even
   * before the task is revealed. It's stripped out by `getBoardState()`
   * before anything is rendered, so the site itself never shows it early. */
  prizeId: string;
}

/** A prize exactly as stored in src/data/board.json. */
export interface RawPrize {
  id: string;
  name: string;
  description: string;
  isFinalPrize: boolean;
}

export interface BoardData {
  title: string;
  subtitle: string;
  releaseName: string | null;
  tasks: RawTask[];
  prizes: RawPrize[];
  mysteryPerkOptions: string[];
}

// --- Public/masked view: what the page actually renders. ---

export interface PublicTaskPrize {
  id: string;
  name: string;
  description: string;
}

export interface PublicTask {
  number: number;
  name: string;
  description: string;
  icon: string;
  status: TaskStatusValue;
  revealed: boolean;
  revealedAt: string | null;
  /** Only populated once `revealed` is true. */
  prize: PublicTaskPrize | null;
}

export interface PublicPrize {
  id: string;
  name: string;
  description: string;
  isFinalPrize: boolean;
  revealed: boolean;
  revealedAt: string | null;
}

export interface PublicBoardState {
  title: string;
  subtitle: string;
  releaseName: string | null;
  tasks: PublicTask[];
  prizes: PublicPrize[];
  mysteryPerkOptions: string[];
  completedCount: number;
  totalCount: number;
  completedAt: string | null;
}
