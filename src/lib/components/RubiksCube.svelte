<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import { createCubePiece, createCore, type Piece } from "$lib/rubiks-cube";
  import { CubeEngine, type Move } from "$lib/cube-engine";
  import { AlgorithmExecutor } from "$lib/algorithm-executor";
  import { getMoveActions } from "$lib/move-handler";

  let canvas: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls;
  let pieces: Piece[] = [];
  let isAnimating = false;
  let animationQueue: (() => void)[] = [];
  let gizmo: THREE.Group;
  let raycaster: THREE.Raycaster;
  let isDragging = false;
  let dragStartPosition: { x: number; y: number } | null = null;
  let dragStartTime = 0;
  let clickedFace: { piece: Piece; normal: THREE.Vector3 } | null = null;

  export let engine: CubeEngine = new CubeEngine();
  export const executor: AlgorithmExecutor = new AlgorithmExecutor();

  function createGizmo() {
    gizmo = new THREE.Group();

    const axesHelper = new THREE.AxesHelper(2.5);
    gizmo.add(axesHelper);

    scene.add(gizmo);
  }

  function createRubiksCube() {
    pieces = [];

    const core = createCore();
    scene.add(core);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;

          const piece = createCubePiece(x, y, z);
          pieces.push(piece);
          scene.add(piece.mesh);
        }
      }
    }
  }

  function getPiecesInLayer(axis: "x" | "y" | "z", value: number): Piece[] {
    return pieces.filter((piece) => piece.position[axis] === value);
  }

  function rotateLayer(axis: "x" | "y" | "z", value: number, clockwise: boolean): Promise<void> {
    return new Promise((resolve) => {
      if (isAnimating) {
        animationQueue.push(() => rotateLayer(axis, value, clockwise).then(resolve));
        return;
      }

      isAnimating = true;
      const layerPieces = getPiecesInLayer(axis, value);
      const targetAngle = clockwise ? -Math.PI / 2 : Math.PI / 2;

      const pivot = new THREE.Group();
      scene.add(pivot);

      layerPieces.forEach((piece) => {
        scene.remove(piece.mesh);
        pivot.add(piece.mesh);
      });

      const duration = 300;
      const startTime = performance.now();

      function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        const currentAngle = targetAngle * eased;

        pivot.rotation.x = axis === "x" ? currentAngle : 0;
        pivot.rotation.y = axis === "y" ? currentAngle : 0;
        pivot.rotation.z = axis === "z" ? currentAngle : 0;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          pivot.updateMatrixWorld();

          layerPieces.forEach((piece) => {
            const worldPos = new THREE.Vector3();
            piece.mesh.getWorldPosition(worldPos);

            const worldQuat = new THREE.Quaternion();
            piece.mesh.getWorldQuaternion(worldQuat);

            pivot.remove(piece.mesh);
            scene.add(piece.mesh);

            piece.mesh.position.copy(worldPos);
            piece.mesh.quaternion.copy(worldQuat);

            piece.position.x = Math.round(worldPos.x);
            piece.position.y = Math.round(worldPos.y);
            piece.position.z = Math.round(worldPos.z);
          });

          scene.remove(pivot);
          isAnimating = false;

          if (animationQueue.length > 0) {
            const next = animationQueue.shift();
            next?.();
          }

          resolve();
        }
      }

      requestAnimationFrame(animate);
    });
  }

  function rotateCube(axis: "x" | "y" | "z", clockwise: boolean): Promise<void> {
    return new Promise((resolve) => {
      if (isAnimating) {
        animationQueue.push(() => rotateCube(axis, clockwise).then(resolve));
        return;
      }

      isAnimating = true;
      const targetAngle = clockwise ? -Math.PI / 2 : Math.PI / 2;

      const pivot = new THREE.Group();
      scene.add(pivot);

      pieces.forEach((piece) => {
        scene.remove(piece.mesh);
        pivot.add(piece.mesh);
      });

      scene.remove(gizmo);
      pivot.add(gizmo);

      const duration = 300;
      const startTime = performance.now();

      function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        const currentAngle = targetAngle * eased;

        pivot.rotation.x = axis === "x" ? currentAngle : 0;
        pivot.rotation.y = axis === "y" ? currentAngle : 0;
        pivot.rotation.z = axis === "z" ? currentAngle : 0;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          pivot.updateMatrixWorld();

          pieces.forEach((piece) => {
            const worldPos = new THREE.Vector3();
            piece.mesh.getWorldPosition(worldPos);

            const worldQuat = new THREE.Quaternion();
            piece.mesh.getWorldQuaternion(worldQuat);

            pivot.remove(piece.mesh);
            scene.add(piece.mesh);

            piece.mesh.position.copy(worldPos);
            piece.mesh.quaternion.copy(worldQuat);

            piece.position.x = Math.round(worldPos.x);
            piece.position.y = Math.round(worldPos.y);
            piece.position.z = Math.round(worldPos.z);
          });

          const gizmoWorldQuat = new THREE.Quaternion();
          gizmo.getWorldQuaternion(gizmoWorldQuat);

          pivot.remove(gizmo);
          scene.add(gizmo);

          gizmo.quaternion.copy(gizmoWorldQuat);

          scene.remove(pivot);
          isAnimating = false;

          if (animationQueue.length > 0) {
            const next = animationQueue.shift();
            next?.();
          }

          resolve();
        }
      }

      requestAnimationFrame(animate);
    });
  }

  export async function executeMove(move: Move): Promise<void> {
    engine.executeMove(move);

    const actions = getMoveActions(move);
    for (const action of actions) {
      if ("type" in action) {
        await rotateCube(action.axis, action.clockwise);
      } else {
        await rotateLayer(action.axis, action.value, action.clockwise);
      }
    }
  }

  function getNormalizedMousePosition(event: MouseEvent): THREE.Vector2 {
    return new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    );
  }

  function handlePointerDown(event: MouseEvent) {
    if (isAnimating) return;

    const mouse = getNormalizedMousePosition(event);
    raycaster.setFromCamera(mouse, camera);

    const allMeshes = pieces.map((p) => p.mesh);
    const intersects = raycaster.intersectObjects(allMeshes, true);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const piece = pieces.find(
        (p) => p.mesh === intersect.object || p.mesh.children.includes(intersect.object),
      );

      if (piece && intersect.face) {
        controls.enabled = false;
        isDragging = true;
        dragStartPosition = { x: event.clientX, y: event.clientY };
        dragStartTime = performance.now();
        clickedFace = { piece, normal: intersect.face.normal.clone() };
      }
    }
  }

  function handlePointerMove() {
    // Future: implement visual feedback during drag
  }

  function handlePointerUp(event: MouseEvent) {
    if (!isDragging || !dragStartPosition || !clickedFace) {
      controls.enabled = true;
      return;
    }

    const deltaX = event.clientX - dragStartPosition.x;
    const deltaY = event.clientY - dragStartPosition.y;
    const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (dragDistance < 10) {
      isDragging = false;
      clickedFace = null;
      controls.enabled = true;
      return;
    }

    const dragTime = performance.now() - dragStartTime;
    const velocity = dragDistance / dragTime;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const isHorizontal = absDeltaX > absDeltaY;

    const worldNormal = clickedFace.normal
      .clone()
      .applyQuaternion(clickedFace.piece.mesh.quaternion)
      .normalize();

    const determineMove = (): Move | null => {
      const pos = clickedFace!.piece.position;
      const threshold = dragDistance > 50 || velocity > 0.3 ? 0.3 : 0.7;

      if (Math.abs(worldNormal.z) > threshold) {
        if (isHorizontal) {
          if (pos.y === 1) return deltaX > 0 ? "U'" : "U";
          if (pos.y === -1) return deltaX > 0 ? "D" : "D'";
          if (pos.y === 0) return deltaX > 0 ? "E" : "E'";
        } else {
          if (pos.x === 1) return deltaY > 0 ? "R'" : "R";
          if (pos.x === -1) return deltaY > 0 ? "L" : "L'";
          if (pos.x === 0) return deltaY > 0 ? "M'" : "M";
        }
      } else if (Math.abs(worldNormal.y) > threshold) {
        if (isHorizontal) {
          if (pos.z === 1) return deltaX > 0 ? "F'" : "F";
          if (pos.z === -1) return deltaX > 0 ? "B" : "B'";
          if (pos.z === 0) return deltaX > 0 ? "S'" : "S";
        } else {
          if (pos.x === 1) return deltaY > 0 ? "R'" : "R";
          if (pos.x === -1) return deltaY > 0 ? "L" : "L'";
          if (pos.x === 0) return deltaY > 0 ? "M'" : "M";
        }
      } else if (Math.abs(worldNormal.x) > threshold) {
        if (isHorizontal) {
          if (pos.y === 1) return deltaX > 0 ? "U'" : "U";
          if (pos.y === -1) return deltaX > 0 ? "D" : "D'";
          if (pos.y === 0) return deltaX > 0 ? "E" : "E'";
        } else {
          if (pos.z === 1) return deltaY > 0 ? "F" : "F'";
          if (pos.z === -1) return deltaY > 0 ? "B'" : "B";
          if (pos.z === 0) return deltaY > 0 ? "S" : "S'";
        }
      }
      return null;
    };

    const move = determineMove();
    if (move) {
      executeMove(move);
    }

    isDragging = false;
    clickedFace = null;
    dragStartPosition = null;
    controls.enabled = true;
  }

  onMount(() => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    raycaster = new THREE.Raycaster();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    camera.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    scene.add(camera);

    createGizmo();
    createRubiksCube();

    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      controls.dispose();
      renderer.dispose();
      pieces.forEach((piece) => {
        piece.mesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });
    };
  });
</script>

<canvas bind:this={canvas} class="block h-screen w-screen"></canvas>
