import type { PublicPrize } from "@/types/board";
import { CheckIcon, LockIcon, TrophyIcon } from "@/components/icons";

interface PrizePoolProps {
  prizes: PublicPrize[];
}

export function PrizePool({ prizes }: PrizePoolProps) {
  return (
    <section aria-labelledby="prize-pool-heading" className="mt-10">
      <h2
        id="prize-pool-heading"
        className="text-lg font-semibold text-slate-900 dark:text-slate-50"
      >
        Prize Pool
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        These are the prizes the team can unlock. Which task holds which
        prize stays a surprise until it&apos;s revealed.
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {prizes.map((prize) => (
          <li
            key={prize.id}
            className={`flex items-start gap-3 rounded-xl border p-3.5 ${
              prize.revealed
                ? prize.isFinalPrize
                  ? "border-celebrate-300 bg-celebrate-50 dark:border-celebrate-700 dark:bg-celebrate-900/30"
                  : "border-brand-200 bg-brand-50 dark:border-brand-700 dark:bg-brand-900/20"
                : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
            }`}
          >
            <span
              className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                prize.revealed
                  ? "bg-white text-brand-700 dark:bg-slate-900 dark:text-brand-300"
                  : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
              }`}
            >
              {prize.isFinalPrize ? (
                <TrophyIcon className="h-4.5 w-4.5" />
              ) : prize.revealed ? (
                <CheckIcon className="h-4.5 w-4.5" />
              ) : (
                <LockIcon className="h-4.5 w-4.5" />
              )}
            </span>
            <div className="min-w-0">
              <p
                className={`text-sm font-medium ${
                  prize.revealed
                    ? "text-slate-900 dark:text-slate-50"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {prize.isFinalPrize ? "Team Outing — details selected by the team." : prize.name}
              </p>
              {prize.description && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {prize.description}
                </p>
              )}
              <p className="mt-1 text-xs font-medium">
                {prize.revealed ? (
                  <span className="text-brand-700 dark:text-brand-300">Unlocked</span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">Locked</span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
