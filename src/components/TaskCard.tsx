"use client";

import type { PublicTask, TaskStatusValue } from "@/types/board";
import { TaskIcon, GiftIcon, CheckIcon, LockIcon } from "@/components/icons";
import { Confetti } from "@/components/Confetti";

interface TaskCardProps {
  task: PublicTask;
  /** True for a brief moment after this visitor's first-ever view of this
   * task in its revealed state — plays the flip animation and a small
   * confetti burst once, then never again on this device. */
  celebrate: boolean;
}

const STATUS_LABEL: Record<TaskStatusValue, string> = {
  IN_PROGRESS: "In Progress",
  READY_TO_REVEAL: "Ready to Reveal",
};

export function TaskCard({ task, celebrate }: TaskCardProps) {
  const cardBody = task.revealed ? (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 p-5 text-center dark:border-brand-700 dark:bg-brand-900/30">
      <span className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-200 text-brand-800 dark:bg-brand-800 dark:text-brand-100">
        <GiftIcon className="h-6 w-6" />
      </span>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Task {task.number} · Prize revealed
      </p>
      <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
        {task.prize?.name}
      </p>
      {task.prize?.description && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {task.prize.description}
        </p>
      )}
      <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
        <CheckIcon className="h-3.5 w-3.5" />
        Completed
      </span>
    </div>
  ) : (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          <TaskIcon icon={task.icon} className="h-6 w-6" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Task {task.number}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-50">
        {task.name}
      </h3>
      {task.description && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {task.description}
        </p>
      )}

      <div className="mt-auto pt-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            task.status === "READY_TO_REVEAL"
              ? "bg-celebrate-100 text-celebrate-800 dark:bg-celebrate-900/50 dark:text-celebrate-200"
              : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          }`}
        >
          {task.status !== "READY_TO_REVEAL" && <LockIcon className="h-3.5 w-3.5" />}
          {STATUS_LABEL[task.status]}
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {celebrate && <Confetti size="small" triggerKey={task.number} />}
      <div
        className={`h-full motion-safe:transition-transform motion-safe:duration-500 ${
          celebrate ? "motion-safe:animate-card-flip" : ""
        }`}
      >
        {cardBody}
      </div>
    </div>
  );
}
