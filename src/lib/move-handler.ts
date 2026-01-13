import type { Move } from "./cube-engine";

type LayerRotation = {
  axis: "x" | "y" | "z";
  value: number;
  clockwise: boolean;
};

type CubeRotation = {
  type: "cube";
  axis: "x" | "y" | "z";
  clockwise: boolean;
};

export type MoveAction = LayerRotation | CubeRotation;

export function getMoveActions(move: Move): MoveAction[] {
  switch (move) {
    // Basic U moves
    case "U":
      return [{ axis: "y", value: 1, clockwise: true }];
    case "U'":
      return [{ axis: "y", value: 1, clockwise: false }];
    case "U2":
      return [
        { axis: "y", value: 1, clockwise: true },
        { axis: "y", value: 1, clockwise: true },
      ];

    // Basic D moves
    case "D":
      return [{ axis: "y", value: -1, clockwise: false }];
    case "D'":
      return [{ axis: "y", value: -1, clockwise: true }];
    case "D2":
      return [
        { axis: "y", value: -1, clockwise: false },
        { axis: "y", value: -1, clockwise: false },
      ];

    // Basic L moves
    case "L":
      return [{ axis: "x", value: -1, clockwise: false }];
    case "L'":
      return [{ axis: "x", value: -1, clockwise: true }];
    case "L2":
      return [
        { axis: "x", value: -1, clockwise: false },
        { axis: "x", value: -1, clockwise: false },
      ];

    // Basic R moves
    case "R":
      return [{ axis: "x", value: 1, clockwise: true }];
    case "R'":
      return [{ axis: "x", value: 1, clockwise: false }];
    case "R2":
      return [
        { axis: "x", value: 1, clockwise: true },
        { axis: "x", value: 1, clockwise: true },
      ];

    // Basic F moves
    case "F":
      return [{ axis: "z", value: 1, clockwise: true }];
    case "F'":
      return [{ axis: "z", value: 1, clockwise: false }];
    case "F2":
      return [
        { axis: "z", value: 1, clockwise: true },
        { axis: "z", value: 1, clockwise: true },
      ];

    // Basic B moves
    case "B":
      return [{ axis: "z", value: -1, clockwise: false }];
    case "B'":
      return [{ axis: "z", value: -1, clockwise: true }];
    case "B2":
      return [
        { axis: "z", value: -1, clockwise: false },
        { axis: "z", value: -1, clockwise: false },
      ];

    // Wide u/Uw moves
    case "u":
    case "Uw":
      return [
        { axis: "y", value: 1, clockwise: true },
        { axis: "y", value: 0, clockwise: true },
      ];
    case "u'":
    case "Uw'":
      return [
        { axis: "y", value: 1, clockwise: false },
        { axis: "y", value: 0, clockwise: false },
      ];
    case "u2":
    case "Uw2":
      return [
        { axis: "y", value: 1, clockwise: true },
        { axis: "y", value: 0, clockwise: true },
        { axis: "y", value: 1, clockwise: true },
        { axis: "y", value: 0, clockwise: true },
      ];

    // Wide d/Dw moves
    case "d":
    case "Dw":
      return [
        { axis: "y", value: -1, clockwise: false },
        { axis: "y", value: 0, clockwise: false },
      ];
    case "d'":
    case "Dw'":
      return [
        { axis: "y", value: -1, clockwise: true },
        { axis: "y", value: 0, clockwise: true },
      ];
    case "d2":
    case "Dw2":
      return [
        { axis: "y", value: -1, clockwise: false },
        { axis: "y", value: 0, clockwise: false },
        { axis: "y", value: -1, clockwise: false },
        { axis: "y", value: 0, clockwise: false },
      ];

    // Wide l/Lw moves
    case "l":
    case "Lw":
      return [
        { axis: "x", value: -1, clockwise: false },
        { axis: "x", value: 0, clockwise: false },
      ];
    case "l'":
    case "Lw'":
      return [
        { axis: "x", value: -1, clockwise: true },
        { axis: "x", value: 0, clockwise: true },
      ];
    case "l2":
    case "Lw2":
      return [
        { axis: "x", value: -1, clockwise: false },
        { axis: "x", value: 0, clockwise: false },
        { axis: "x", value: -1, clockwise: false },
        { axis: "x", value: 0, clockwise: false },
      ];

    // Wide r/Rw moves
    case "r":
    case "Rw":
      return [
        { axis: "x", value: 1, clockwise: true },
        { axis: "x", value: 0, clockwise: true },
      ];
    case "r'":
    case "Rw'":
      return [
        { axis: "x", value: 1, clockwise: false },
        { axis: "x", value: 0, clockwise: false },
      ];
    case "r2":
    case "Rw2":
      return [
        { axis: "x", value: 1, clockwise: true },
        { axis: "x", value: 0, clockwise: true },
        { axis: "x", value: 1, clockwise: true },
        { axis: "x", value: 0, clockwise: true },
      ];

    // Wide f/Fw moves
    case "f":
    case "Fw":
      return [
        { axis: "z", value: 1, clockwise: true },
        { axis: "z", value: 0, clockwise: true },
      ];
    case "f'":
    case "Fw'":
      return [
        { axis: "z", value: 1, clockwise: false },
        { axis: "z", value: 0, clockwise: false },
      ];
    case "f2":
    case "Fw2":
      return [
        { axis: "z", value: 1, clockwise: true },
        { axis: "z", value: 0, clockwise: true },
        { axis: "z", value: 1, clockwise: true },
        { axis: "z", value: 0, clockwise: true },
      ];

    // Wide b/Bw moves
    case "b":
    case "Bw":
      return [
        { axis: "z", value: -1, clockwise: false },
        { axis: "z", value: 0, clockwise: false },
      ];
    case "b'":
    case "Bw'":
      return [
        { axis: "z", value: -1, clockwise: true },
        { axis: "z", value: 0, clockwise: true },
      ];
    case "b2":
    case "Bw2":
      return [
        { axis: "z", value: -1, clockwise: false },
        { axis: "z", value: 0, clockwise: false },
        { axis: "z", value: -1, clockwise: false },
        { axis: "z", value: 0, clockwise: false },
      ];

    // M slice
    case "M":
      return [{ axis: "x", value: 0, clockwise: false }];
    case "M'":
      return [{ axis: "x", value: 0, clockwise: true }];
    case "M2":
      return [
        { axis: "x", value: 0, clockwise: false },
        { axis: "x", value: 0, clockwise: false },
      ];

    // E slice
    case "E":
      return [{ axis: "y", value: 0, clockwise: false }];
    case "E'":
      return [{ axis: "y", value: 0, clockwise: true }];
    case "E2":
      return [
        { axis: "y", value: 0, clockwise: false },
        { axis: "y", value: 0, clockwise: false },
      ];

    // S slice
    case "S":
      return [{ axis: "z", value: 0, clockwise: true }];
    case "S'":
      return [{ axis: "z", value: 0, clockwise: false }];
    case "S2":
      return [
        { axis: "z", value: 0, clockwise: true },
        { axis: "z", value: 0, clockwise: true },
      ];

    // Cube rotations
    case "x":
      return [{ type: "cube", axis: "x", clockwise: true }];
    case "x'":
      return [{ type: "cube", axis: "x", clockwise: false }];
    case "x2":
      return [
        { type: "cube", axis: "x", clockwise: true },
        { type: "cube", axis: "x", clockwise: true },
      ];

    case "y":
      return [{ type: "cube", axis: "y", clockwise: true }];
    case "y'":
      return [{ type: "cube", axis: "y", clockwise: false }];
    case "y2":
      return [
        { type: "cube", axis: "y", clockwise: true },
        { type: "cube", axis: "y", clockwise: true },
      ];

    case "z":
      return [{ type: "cube", axis: "z", clockwise: true }];
    case "z'":
      return [{ type: "cube", axis: "z", clockwise: false }];
    case "z2":
      return [
        { type: "cube", axis: "z", clockwise: true },
        { type: "cube", axis: "z", clockwise: true },
      ];
  }
}
