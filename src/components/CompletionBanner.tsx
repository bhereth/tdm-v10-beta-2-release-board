"use client";

import { Confetti } from "@/components/Confetti";
import { TrophyIcon } from "@/components/icons";

interface CompletionBannerProps {
  completedAt: string;
  celebrate: boolean;
}

export function CompletionBanner({ completedAt, celebrate }: CompletionBannerProps) {
  return (
    <div className="relative mx-auto mt-8 max-w-5xl px-4 sm:px-6">
      {celebrate && <Confetti size="large" triggerKey={completedAt} />}
      <div className="flex flex-col items-center rounded-2xl border border-celebrate-300 bg-celebrate-50 p-8 text-center shadow-sm dark:border-celebrate-700 dark:bg-celebrate-900/30">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-celebrate-200 text-celebrate-800 dark:bg-celebrate-800 dark:text-celebrate-100">
          <TrophyIcon className="h-8 w-8" />
        </span>
        <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50">
          Beta Complete!
        </h2>
        <p className="mt-1 text-slate-700 dark:text-slate-200">
          The beta is ready. Great work, team!
        </p>
      </div>
    </div>
  );
}
