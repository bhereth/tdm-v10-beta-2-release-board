"use client";

import { useEffect, useState } from "react";
import type { PublicBoardState } from "@/types/board";
import { Header } from "@/components/Header";
import { TaskCard } from "@/components/TaskCard";
import { PrizePool } from "@/components/PrizePool";
import { CompletionBanner } from "@/components/CompletionBanner";

interface BoardProps {
  board: PublicBoardState;
}

// There's no server here, so "have you already seen this celebration"
// lives in the visitor's own browser rather than in a database. Each
// revealed task's `revealedAt` timestamp (and the board's overall
// `completedAt`) is a stable, unique marker — once we've recorded having
// shown the animation for a given timestamp, we won't replay it for that
// same reveal on this device again, even across refreshes.
const SEEN_REVEALS_KEY = "beta-release-challenge:seen-reveals";
const SEEN_COMPLETION_KEY = "beta-release-challenge:seen-completion";
const CELEBRATION_MS = 1600;

function loadSeenReveals(): Set<string> {
  try {
    const raw = window.localStorage.getItem(SEEN_REVEALS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function Board({ board }: BoardProps) {
  const { tasks, prizes } = board;
  const [celebrateTaskNumbers, setCelebrateTaskNumbers] = useState<Set<number>>(
    new Set()
  );
  const [celebrateCompletion, setCelebrateCompletion] = useState(false);

  useEffect(() => {
    const seenReveals = loadSeenReveals();
    const newlyRevealed = new Set<number>();
    for (const task of tasks) {
      if (task.revealed && task.revealedAt && !seenReveals.has(task.revealedAt)) {
        newlyRevealed.add(task.number);
        seenReveals.add(task.revealedAt);
      }
    }
    if (newlyRevealed.size === 0) return;

    setCelebrateTaskNumbers(newlyRevealed);
    window.localStorage.setItem(
      SEEN_REVEALS_KEY,
      JSON.stringify([...seenReveals])
    );
    const timeout = window.setTimeout(
      () => setCelebrateTaskNumbers(new Set()),
      CELEBRATION_MS
    );
    return () => window.clearTimeout(timeout);
    // Only ever needs to run once, comparing the page's initial data
    // against what this browser has already recorded seeing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!board.completedAt) return;
    const seen = window.localStorage.getItem(SEEN_COMPLETION_KEY);
    if (seen === board.completedAt) return;
    setCelebrateCompletion(true);
    window.localStorage.setItem(SEEN_COMPLETION_KEY, board.completedAt);
  }, [board.completedAt]);

  return (
    <div className="min-h-screen pb-16">
      <Header
        title={board.title}
        subtitle={board.subtitle}
        releaseName={board.releaseName}
        completedCount={board.completedCount}
        totalCount={board.totalCount}
      />

      <main className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.number}
              task={task}
              celebrate={celebrateTaskNumbers.has(task.number)}
            />
          ))}
        </div>

        <PrizePool prizes={prizes} />
      </main>

      {board.completedAt && (
        <CompletionBanner
          completedAt={board.completedAt}
          celebrate={celebrateCompletion}
        />
      )}

      <footer className="mx-auto mt-12 max-w-5xl px-4 text-center text-xs text-slate-400 sm:px-6 dark:text-slate-500">
        Beta Release Challenge
      </footer>
    </div>
  );
}
