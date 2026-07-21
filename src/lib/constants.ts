export const DEFAULT_TITLE = "Beta Release Challenge";
export const DEFAULT_SUBTITLE =
  "Complete the nine tasks, reveal the rewards, and ship the beta.";

export const TASK_ICONS = [
  "flag",
  "rocket",
  "bug",
  "shield",
  "book",
  "wrench",
  "checklist",
  "chat",
  "trophy",
] as const;

export type TaskIcon = (typeof TASK_ICONS)[number];

export interface InitialTaskDef {
  number: number;
  name: string;
  description: string;
  icon: TaskIcon;
}

export const INITIAL_TASKS: InitialTaskDef[] = [
  { number: 1, name: "Task 1", description: "", icon: "flag" },
  { number: 2, name: "Task 2", description: "", icon: "checklist" },
  { number: 3, name: "Task 3", description: "", icon: "bug" },
  { number: 4, name: "Task 4", description: "", icon: "shield" },
  { number: 5, name: "Task 5", description: "", icon: "book" },
  { number: 6, name: "Task 6", description: "", icon: "wrench" },
  { number: 7, name: "Task 7", description: "", icon: "chat" },
  { number: 8, name: "Task 8", description: "", icon: "rocket" },
  { number: 9, name: "Final Beta Release", description: "", icon: "trophy" },
];

export interface InitialPrizeDef {
  name: string;
  description: string;
  isFinalPrize: boolean;
}

export const INITIAL_PRIZES: InitialPrizeDef[] = [
  {
    name: "Snack Cart",
    description: "A small selection of snacks for the team.",
    isFinalPrize: false,
  },
  {
    name: "Coffee or Drink Run",
    description:
      "Basic coffee, soda, tea, or another simple drink for each team member.",
    isFinalPrize: false,
  },
  {
    name: "Afternoon Treat",
    description:
      "Cookies, donuts, brownies, ice cream, or a similar shared treat.",
    isFinalPrize: false,
  },
  {
    name: "Bonus Break",
    description: "A scheduled 20-minute team break.",
    isFinalPrize: false,
  },
  {
    name: "Extended Lunch",
    description: "A slightly longer team lunch, subject to office approval.",
    isFinalPrize: false,
  },
  {
    name: "Team Trivia Break",
    description: "A short office-friendly trivia game.",
    isFinalPrize: false,
  },
  {
    name: "Choose the Next Team Treat",
    description:
      "The team member most closely associated with the completed task chooses the next simple shared treat.",
    isFinalPrize: false,
  },
  {
    name: "Mystery Office Perk",
    description: "One small preapproved perk selected from a short list.",
    isFinalPrize: false,
  },
  {
    name: "Team Outing",
    description: "The final reward, unlocked by Task 9.",
    isFinalPrize: true,
  },
];

export const DEFAULT_MYSTERY_PERK_OPTIONS = [
  "Donuts the next morning",
  "Fifteen-minute outdoor break",
  "Casual dress day",
  "Team chooses a lunch location",
  "Shorten one routine internal meeting",
  "Popcorn or snack break",
  "Breakfast treats",
  "Small desk-friendly team game",
];

export const TOTAL_TASKS = INITIAL_TASKS.length;
