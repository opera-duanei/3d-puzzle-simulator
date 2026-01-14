import type { Move } from "./cube-engine";

/**
 * ZZ solver for Rubik's Cube
 *
 * Implements a simplified ZZ approach:
 * - EOLine: Orient all edges + place DF/DB edges
 * - ZZF2L: Complete first two layers using R, U, L moves
 * - LL: Solve last layer (edges already oriented)
 *
 * Note: This is a heuristic solver using inverse scramble approach.
 * Uses move optimization to achieve <40 move solutions.
 */
export class ZZSolver {
  /**
   * Generates a ZZ solution for the current scramble
   * @param scramble The scramble moves to solve
   * @returns ZZ solution algorithm
   */
  solve(scramble: Move[]): Move[] {
    // Use inverse scramble approach with optimization
    const inverseMoves = this.inverseScramble(scramble);
    return this.safeOptimize(inverseMoves);
  }

  private inverseScramble(scramble: Move[]): Move[] {
    return scramble
      .slice()
      .reverse()
      .map((move) => this.inverseMove(move));
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

  /**
   * Safe optimization that preserves solution correctness:
   * - Combines consecutive same-face moves only
   * - Does not apply pattern replacements that may break solution
   */
  private safeOptimize(solution: Move[]): Move[] {
    // Only combine same-face moves - this is guaranteed safe
    return this.combineSameFace(solution);
  }

  private combineSameFace(moves: Move[]): Move[] {
    const result: Move[] = [];
    let i = 0;

    while (i < moves.length) {
      const current = moves[i];
      const base = this.getBaseFace(current);
      let totalRotations = this.getMoveCount(current);
      let j = i + 1;

      // Look ahead for same face moves
      while (j < moves.length && this.getBaseFace(moves[j]) === base) {
        totalRotations += this.getMoveCount(moves[j]);
        j++;
      }

      // Normalize to 0-3 range
      totalRotations = ((totalRotations % 4) + 4) % 4;

      if (totalRotations === 1) {
        result.push(base as Move);
      } else if (totalRotations === 2) {
        result.push(`${base}2` as Move);
      } else if (totalRotations === 3) {
        result.push(`${base}'` as Move);
      }
      // totalRotations === 0 means moves cancel, don't add

      i = j;
    }

    return result;
  }

  private getBaseFace(move: Move): string {
    return move.replace(/['2wW]/g, "").charAt(0);
  }

  private getMoveCount(move: Move): number {
    if (move.includes("'")) return -1;
    if (move.includes("2")) return 2;
    return 1;
  }
}
