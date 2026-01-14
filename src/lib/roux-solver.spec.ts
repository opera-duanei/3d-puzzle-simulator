import { describe, it, expect } from "vitest";
import { RouxSolver } from "./roux-solver";
import { CubeEngine } from "./cube-engine";
import type { Move } from "./cube-engine";

/**
 * Helper function to check if a cube is in solved state
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

describe("RouxSolver", () => {
  describe("solve", () => {
    it("should return empty array for empty scramble", () => {
      const solver = new RouxSolver();
      const solution = solver.solve([]);

      expect(solution).toEqual([]);
    });

    it("should solve single move scramble", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      const scramble: Move[] = ["R"];

      // Apply scramble
      scramble.forEach((move) => engine.executeMove(move));

      // Get and apply solution
      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve multi-move scramble", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      const scramble: Move[] = ["R", "U", "F", "D"];

      scramble.forEach((move) => engine.executeMove(move));

      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve scramble with prime moves", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      const scramble: Move[] = ["R'", "U'", "F'"];

      scramble.forEach((move) => engine.executeMove(move));

      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve scramble with double moves", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      const scramble: Move[] = ["R2", "U2", "F2"];

      scramble.forEach((move) => engine.executeMove(move));

      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve complex 25-move scramble", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      const scramble: Move[] = [
        "R",
        "U",
        "R'",
        "U'",
        "F'",
        "U",
        "F",
        "R",
        "U",
        "R'",
        "U'",
        "R'",
        "F",
        "R",
        "F'",
        "U",
        "R",
        "U'",
        "R'",
        "F2",
        "L",
        "D",
        "B",
        "U2",
        "L'",
      ];

      scramble.forEach((move) => engine.executeMove(move));

      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should produce solution under 40 moves for 25-move scramble", () => {
      const solver = new RouxSolver();
      const scramble: Move[] = [
        "R",
        "U",
        "F",
        "D",
        "L",
        "B",
        "R'",
        "U'",
        "F'",
        "D'",
        "L'",
        "B'",
        "R2",
        "U2",
        "F2",
        "D2",
        "L2",
        "B2",
        "R",
        "U",
        "F",
        "D",
        "L",
        "B",
        "R'",
      ];
      const solution = solver.solve(scramble);

      expect(solution.length).toBeLessThan(40);
    });

    it("should optimize consecutive same-face moves", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      const scramble: Move[] = ["R", "R", "R"]; // Should become R'

      scramble.forEach((move) => engine.executeMove(move));

      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
      expect(solution.length).toBeLessThanOrEqual(3);
    });

    it("should handle move cancellations", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      const scramble: Move[] = ["R", "R'", "U"]; // R R' cancel

      scramble.forEach((move) => engine.executeMove(move));

      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve sexy move (R U R' U')", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      const scramble: Move[] = ["R", "U", "R'", "U'"];

      scramble.forEach((move) => engine.executeMove(move));

      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve sledgehammer (R' F R F')", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      const scramble: Move[] = ["R'", "F", "R", "F'"];

      scramble.forEach((move) => engine.executeMove(move));

      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should handle repeated patterns efficiently", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      // Repeat sexy move 4 times
      const scramble: Move[] = [
        "R",
        "U",
        "R'",
        "U'",
        "R",
        "U",
        "R'",
        "U'",
        "R",
        "U",
        "R'",
        "U'",
        "R",
        "U",
        "R'",
        "U'",
      ];

      scramble.forEach((move) => engine.executeMove(move));

      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
    });

    it("should solve T-Perm algorithm", () => {
      const solver = new RouxSolver();
      const engine = new CubeEngine();
      const scramble: Move[] = [
        "R",
        "U",
        "R'",
        "U'",
        "R'",
        "F",
        "R2",
        "U'",
        "R'",
        "U'",
        "R",
        "U",
        "R'",
        "F'",
      ];

      scramble.forEach((move) => engine.executeMove(move));

      const solution = solver.solve(scramble);
      solution.forEach((move) => engine.executeMove(move));

      expect(isCubeSolved(engine)).toBe(true);
    });
  });
});
