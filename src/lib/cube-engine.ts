export type Move =
  | "U"
  | "U'"
  | "U2"
  | "D"
  | "D'"
  | "D2"
  | "L"
  | "L'"
  | "L2"
  | "R"
  | "R'"
  | "R2"
  | "F"
  | "F'"
  | "F2"
  | "B"
  | "B'"
  | "B2"
  | "u"
  | "u'"
  | "u2"
  | "Uw"
  | "Uw'"
  | "Uw2"
  | "d"
  | "d'"
  | "d2"
  | "Dw"
  | "Dw'"
  | "Dw2"
  | "l"
  | "l'"
  | "l2"
  | "Lw"
  | "Lw'"
  | "Lw2"
  | "r"
  | "r'"
  | "r2"
  | "Rw"
  | "Rw'"
  | "Rw2"
  | "f"
  | "f'"
  | "f2"
  | "Fw"
  | "Fw'"
  | "Fw2"
  | "b"
  | "b'"
  | "b2"
  | "Bw"
  | "Bw'"
  | "Bw2"
  | "M"
  | "M'"
  | "M2"
  | "E"
  | "E'"
  | "E2"
  | "S"
  | "S'"
  | "S2"
  | "x"
  | "x'"
  | "x2"
  | "y"
  | "y'"
  | "y2"
  | "z"
  | "z'"
  | "z2";

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
      case "U2":
        this.rotateLayer("y", 1, true);
        this.rotateLayer("y", 1, true);
        break;
      case "D":
        this.rotateLayer("y", -1, false);
        break;
      case "D'":
        this.rotateLayer("y", -1, true);
        break;
      case "D2":
        this.rotateLayer("y", -1, false);
        this.rotateLayer("y", -1, false);
        break;
      case "L":
        this.rotateLayer("x", -1, false);
        break;
      case "L'":
        this.rotateLayer("x", -1, true);
        break;
      case "L2":
        this.rotateLayer("x", -1, false);
        this.rotateLayer("x", -1, false);
        break;
      case "R":
        this.rotateLayer("x", 1, true);
        break;
      case "R'":
        this.rotateLayer("x", 1, false);
        break;
      case "R2":
        this.rotateLayer("x", 1, true);
        this.rotateLayer("x", 1, true);
        break;
      case "F":
        this.rotateLayer("z", 1, true);
        break;
      case "F'":
        this.rotateLayer("z", 1, false);
        break;
      case "F2":
        this.rotateLayer("z", 1, true);
        this.rotateLayer("z", 1, true);
        break;
      case "B":
        this.rotateLayer("z", -1, false);
        break;
      case "B'":
        this.rotateLayer("z", -1, true);
        break;
      case "B2":
        this.rotateLayer("z", -1, false);
        this.rotateLayer("z", -1, false);
        break;
      case "u":
      case "Uw":
        this.rotateWide("y", 1, true);
        break;
      case "u'":
      case "Uw'":
        this.rotateWide("y", 1, false);
        break;
      case "u2":
      case "Uw2":
        this.rotateWide("y", 1, true);
        this.rotateWide("y", 1, true);
        break;
      case "d":
      case "Dw":
        this.rotateWide("y", -1, false);
        break;
      case "d'":
      case "Dw'":
        this.rotateWide("y", -1, true);
        break;
      case "d2":
      case "Dw2":
        this.rotateWide("y", -1, false);
        this.rotateWide("y", -1, false);
        break;
      case "l":
      case "Lw":
        this.rotateWide("x", -1, false);
        break;
      case "l'":
      case "Lw'":
        this.rotateWide("x", -1, true);
        break;
      case "l2":
      case "Lw2":
        this.rotateWide("x", -1, false);
        this.rotateWide("x", -1, false);
        break;
      case "r":
      case "Rw":
        this.rotateWide("x", 1, true);
        break;
      case "r'":
      case "Rw'":
        this.rotateWide("x", 1, false);
        break;
      case "r2":
      case "Rw2":
        this.rotateWide("x", 1, true);
        this.rotateWide("x", 1, true);
        break;
      case "f":
      case "Fw":
        this.rotateWide("z", 1, true);
        break;
      case "f'":
      case "Fw'":
        this.rotateWide("z", 1, false);
        break;
      case "f2":
      case "Fw2":
        this.rotateWide("z", 1, true);
        this.rotateWide("z", 1, true);
        break;
      case "b":
      case "Bw":
        this.rotateWide("z", -1, false);
        break;
      case "b'":
      case "Bw'":
        this.rotateWide("z", -1, true);
        break;
      case "b2":
      case "Bw2":
        this.rotateWide("z", -1, false);
        this.rotateWide("z", -1, false);
        break;
      case "M":
        this.rotateSlice("x", 0, false);
        break;
      case "M'":
        this.rotateSlice("x", 0, true);
        break;
      case "M2":
        this.rotateSlice("x", 0, false);
        this.rotateSlice("x", 0, false);
        break;
      case "E":
        this.rotateSlice("y", 0, false);
        break;
      case "E'":
        this.rotateSlice("y", 0, true);
        break;
      case "E2":
        this.rotateSlice("y", 0, false);
        this.rotateSlice("y", 0, false);
        break;
      case "S":
        this.rotateSlice("z", 0, true);
        break;
      case "S'":
        this.rotateSlice("z", 0, false);
        break;
      case "S2":
        this.rotateSlice("z", 0, true);
        this.rotateSlice("z", 0, true);
        break;
      case "x":
        this.rotateCube("x", true);
        break;
      case "x'":
        this.rotateCube("x", false);
        break;
      case "x2":
        this.rotateCube("x", true);
        this.rotateCube("x", true);
        break;
      case "y":
        this.rotateCube("y", true);
        break;
      case "y'":
        this.rotateCube("y", false);
        break;
      case "y2":
        this.rotateCube("y", true);
        this.rotateCube("y", true);
        break;
      case "z":
        this.rotateCube("z", true);
        break;
      case "z'":
        this.rotateCube("z", false);
        break;
      case "z2":
        this.rotateCube("z", true);
        this.rotateCube("z", true);
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

  private rotateWide(axis: "x" | "y" | "z", value: number, clockwise: boolean): void {
    this.rotateLayer(axis, value, clockwise);
    this.rotateSlice(axis, 0, clockwise);
  }

  private rotateSlice(axis: "x" | "y" | "z", value: number, clockwise: boolean): void {
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
