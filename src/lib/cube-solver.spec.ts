import { describe, it, expect, beforeEach } from "vitest";
import { CubeEngine, type Move } from "./cube-engine";
import { CubeSolver } from "./cube-solver";

describe("CubeSolver", () => {
  let engine: CubeEngine;
  let solver: CubeSolver;

  beforeEach(() => {
    engine = new CubeEngine();
    solver = new CubeSolver();
  });

  describe("solve()", () => {
    it("should return empty array when no scramble recorded", () => {
      const solution = solver.solve();
      expect(solution).toEqual([]);
    });

    it("should solve cube after single move", () => {
      const scramble: Move[] = ["R"];

      // Record scramble
      scramble.forEach((move) => {
        solver.recordMove(move);
        engine.executeMove(move);
      });

      // Get solution
      const solution = solver.solve();

      expect(solution.length).toBeGreaterThan(0);
      expect(solution.length).toBeLessThan(40);

      // Apply solution and verify solved
      solution.forEach((move) => engine.executeMove(move));
      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve cube after multiple moves", () => {
      const scramble: Move[] = ["R", "U", "R'", "U'"];

      scramble.forEach((move) => {
        solver.recordMove(move);
        engine.executeMove(move);
      });

      const solution = solver.solve();

      expect(solution.length).toBeGreaterThan(0);
      expect(solution.length).toBeLessThan(40);

      solution.forEach((move) => engine.executeMove(move));
      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve cube with less than 40 moves for simple scrambles", () => {
      const scramble: Move[] = ["F", "R", "U", "R'", "U'", "F'"];

      scramble.forEach((move) => {
        solver.recordMove(move);
        engine.executeMove(move);
      });

      const solution = solver.solve();

      expect(solution.length).toBeLessThan(40);

      solution.forEach((move) => engine.executeMove(move));
      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve cube after complex scramble", () => {
      const scramble: Move[] = ["R", "U2", "F'", "D", "L'", "B", "U'", "R'", "D'", "F"];

      scramble.forEach((move) => {
        solver.recordMove(move);
        engine.executeMove(move);
      });

      const solution = solver.solve();

      expect(solution.length).toBeGreaterThan(0);
      expect(solution.length).toBeLessThan(40);

      solution.forEach((move) => engine.executeMove(move));
      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve cube after 25-move shuffle", () => {
      const scramble: Move[] = [
        "R",
        "U",
        "R'",
        "F",
        "D",
        "L",
        "B'",
        "U'",
        "R2",
        "F'",
        "D'",
        "L'",
        "B",
        "U2",
        "R'",
        "F2",
        "D2",
        "L2",
        "B2",
        "U",
        "R",
        "F",
        "D",
        "L",
        "B'",
      ];

      scramble.forEach((move) => {
        solver.recordMove(move);
        engine.executeMove(move);
      });

      const solution = solver.solve();

      expect(solution.length).toBeGreaterThan(0);
      expect(solution.length).toBeLessThan(40);

      solution.forEach((move) => engine.executeMove(move));
      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should handle double moves in scramble", () => {
      const scramble: Move[] = ["R2", "U2", "F2", "D2", "L2", "B2"];

      scramble.forEach((move) => {
        solver.recordMove(move);
        engine.executeMove(move);
      });

      const solution = solver.solve();

      expect(solution.length).toBeGreaterThan(0);
      expect(solution.length).toBeLessThan(40);

      solution.forEach((move) => engine.executeMove(move));
      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should handle prime moves in scramble", () => {
      const scramble: Move[] = ["R'", "U'", "F'", "D'", "L'", "B'"];

      scramble.forEach((move) => {
        solver.recordMove(move);
        engine.executeMove(move);
      });

      const solution = solver.solve();

      expect(solution.length).toBeGreaterThan(0);
      expect(solution.length).toBeLessThan(40);

      solution.forEach((move) => engine.executeMove(move));
      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should optimize solution by combining moves", () => {
      // Record R R (should become R2)
      solver.recordMove("R");
      solver.recordMove("R");

      const solution = solver.solve();

      // R R reversed = R' R' = R2 optimized
      expect(solution).toEqual(["R2"]);
    });

    it("should optimize solution by canceling moves", () => {
      // Record R R R R (full rotation, should cancel)
      solver.recordMove("R");
      solver.recordMove("R");
      solver.recordMove("R");
      solver.recordMove("R");

      const solution = solver.solve();

      // R R R R reversed = R' R' R' R' = cancels to empty
      expect(solution).toEqual([]);
    });
  });

  describe("reset()", () => {
    it("should clear scramble history", () => {
      solver.recordMove("R");
      solver.recordMove("U");
      solver.reset();

      const solution = solver.solve();
      expect(solution).toEqual([]);
    });
  });

  describe("recordMove()", () => {
    it("should track scramble history", () => {
      solver.recordMove("R");
      solver.recordMove("U");

      const solution = solver.solve();

      expect(solution.length).toBe(2);
      expect(solution).toEqual(["U'", "R'"]);
    });
  });
});

/**
 * Helper function to check if cube is solved
 */
function isCubeSolved(engine: CubeEngine): boolean {
  const state = engine.getState();
  const pieces = state.pieces;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        const key = `${x},${y},${z}`;
        const pos = pieces.get(key);
        if (!pos || pos.x !== x || pos.y !== y || pos.z !== z) {
          return false;
        }
      }
    }
  }
  return true;
}
