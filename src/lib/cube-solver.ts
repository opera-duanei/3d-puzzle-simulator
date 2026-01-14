import type { Move } from "./cube-engine";

/**
 * Rubik's Cube solver using scramble reversal
 * Tracks scramble history and returns inverse solution
 */
export class CubeSolver {
  private scrambleHistory: Move[] = [];

  /**
   * Records a move in the scramble history
   */
  recordMove(move: Move): void {
    this.scrambleHistory.push(move);
  }

  /**
   * Clears the scramble history (when cube is reset)
   */
  reset(): void {
    this.scrambleHistory = [];
  }

  /**
   * Gets the recorded scramble history
   * @returns Copy of scramble history
   */
  getHistory(): Move[] {
    return this.scrambleHistory.slice();
  }

  /**
   * Solves the cube by reversing recorded scramble
   * @returns Array of moves to solve the cube
   */
  solve(): Move[] {
    if (this.scrambleHistory.length === 0) {
      return [];
    }

    // Reverse the scramble
    const solution = this.scrambleHistory
      .slice()
      .reverse()
      .map((move) => this.inverseMove(move));

    // Optimize by combining adjacent moves
    return this.optimizeSolution(solution);
  }

  private inverseMove(move: Move): Move {
    if (move.endsWith("'")) {
      return move.slice(0, -1) as Move;
    } else if (move.endsWith("2")) {
      return move;
    } else {
      return `${move}'` as Move;
    }
  }

  private optimizeSolution(solution: Move[]): Move[] {
    let optimized = solution.slice();
    let changed = true;

    // Keep optimizing until no more changes
    while (changed) {
      changed = false;
      const newOptimized: Move[] = [];
      let i = 0;

      while (i < optimized.length) {
        const current = optimized[i];

        // Check if we can combine with next move
        if (i + 1 < optimized.length) {
          const next = optimized[i + 1];
          const baseCurrent = current.replace(/['2]/g, "");
          const baseNext = next.replace(/['2]/g, "");

          // Same face - combine or cancel
          if (baseCurrent === baseNext) {
            const combined = this.combineMoves(current, next);
            if (combined) {
              newOptimized.push(combined);
            }
            // Skip both moves (combined or canceled)
            i += 2;
            changed = true;
            continue;
          }
        }

        newOptimized.push(current);
        i++;
      }

      optimized = newOptimized;
    }

    return optimized;
  }

  private combineMoves(move1: Move, move2: Move): Move | null {
    const base = move1.replace(/['2]/g, "");
    const count1 = move1.includes("'") ? -1 : move1.includes("2") ? 2 : 1;
    const count2 = move2.includes("'") ? -1 : move2.includes("2") ? 2 : 1;
    const total = (count1 + count2 + 4) % 4;

    if (total === 0) return null; // Moves cancel
    if (total === 1) return base as Move;
    if (total === 2) return `${base}2` as Move;
    if (total === 3) return `${base}'` as Move;

    return null;
  }
}
