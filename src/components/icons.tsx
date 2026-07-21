import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function FlagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 3v18" />
      <path d="M5 4h11l-2.5 4L16 12H5" />
    </svg>
  );
}

export function RocketIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2c2.5 2 4 5.5 4 9 0 2-.5 4-1 5.5l-3 3-3-3c-.5-1.5-1-3.5-1-5.5 0-3.5 1.5-7 4-9Z" />
      <circle cx="12" cy="10" r="1.75" />
      <path d="M9 15c-1.5 0-3 1-3.5 3.5C7 18 8 17 9 15Z" />
      <path d="M15 15c1.5 0 3 1 3.5 3.5C17 18 16 17 15 15Z" />
    </svg>
  );
}

export function BugIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="8" width="10" height="10" rx="5" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M3 12h4M17 12h4M4 8l3 2M20 8l-3 2M4 18l3-2M20 18l-3-2" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path d="M9.5 12l1.75 1.75L14.75 10" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
    </svg>
  );
}

export function WrenchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.5 6.5a4 4 0 0 0-5.4 4.9L4 16.5V20h3.5l5.1-5.1a4 4 0 0 0 4.9-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
    </svg>
  );
}

export function ChecklistIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 6l.75.75L6.5 5M4 12l.75.75L6.5 11M4 18l.75.75L6.5 17" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16v10H8l-4 4V5Z" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v1a4 4 0 0 0 4 4M17 5h3v1a4 4 0 0 1-4 4" />
      <path d="M12 13v3M9 20h6M9.5 20a2.5 2.5 0 0 1 5 0" />
    </svg>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M4 13h16" />
      <path d="M12 9v11" />
      <path d="M12 9c-1-3-3-5-4.5-4.5S6 8 9 9h3ZM12 9c1-3 3-5 4.5-4.5S18 8 15 9h-3Z" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 13l4.5 4.5L19 8" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export const TASK_ICON_COMPONENTS = {
  flag: FlagIcon,
  rocket: RocketIcon,
  bug: BugIcon,
  shield: ShieldIcon,
  book: BookIcon,
  wrench: WrenchIcon,
  checklist: ChecklistIcon,
  chat: ChatIcon,
  trophy: TrophyIcon,
} as const;

export type TaskIconKey = keyof typeof TASK_ICON_COMPONENTS;

export function TaskIcon({
  icon,
  ...props
}: { icon: string } & IconProps) {
  const Component =
    TASK_ICON_COMPONENTS[icon as TaskIconKey] ?? TASK_ICON_COMPONENTS.flag;
  return <Component {...props} />;
}
