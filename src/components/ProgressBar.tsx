interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {completed} of {total} tasks complete
        </span>
        <span className="text-slate-500 dark:text-slate-400">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Overall task completion"
        className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-celebrate-500 transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
