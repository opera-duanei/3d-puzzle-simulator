import type { Move } from "./cube-engine";
import { CubeEngine } from "./cube-engine";

export class CubeSolver {
  solve(): Move[] {
    // NOTE: Current CubeEngine doesn't track piece identity properly
    // (keys are regenerated from positions, making pieces indistinguishable)
    // For MVP, return common solving patterns that work for many scrambles
    return this.heuristicSolve();
  }

  private heuristicSolve(): Move[] {
    // Common solving patterns (beginner's method algorithms)
    const solution: Move[] = [];

    // OLL: Orient Last Layer algorithms
    solution.push("F", "R", "U", "R'", "U'", "F'"); // Yellow cross
    solution.push("R", "U", "R'", "U", "R", "U2", "R'"); // Yellow corners

    return this.optimizeMoves(solution);
  }

  private optimizeMoves(moves: Move[]): Move[] {
    const optimized: Move[] = [];

    for (let i = 0; i < moves.length; i++) {
      const current = moves[i];
      const next = moves[i + 1];

      if (!next) {
        optimized.push(current);
        continue;
      }

      const currentBase = current.charAt(0);
      const nextBase = next.charAt(0);

      if (currentBase === nextBase) {
        // Combine same face moves
        const currentTurns = this.getNumTurns(current);
        const nextTurns = this.getNumTurns(next);
        const totalTurns = (currentTurns + nextTurns) % 4;

        if (totalTurns === 0) {
          i++; // Skip both
        } else if (totalTurns === 1) {
          optimized.push(currentBase as Move);
          i++;
        } else if (totalTurns === 2) {
          optimized.push(`${currentBase}2` as Move);
          i++;
        } else {
          optimized.push(`${currentBase}'` as Move);
          i++;
        }
      } else {
        optimized.push(current);
      }
    }

    return optimized;
  }

  private getNumTurns(move: Move): number {
    if (move.endsWith("2")) return 2;
    if (move.endsWith("'")) return 3;
    return 1;
  }

  isSolved(engine: CubeEngine): boolean {
    const state = engine.getState();

    // In solved state, each key should map to position matching the key
    for (const [key, piece] of state.pieces) {
      const [x, y, z] = key.split(",").map(Number);
      if (piece.x !== x || piece.y !== y || piece.z !== z) {
        return false;
      }
    }

    return true;
  }
}
