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
      "U2",
      "D",
      "D'",
      "D2",
      "L",
      "L'",
      "L2",
      "R",
      "R'",
      "R2",
      "F",
      "F'",
      "F2",
      "B",
      "B'",
      "B2",
      "u",
      "u'",
      "u2",
      "Uw",
      "Uw'",
      "Uw2",
      "d",
      "d'",
      "d2",
      "Dw",
      "Dw'",
      "Dw2",
      "l",
      "l'",
      "l2",
      "Lw",
      "Lw'",
      "Lw2",
      "r",
      "r'",
      "r2",
      "Rw",
      "Rw'",
      "Rw2",
      "f",
      "f'",
      "f2",
      "Fw",
      "Fw'",
      "Fw2",
      "b",
      "b'",
      "b2",
      "Bw",
      "Bw'",
      "Bw2",
      "M",
      "M'",
      "M2",
      "E",
      "E'",
      "E2",
      "S",
      "S'",
      "S2",
      "x",
      "x'",
      "x2",
      "y",
      "y'",
      "y2",
      "z",
      "z'",
      "z2",
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
