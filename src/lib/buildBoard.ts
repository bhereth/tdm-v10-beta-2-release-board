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
 * Builds a brand-new board: the eight non-final prizes shuffled across
 * Tasks 1–8, and the final prize (Team Outing) always on the last task.
 * Used by `scripts/board.ts init` / `reset` to (re)write
 * src/data/board.json — never called at build/render time, so the
 * assignment only changes when someone deliberately re-initializes it.
 */
export function buildFreshBoard(): BoardData {
  const prizes: RawPrize[] = INITIAL_PRIZES.map((p, i) => ({
    id: slugify(p.name) || `prize-${i + 1}`,
    name: p.name,
    description: p.description,
    isFinalPrize: p.isFinalPrize,
  }));

  const finalPrize = prizes.find((p) => p.isFinalPrize);
  if (!finalPrize) {
    throw new Error("Prize configuration is missing a final prize.");
  }
  const shuffledRegularPrizes = shuffle(prizes.filter((p) => !p.isFinalPrize));

  const finalTaskDef = INITIAL_TASKS[INITIAL_TASKS.length - 1];
  const regularTaskDefs = INITIAL_TASKS.slice(0, -1);
  if (!finalTaskDef || regularTaskDefs.length !== shuffledRegularPrizes.length) {
    throw new Error("Task/prize configuration sizes don't line up.");
  }

  const tasks: RawTask[] = regularTaskDefs.map((taskDef, i) => {
    const prize = shuffledRegularPrizes[i];
    if (!prize) throw new Error("Ran out of non-final prizes to assign.");
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
  });

  tasks.push({
    number: finalTaskDef.number,
    name: finalTaskDef.name,
    description: finalTaskDef.description,
    icon: finalTaskDef.icon,
    status: "IN_PROGRESS",
    revealed: false,
    revealedAt: null,
    prizeId: finalPrize.id,
  });

  tasks.sort((a, b) => a.number - b.number);

  return {
    title: DEFAULT_TITLE,
    subtitle: DEFAULT_SUBTITLE,
    releaseName: null,
    tasks,
    prizes,
    mysteryPerkOptions: [...DEFAULT_MYSTERY_PERK_OPTIONS],
  };
}
