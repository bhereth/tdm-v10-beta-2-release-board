import { shuffle } from "@/lib/shuffle";
import {
  DEFAULT_MYSTERY_PERK_OPTIONS,
  DEFAULT_SUBTITLE,
  DEFAULT_TITLE,
  INITIAL_PRIZES,
  INITIAL_TASKS,
} from "@/lib/constants";
import type { BoardData, RawPrize, RawTask } from "@/types/board";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Builds a brand-new board: all nine prizes shuffled across all nine
 * tasks, with no special-cased task or prize. Used by
 * `scripts/board.ts init` / `reset` to (re)write src/data/board.json —
 * never called at build/render time, so the assignment only changes when
 * someone deliberately re-initializes it.
 */
export function buildFreshBoard(): BoardData {
  const prizes: RawPrize[] = INITIAL_PRIZES.map((p, i) => ({
    id: slugify(p.name) || `prize-${i + 1}`,
    name: p.name,
    description: p.description,
  }));

  if (prizes.length !== INITIAL_TASKS.length) {
    throw new Error("Task/prize configuration sizes don't line up.");
  }

  const shuffledPrizes = shuffle(prizes);
  const tasks: RawTask[] = INITIAL_TASKS.map((taskDef, i): RawTask => {
    const prize = shuffledPrizes[i];
    if (!prize) throw new Error("Ran out of prizes to assign.");
    return {
      number: taskDef.number,
      name: taskDef.name,
      description: taskDef.description,
      icon: taskDef.icon,
      status: "IN_PROGRESS",
      revealed: false,
      revealedAt: null,
      prizeId: prize.id,
    };
  }).sort((a, b) => a.number - b.number);

  return {
    title: DEFAULT_TITLE,
    subtitle: DEFAULT_SUBTITLE,
    releaseName: null,
    tasks,
    prizes,
    mysteryPerkOptions: [...DEFAULT_MYSTERY_PERK_OPTIONS],
  };
}
