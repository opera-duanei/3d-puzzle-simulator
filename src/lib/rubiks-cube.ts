import * as THREE from "three";

const COLORS = {
  white: 0xffffff,
  yellow: 0xffff00,
  red: 0xff0000,
  orange: 0xff6600,
  green: 0x00ff00,
  blue: 0x0000ff,
  internal: 0x0a0a0a, // Match dark background
};

const FACE_COLORS = [
  COLORS.orange, // right (+X)
  COLORS.red, // left (-X)
  COLORS.yellow, // top (+Y)
  COLORS.white, // bottom (-Y)
  COLORS.green, // front (+Z)
  COLORS.blue, // back (-Z)
];

export type Piece = {
  mesh: THREE.Group;
  position: { x: number; y: number; z: number };
};

export function createCornerPiece(x: number, y: number, z: number): THREE.Group {
  const group = new THREE.Group();

  const mainSize = 0.95;
  const mainGeo = new THREE.BoxGeometry(mainSize, mainSize, mainSize);
  const materials = FACE_COLORS.map((color, index) => {
    let faceColor = COLORS.internal;
    let isExterior = false;
    if (index === 0 && x === 1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 1 && x === -1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 2 && y === 1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 3 && y === -1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 4 && z === 1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 5 && z === -1) {
      faceColor = color;
      isExterior = true;
    }
    return new THREE.MeshPhongMaterial({
      color: faceColor,
      emissive: isExterior ? 0x000000 : 0x000000,
      emissiveIntensity: 0,
      transparent: !isExterior,
      opacity: isExterior ? 1 : 0,
    });
  });
  const mainCube = new THREE.Mesh(mainGeo, materials);
  group.add(mainCube);

  const stemMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
  const stemLength = 0.4;
  const stemWidth = 0.3;

  const stemGeo = new THREE.BoxGeometry(stemWidth, stemWidth, stemWidth);
  const stem = new THREE.Mesh(stemGeo, stemMaterial);
  stem.position.set(-x * stemLength, -y * stemLength, -z * stemLength);
  group.add(stem);

  return group;
}

export function createEdgePiece(x: number, y: number, z: number): THREE.Group {
  const group = new THREE.Group();

  const mainSize = 0.95;
  const mainGeo = new THREE.BoxGeometry(mainSize, mainSize, mainSize);
  const materials = FACE_COLORS.map((color, index) => {
    let faceColor = COLORS.internal;
    let isExterior = false;
    if (index === 0 && x === 1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 1 && x === -1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 2 && y === 1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 3 && y === -1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 4 && z === 1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 5 && z === -1) {
      faceColor = color;
      isExterior = true;
    }
    return new THREE.MeshPhongMaterial({
      color: faceColor,
      emissive: isExterior ? 0x000000 : 0x000000,
      emissiveIntensity: 0,
      transparent: !isExterior,
      opacity: isExterior ? 1 : 0,
    });
  });
  const mainCube = new THREE.Mesh(mainGeo, materials);
  group.add(mainCube);

  const connectorMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
  const connectorLength = 0.35;
  const connectorWidth = 0.25;

  if (x === 0) {
    const connector = new THREE.Mesh(
      new THREE.BoxGeometry(connectorWidth, connectorLength, connectorLength),
      connectorMaterial,
    );
    connector.position.set(0, -y * connectorLength, -z * connectorLength);
    group.add(connector);
  } else if (y === 0) {
    const connector = new THREE.Mesh(
      new THREE.BoxGeometry(connectorLength, connectorWidth, connectorLength),
      connectorMaterial,
    );
    connector.position.set(-x * connectorLength, 0, -z * connectorLength);
    group.add(connector);
  } else if (z === 0) {
    const connector = new THREE.Mesh(
      new THREE.BoxGeometry(connectorLength, connectorLength, connectorWidth),
      connectorMaterial,
    );
    connector.position.set(-x * connectorLength, -y * connectorLength, 0);
    group.add(connector);
  }

  return group;
}

export function createCenterPiece(x: number, y: number, z: number): THREE.Group {
  const group = new THREE.Group();

  const capSize = 0.95;
  const capGeo = new THREE.BoxGeometry(capSize, capSize, 0.2);
  const materials = FACE_COLORS.map((color, index) => {
    let faceColor = COLORS.internal;
    let isExterior = false;
    if (index === 0 && x === 1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 1 && x === -1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 2 && y === 1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 3 && y === -1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 4 && z === 1) {
      faceColor = color;
      isExterior = true;
    }
    if (index === 5 && z === -1) {
      faceColor = color;
      isExterior = true;
    }
    return new THREE.MeshPhongMaterial({
      color: faceColor,
      emissive: isExterior ? 0x000000 : 0x000000,
      emissiveIntensity: 0,
      transparent: !isExterior,
      opacity: isExterior ? 1 : 0,
    });
  });
  const cap = new THREE.Mesh(capGeo, materials);

  if (x !== 0) cap.rotation.y = Math.PI / 2;
  if (y !== 0) cap.rotation.x = Math.PI / 2;

  cap.position.set(x * 0.4, y * 0.4, z * 0.4);
  group.add(cap);

  return group;
}

export function createCore(): THREE.Group {
  const core = new THREE.Group();
  const coreMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee });

  const sphereGeo = new THREE.SphereGeometry(0.25, 16, 16);
  const sphere = new THREE.Mesh(sphereGeo, coreMaterial);
  core.add(sphere);

  const axisRadius = 0.1;
  const axisLength = 1.8;

  const xAxisGeo = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 16);
  const xAxis = new THREE.Mesh(xAxisGeo, coreMaterial);
  xAxis.rotation.z = Math.PI / 2;
  core.add(xAxis);

  const yAxis = new THREE.Mesh(xAxisGeo, coreMaterial);
  core.add(yAxis);

  const zAxis = new THREE.Mesh(xAxisGeo, coreMaterial);
  zAxis.rotation.x = Math.PI / 2;
  core.add(zAxis);

  return core;
}

export function createCubePiece(x: number, y: number, z: number): Piece {
  let mesh: THREE.Group;

  const isCorner = x !== 0 && y !== 0 && z !== 0;
  const isEdge =
    (x === 0 && y !== 0 && z !== 0) ||
    (x !== 0 && y === 0 && z !== 0) ||
    (x !== 0 && y !== 0 && z === 0);

  if (isCorner) {
    mesh = createCornerPiece(x, y, z);
  } else if (isEdge) {
    mesh = createEdgePiece(x, y, z);
  } else {
    mesh = createCenterPiece(x, y, z);
  }

  mesh.position.set(x, y, z);
  return { mesh, position: { x, y, z } };
}
