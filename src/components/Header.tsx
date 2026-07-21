import { ProgressBar } from "@/components/ProgressBar";

interface HeaderProps {
  title: string;
  subtitle: string;
  releaseName: string | null;
  completedCount: number;
  totalCount: number;
}

export function Header({
  title,
  subtitle,
  releaseName,
  completedCount,
  totalCount,
}: HeaderProps) {
  return (
    <header className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-50">
          {title}
        </h1>
        <p className="mt-1 max-w-xl text-sm text-slate-600 sm:text-base dark:text-slate-300">
          {subtitle}
        </p>
        {releaseName && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-300">
            {releaseName}
          </p>
        )}
      </div>

      <div className="mt-6">
        <ProgressBar completed={completedCount} total={totalCount} />
      </div>
    </header>
  );
}
