import type { Move } from "./cube-engine";

export class AlgorithmExecutor {
  private queue: Move[] = [];
  private isExecuting = false;
  private shouldStop = false;
  private currentMoveCallback: ((move: Move) => Promise<void>) | null = null;

  parseAlgorithm(algorithm: string): Move[] {
    const tokens = algorithm.trim().split(/\s+/);
    const moves: Move[] = [];

    for (const token of tokens) {
      if (this.isValidMove(token)) {
        moves.push(token as Move);
      }
    }

    return moves;
  }

  private isValidMove(token: string): boolean {
    const validMoves = [
      "U",
      "U'",
      "D",
      "D'",
      "L",
      "L'",
      "R",
      "R'",
      "F",
      "F'",
      "B",
      "B'",
      "x",
      "x'",
      "y",
      "y'",
      "z",
      "z'",
    ];
    return validMoves.includes(token);
  }

  async executeAlgorithm(
    algorithm: string,
    executeMoveCallback: (move: Move) => Promise<void>,
  ): Promise<void> {
    if (this.isExecuting) {
      return;
    }

    this.queue = this.parseAlgorithm(algorithm);
    this.isExecuting = true;
    this.shouldStop = false;
    this.currentMoveCallback = executeMoveCallback;

    while (this.queue.length > 0 && !this.shouldStop) {
      const move = this.queue.shift()!;
      await executeMoveCallback(move);
    }

    this.isExecuting = false;
    this.currentMoveCallback = null;
  }

  stop(): void {
    this.shouldStop = true;
  }

  isRunning(): boolean {
    return this.isExecuting;
  }
}
