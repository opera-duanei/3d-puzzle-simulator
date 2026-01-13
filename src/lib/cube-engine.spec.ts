import { describe, it, expect, beforeEach } from "vitest";
import { CubeEngine, type Move } from "./cube-engine";

describe("CubeEngine", () => {
  let engine: CubeEngine;

  beforeEach(() => {
    engine = new CubeEngine();
  });

  describe("basic moves", () => {
    const testCases: { move: Move; description: string }[] = [
      { move: "U", description: "U rotates top layer clockwise" },
      { move: "U'", description: "U' rotates top layer counter-clockwise" },
      { move: "D", description: "D rotates bottom layer clockwise" },
      { move: "D'", description: "D' rotates bottom layer counter-clockwise" },
      { move: "L", description: "L rotates left layer clockwise" },
      { move: "L'", description: "L' rotates left layer counter-clockwise" },
      { move: "R", description: "R rotates right layer clockwise" },
      { move: "R'", description: "R' rotates right layer counter-clockwise" },
      { move: "F", description: "F rotates front layer clockwise" },
      { move: "F'", description: "F' rotates front layer counter-clockwise" },
      { move: "B", description: "B rotates back layer clockwise" },
      { move: "B'", description: "B' rotates back layer counter-clockwise" },
    ];

    it.each(testCases)("$description", ({ move }) => {
      const initialState = JSON.stringify(Array.from(engine.getState().pieces.entries()));
      engine.executeMove(move);
      const afterMove = JSON.stringify(Array.from(engine.getState().pieces.entries()));
      expect(afterMove).not.toBe(initialState);
    });

    it("U and U' cancel each other out", () => {
      const initialState = Array.from(engine.getState().pieces.entries()).sort();
      engine.executeMove("U");
      engine.executeMove("U'");
      const finalState = Array.from(engine.getState().pieces.entries()).sort();
      expect(JSON.stringify(finalState)).toBe(JSON.stringify(initialState));
    });

    it("R and R' cancel each other out", () => {
      const initialState = Array.from(engine.getState().pieces.entries()).sort();
      engine.executeMove("R");
      engine.executeMove("R'");
      const finalState = Array.from(engine.getState().pieces.entries()).sort();
      expect(JSON.stringify(finalState)).toBe(JSON.stringify(initialState));
    });
  });

  describe("double moves (2)", () => {
    const testCases: { move: Move; equivalent: [Move, Move]; description: string }[] = [
      { move: "U2", equivalent: ["U", "U"], description: "U2 equals U U" },
      { move: "D2", equivalent: ["D", "D"], description: "D2 equals D D" },
      { move: "L2", equivalent: ["L", "L"], description: "L2 equals L L" },
      { move: "R2", equivalent: ["R", "R"], description: "R2 equals R R" },
      { move: "F2", equivalent: ["F", "F"], description: "F2 equals F F" },
      { move: "B2", equivalent: ["B", "B"], description: "B2 equals B B" },
    ];

    it.each(testCases)("$description", ({ move, equivalent }) => {
      const engine1 = new CubeEngine();
      const engine2 = new CubeEngine();

      engine1.executeMove(move);
      engine2.executeMove(equivalent[0]);
      engine2.executeMove(equivalent[1]);

      expect(JSON.stringify(Array.from(engine1.getState().pieces.entries()))).toBe(
        JSON.stringify(Array.from(engine2.getState().pieces.entries())),
      );
    });
  });

  describe("wide moves (lowercase and w notation)", () => {
    const testCases: { move1: Move; move2: Move; description: string }[] = [
      { move1: "u", move2: "Uw", description: "u equals Uw" },
      { move1: "d", move2: "Dw", description: "d equals Dw" },
      { move1: "l", move2: "Lw", description: "l equals Lw" },
      { move1: "r", move2: "Rw", description: "r equals Rw" },
      { move1: "f", move2: "Fw", description: "f equals Fw" },
      { move1: "b", move2: "Bw", description: "b equals Bw" },
    ];

    it.each(testCases)("$description", ({ move1, move2 }) => {
      const engine1 = new CubeEngine();
      const engine2 = new CubeEngine();

      engine1.executeMove(move1);
      engine2.executeMove(move2);

      expect(JSON.stringify(Array.from(engine1.getState().pieces.entries()))).toBe(
        JSON.stringify(Array.from(engine2.getState().pieces.entries())),
      );
    });

    it("wide moves affect more pieces than single layer moves", () => {
      const engine1 = new CubeEngine();
      const engine2 = new CubeEngine();

      engine1.executeMove("R");
      engine2.executeMove("r");

      const state1 = JSON.stringify(Array.from(engine1.getState().pieces.entries()));
      const state2 = JSON.stringify(Array.from(engine2.getState().pieces.entries()));

      expect(state1).not.toBe(state2);
    });
  });

  describe("slice moves (M, E, S)", () => {
    const testCases: { move: Move; description: string }[] = [
      { move: "M", description: "M rotates middle layer (follows L direction)" },
      { move: "M'", description: "M' rotates middle layer opposite" },
      { move: "M2", description: "M2 rotates middle layer twice" },
      { move: "E", description: "E rotates equatorial layer (follows D direction)" },
      { move: "E'", description: "E' rotates equatorial layer opposite" },
      { move: "E2", description: "E2 rotates equatorial layer twice" },
      { move: "S", description: "S rotates standing layer (follows F direction)" },
      { move: "S'", description: "S' rotates standing layer opposite" },
      { move: "S2", description: "S2 rotates standing layer twice" },
    ];

    it.each(testCases)("$description", ({ move }) => {
      const initialState = JSON.stringify(Array.from(engine.getState().pieces.entries()));
      engine.executeMove(move);
      const afterMove = JSON.stringify(Array.from(engine.getState().pieces.entries()));
      expect(afterMove).not.toBe(initialState);
    });

    it("M and M' cancel each other out", () => {
      const initialState = Array.from(engine.getState().pieces.entries()).sort();
      engine.executeMove("M");
      engine.executeMove("M'");
      const finalState = Array.from(engine.getState().pieces.entries()).sort();
      expect(JSON.stringify(finalState)).toBe(JSON.stringify(initialState));
    });

    it("E2 equals E E", () => {
      const engine1 = new CubeEngine();
      const engine2 = new CubeEngine();

      engine1.executeMove("E2");
      engine2.executeMove("E");
      engine2.executeMove("E");

      expect(JSON.stringify(Array.from(engine1.getState().pieces.entries()))).toBe(
        JSON.stringify(Array.from(engine2.getState().pieces.entries())),
      );
    });
  });

  describe("cube rotations (x, y, z)", () => {
    const testCases: { move: Move; description: string }[] = [
      { move: "x", description: "x rotates whole cube (R direction)" },
      { move: "x'", description: "x' rotates whole cube opposite" },
      { move: "x2", description: "x2 rotates whole cube twice" },
      { move: "y", description: "y rotates whole cube (U direction)" },
      { move: "y'", description: "y' rotates whole cube opposite" },
      { move: "y2", description: "y2 rotates whole cube twice" },
      { move: "z", description: "z rotates whole cube (F direction)" },
      { move: "z'", description: "z' rotates whole cube opposite" },
      { move: "z2", description: "z2 rotates whole cube twice" },
    ];

    it.each(testCases)("$description", ({ move }) => {
      const initialState = JSON.stringify(Array.from(engine.getState().pieces.entries()));
      engine.executeMove(move);
      const afterMove = JSON.stringify(Array.from(engine.getState().pieces.entries()));
      expect(afterMove).not.toBe(initialState);
    });

    it("y2 equals y y", () => {
      const engine1 = new CubeEngine();
      const engine2 = new CubeEngine();

      engine1.executeMove("y2");
      engine2.executeMove("y");
      engine2.executeMove("y");

      expect(JSON.stringify(Array.from(engine1.getState().pieces.entries()))).toBe(
        JSON.stringify(Array.from(engine2.getState().pieces.entries())),
      );
    });

    it("x and x' cancel each other out", () => {
      const initialState = Array.from(engine.getState().pieces.entries()).sort();
      engine.executeMove("x");
      engine.executeMove("x'");
      const finalState = Array.from(engine.getState().pieces.entries()).sort();
      expect(JSON.stringify(finalState)).toBe(JSON.stringify(initialState));
    });
  });

  describe("complex algorithms", () => {
    it("sexy move (R U R' U') can be executed", () => {
      const initialState = JSON.stringify(Array.from(engine.getState().pieces.entries()));
      engine.executeMove("R");
      engine.executeMove("U");
      engine.executeMove("R'");
      engine.executeMove("U'");
      const finalState = JSON.stringify(Array.from(engine.getState().pieces.entries()));
      expect(finalState).not.toBe(initialState);
    });

    it("repeating sexy move 6 times returns to original state", () => {
      const initialState = Array.from(engine.getState().pieces.entries()).sort();
      for (let i = 0; i < 6; i++) {
        engine.executeMove("R");
        engine.executeMove("U");
        engine.executeMove("R'");
        engine.executeMove("U'");
      }
      const finalState = Array.from(engine.getState().pieces.entries()).sort();
      expect(JSON.stringify(finalState)).toBe(JSON.stringify(initialState));
    });
  });

  describe("state management", () => {
    it("reset returns cube to solved state", () => {
      const initialState = JSON.stringify(Array.from(engine.getState().pieces.entries()));
      engine.executeMove("R");
      engine.executeMove("U");
      engine.executeMove("F");
      engine.reset();
      const finalState = JSON.stringify(Array.from(engine.getState().pieces.entries()));
      expect(finalState).toBe(initialState);
    });

    it("notifies listeners on move execution", () => {
      let notified = false;
      engine.subscribe(() => {
        notified = true;
      });
      engine.executeMove("R");
      expect(notified).toBe(true);
    });

    it("notifies listeners on reset", () => {
      let notified = false;
      engine.executeMove("R");
      engine.subscribe(() => {
        notified = true;
      });
      engine.reset();
      expect(notified).toBe(true);
    });
  });
});
