import { getBoardState } from "@/lib/boardData";
import { Board } from "@/components/Board";

export default function HomePage() {
  const board = getBoardState();
  return <Board board={board} />;
}
