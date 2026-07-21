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
  {
    number: 1,
    name: "Review life cycle",
    description: "",
    icon: "checklist",
  },
  {
    number: 2,
    name: "Implement preliminary phased RTP project network (WFRC)",
    description: "",
    icon: "flag",
  },
  {
    number: 3,
    name: "Implement preliminary phased RTP project network (MAG)",
    description: "",
    icon: "flag",
  },
  {
    number: 4,
    name: "Calibrate CVM",
    description: "",
    icon: "wrench",
  },
  {
    number: 5,
    name: "Create preliminary socioeconomic forecast (MAG)",
    description: "",
    icon: "book",
  },
  {
    number: 6,
    name: "Create draft socioeconomic forecast (WFRC)",
    description: "",
    icon: "book",
  },
  {
    number: 7,
    name: "Final beta calibration and validation",
    description: "",
    icon: "shield",
  },
  {
    number: 8,
    name: "Include summary post processing for Benefit-Cost Analysis pipeline",
    description: "",
    icon: "chat",
  },
  {
    number: 9,
    name: "Add voyager scripts to summarize highway network, OD Matrix, and SE for BCA",
    description: "",
    icon: "trophy",
  },
];

export interface InitialPrizeDef {
  name: string;
  description: string;
}

export const INITIAL_PRIZES: InitialPrizeDef[] = [
  {
    name: "Snack Cart",
    description: "A small selection of snacks for the team.",
  },
  {
    name: "Coffee or Drink Run",
    description:
      "Basic coffee, soda, tea, or another simple drink for each team member.",
  },
  {
    name: "Afternoon Treat",
    description:
      "Cookies, donuts, brownies, ice cream, or a similar shared treat.",
  },
  {
    name: "Bonus Break",
    description: "A scheduled 20-minute team break.",
  },
  {
    name: "Extended Lunch",
    description: "A slightly longer team lunch, subject to office approval.",
  },
  {
    name: "Team Trivia Break",
    description: "A short office-friendly trivia game.",
  },
  {
    name: "Choose the Next Team Treat",
    description:
      "The team member most closely associated with the completed task chooses the next simple shared treat.",
  },
  {
    name: "Mystery Office Perk",
    description: "One small preapproved perk selected from a short list.",
  },
  {
    name: "Candy Bowl Restock",
    description: "Restocking the office candy bowl with a fresh selection.",
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
