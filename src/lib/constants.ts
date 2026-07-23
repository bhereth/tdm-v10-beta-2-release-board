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
    name: "🍓 Fresh Fruit Basket",
    description: "A fresh fruit basket for the team.",
  },
  {
    name: "🏓 4 vs. 4 Ping Pong Match",
    description: "A friendly 4 vs. 4 ping pong match.",
  },
  {
    name: "☕ 20-Minute Bonus Break",
    description: "A scheduled 20-minute team break.",
  },
  {
    name: "🍪 Cookies",
    description: "Fresh cookies for the team.",
  },
  {
    name: "🍬 Candy Bowl Restock",
    description: "Restocking the office candy bowl with a fresh selection.",
  },
  {
    name: "🥯 Bagels & Cream Cheese",
    description: "Bagels and cream cheese for the team.",
  },
  {
    name: "🌮 Chips & Salsa",
    description: "Chips and salsa for the team.",
  },
  {
    name: "🚶 Walking Meeting Outside",
    description: "Take a team meeting outside instead.",
  },
  {
    name: "🚆 FrontRunner Adventure",
    description:
      "Take FrontRunner somewhere for a group coordination meeting on the train.",
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
