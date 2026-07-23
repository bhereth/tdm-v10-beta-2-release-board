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

// There's no server here, so "has this visitor opened this tile yet"
// lives in the visitor's own browser rather than in a database. Each
// revealed task's `revealedAt` timestamp (and the board's overall
// `completedAt`) is a stable, unique marker — once we've recorded that
// this device opened a given reveal, it stays open (no flip animation)
// on future visits, and never auto-opens before the visitor clicks it.
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
  const [openedRevealedAts, setOpenedRevealedAts] = useState<Set<string>>(
    new Set()
  );
  const [celebrateTaskNumbers, setCelebrateTaskNumbers] = useState<Set<number>>(
    new Set()
  );
  const [celebrateCompletion, setCelebrateCompletion] = useState(false);

  useEffect(() => {
    setOpenedRevealedAts(loadSeenReveals());
  }, []);

  function handleOpenTask(taskNumber: number, revealedAt: string) {
    setOpenedRevealedAts((prev) => {
      if (prev.has(revealedAt)) return prev;
      const next = new Set(prev).add(revealedAt);
      window.localStorage.setItem(SEEN_REVEALS_KEY, JSON.stringify([...next]));
      return next;
    });
    setCelebrateTaskNumbers((prev) => new Set(prev).add(taskNumber));
    window.setTimeout(() => {
      setCelebrateTaskNumbers((prev) => {
        const next = new Set(prev);
        next.delete(taskNumber);
        return next;
      });
    }, CELEBRATION_MS);
  }

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
              isOpen={Boolean(task.revealedAt && openedRevealedAts.has(task.revealedAt))}
              celebrate={celebrateTaskNumbers.has(task.number)}
              onOpen={() => {
                if (task.revealedAt) handleOpenTask(task.number, task.revealedAt);
              }}
            />
          ))}
        </div>

        <PrizePool
          prizes={prizes.map((prize) => ({
            ...prize,
            revealed: Boolean(
              prize.revealedAt && openedRevealedAts.has(prize.revealedAt)
            ),
          }))}
        />
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
