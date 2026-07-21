#!/usr/bin/env -S npx tsx
/**
 * Local CLI for managing src/data/board.json. There is no server and no
 * live "reveal" button — this script edits the committed file for you, and
 * you commit + push the result to update the deployed site.
 *
 * Usage:
 *   npm run board -- init                          # create board.json (only if missing)
 *   npm run board -- reset --yes                    # wipe progress, re-randomize, recreate
 *   npm run board -- status <taskNumber> <STATUS>   # STATUS: IN_PROGRESS | READY_TO_REVEAL
 *   npm run board -- reveal <taskNumber>             # reveal a task's prize
 *   npm run board -- show                           # print a human-readable summary
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildFreshBoard } from "../src/lib/buildBoard";
import {
  BoardMutationError,
  revealTask,
  setTaskStatus,
} from "../src/lib/boardMutations";
import type { BoardData, TaskStatusValue } from "../src/types/board";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "src", "data", "board.json");

function readBoard(): BoardData {
  if (!existsSync(DATA_PATH)) {
    console.error(
      `No board found at ${path.relative(process.cwd(), DATA_PATH)}. Run "npm run board -- init" first.`
    );
    process.exit(1);
  }
  return JSON.parse(readFileSync(DATA_PATH, "utf8")) as BoardData;
}

function writeBoard(board: BoardData) {
  writeFileSync(DATA_PATH, JSON.stringify(board, null, 2) + "\n", "utf8");
  console.log(`Wrote ${path.relative(process.cwd(), DATA_PATH)}`);
}

function printSummary(board: BoardData) {
  const prizesById = new Map(board.prizes.map((p) => [p.id, p] as const));
  console.log(`\n${board.title}`);
  console.log(`${board.subtitle}\n`);
  for (const task of [...board.tasks].sort((a, b) => a.number - b.number)) {
    const prizeName = prizesById.get(task.prizeId)?.name ?? "?";
    const state = task.revealed
      ? `REVEALED -> ${prizeName}`
      : task.status;
    console.log(`  ${task.number}. ${task.name}  [${state}]`);
  }
  console.log("");
}

function cmdInit(args: string[]) {
  const force = args.includes("--yes");
  if (existsSync(DATA_PATH) && !force) {
    console.error(
      `${path.relative(process.cwd(), DATA_PATH)} already exists. ` +
        `Use "npm run board -- reset --yes" to wipe it and start over.`
    );
    process.exit(1);
  }
  writeBoard(buildFreshBoard());
}

function cmdReset(args: string[]) {
  if (!args.includes("--yes")) {
    console.error(
      "This deletes all progress and re-randomizes prize assignments " +
        '(Task 9 always keeps the Team Outing). Re-run with "reset --yes" to confirm.'
    );
    process.exit(1);
  }
  writeBoard(buildFreshBoard());
}

function cmdStatus(args: string[]) {
  const [numberArg, statusArg] = args;
  const taskNumber = Number(numberArg);
  const status = statusArg as TaskStatusValue;
  if (
    !Number.isInteger(taskNumber) ||
    (status !== "IN_PROGRESS" && status !== "READY_TO_REVEAL")
  ) {
    console.error(
      "Usage: npm run board -- status <taskNumber> <IN_PROGRESS|READY_TO_REVEAL>"
    );
    process.exit(1);
  }
  const board = readBoard();
  writeBoard(setTaskStatus(board, taskNumber, status));
}

function cmdReveal(args: string[]) {
  const taskNumber = Number(args[0]);
  if (!Number.isInteger(taskNumber)) {
    console.error("Usage: npm run board -- reveal <taskNumber>");
    process.exit(1);
  }
  const board = readBoard();
  const { board: updated, alreadyRevealed } = revealTask(board, taskNumber);
  if (alreadyRevealed) {
    console.log(`Task ${taskNumber} was already revealed; nothing changed.`);
    return;
  }
  writeBoard(updated);
}

function cmdShow() {
  printSummary(readBoard());
}

function main() {
  const [, , command, ...args] = process.argv;

  try {
    switch (command) {
      case "init":
        return cmdInit(args);
      case "reset":
        return cmdReset(args);
      case "status":
        return cmdStatus(args);
      case "reveal":
        return cmdReveal(args);
      case "show":
        return cmdShow();
      default:
        console.error(
          "Usage: npm run board -- <init|reset|status|reveal|show> [...args]"
        );
        process.exit(1);
    }
  } catch (error) {
    if (error instanceof BoardMutationError) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }
}

main();
