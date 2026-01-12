export type Move =
  | "U"
  | "U'"
  | "D"
  | "D'"
  | "L"
  | "L'"
  | "R"
  | "R'"
  | "F"
  | "F'"
  | "B"
  | "B'"
  | "x"
  | "x'"
  | "y"
  | "y'"
  | "z"
  | "z'";

export type PiecePosition = {
  x: number;
  y: number;
  z: number;
};

export type CubeState = {
  pieces: Map<string, PiecePosition>;
};

export class CubeEngine {
  private state: CubeState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.createSolvedState();
  }

  private createSolvedState(): CubeState {
    const pieces = new Map<string, PiecePosition>();

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          const key = `${x},${y},${z}`;
          pieces.set(key, { x, y, z });
        }
      }
    }

    return { pieces };
  }

  getState(): CubeState {
    return this.state;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  executeMove(move: Move): void {
    switch (move) {
      case "U":
        this.rotateLayer("y", 1, true);
        break;
      case "U'":
        this.rotateLayer("y", 1, false);
        break;
      case "D":
        this.rotateLayer("y", -1, false);
        break;
      case "D'":
        this.rotateLayer("y", -1, true);
        break;
      case "L":
        this.rotateLayer("x", -1, false);
        break;
      case "L'":
        this.rotateLayer("x", -1, true);
        break;
      case "R":
        this.rotateLayer("x", 1, true);
        break;
      case "R'":
        this.rotateLayer("x", 1, false);
        break;
      case "F":
        this.rotateLayer("z", 1, true);
        break;
      case "F'":
        this.rotateLayer("z", 1, false);
        break;
      case "B":
        this.rotateLayer("z", -1, false);
        break;
      case "B'":
        this.rotateLayer("z", -1, true);
        break;
      case "x":
        this.rotateCube("x", true);
        break;
      case "x'":
        this.rotateCube("x", false);
        break;
      case "y":
        this.rotateCube("y", true);
        break;
      case "y'":
        this.rotateCube("y", false);
        break;
      case "z":
        this.rotateCube("z", true);
        break;
      case "z'":
        this.rotateCube("z", false);
        break;
    }
    this.notify();
  }

  private rotateLayer(axis: "x" | "y" | "z", value: number, clockwise: boolean): void {
    const affectedPieces = Array.from(this.state.pieces.entries()).filter(
      ([, pos]) => pos[axis] === value,
    );

    const newPositions = new Map<string, PiecePosition>();

    affectedPieces.forEach(([, pos]) => {
      const newPos = this.rotatePosition(pos, axis, clockwise);
      const newKey = `${newPos.x},${newPos.y},${newPos.z}`;
      newPositions.set(newKey, newPos);
    });

    affectedPieces.forEach(([oldKey]) => {
      this.state.pieces.delete(oldKey);
    });

    newPositions.forEach((pos, key) => {
      this.state.pieces.set(key, pos);
    });
  }

  private rotateCube(axis: "x" | "y" | "z", clockwise: boolean): void {
    const newPieces = new Map<string, PiecePosition>();

    this.state.pieces.forEach((pos) => {
      const newPos = this.rotatePosition(pos, axis, clockwise);
      const newKey = `${newPos.x},${newPos.y},${newPos.z}`;
      newPieces.set(newKey, newPos);
    });

    this.state.pieces = newPieces;
  }

  private rotatePosition(
    pos: PiecePosition,
    axis: "x" | "y" | "z",
    clockwise: boolean,
  ): PiecePosition {
    const { x, y, z } = pos;
    const angle = clockwise ? -Math.PI / 2 : Math.PI / 2;
    const cos = Math.round(Math.cos(angle));
    const sin = Math.round(Math.sin(angle));

    let newX = x;
    let newY = y;
    let newZ = z;

    if (axis === "x") {
      newY = cos * y - sin * z;
      newZ = sin * y + cos * z;
    } else if (axis === "y") {
      newX = cos * x + sin * z;
      newZ = -sin * x + cos * z;
    } else if (axis === "z") {
      newX = cos * x - sin * y;
      newY = sin * x + cos * y;
    }

    return { x: newX, y: newY, z: newZ };
  }

  reset(): void {
    this.state = this.createSolvedState();
    this.notify();
  }
}
