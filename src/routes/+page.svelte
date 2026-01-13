<script lang="ts">
  import RubiksCube from "$lib/components/RubiksCube.svelte";
  import { CubeEngine, type Move } from "$lib/cube-engine";
  import { AlgorithmExecutor } from "$lib/algorithm-executor";
  import { CubeSolver } from "$lib/cube-solver";
  import { CFOPSolver } from "$lib/cfop-solver";

  let cubeComponent: RubiksCube;
  const engine = new CubeEngine();
  const executor = new AlgorithmExecutor();
  const solver = new CubeSolver();
  const cfopSolver = new CFOPSolver();

  let algorithmInput = $state("");
  let isExecuting = $state(false);
  let shuffleAlgorithm = $state("");
  let solutionAlgorithm = $state("");
  let solveMethod = $state<"inverse" | "cfop">("inverse");

  const BASIC_MOVES: Move[] = [
    "U",
    "U'",
    "U2",
    "D",
    "D'",
    "D2",
    "L",
    "L'",
    "L2",
    "R",
    "R'",
    "R2",
    "F",
    "F'",
    "F2",
    "B",
    "B'",
    "B2",
  ];

  function generateShuffleAlgorithm(): string {
    const moves: Move[] = [];
    for (let i = 0; i < 25; i++) {
      const randomMove = BASIC_MOVES[Math.floor(Math.random() * BASIC_MOVES.length)];
      moves.push(randomMove);
    }
    return moves.join(" ");
  }

  async function shuffleCube() {
    if (isExecuting) return;

    engine.reset();
    solver.reset();
    solutionAlgorithm = "";
    const newShuffle = generateShuffleAlgorithm();
    shuffleAlgorithm = newShuffle;

    isExecuting = true;
    await executor.executeAlgorithm(newShuffle, async (move) => {
      solver.recordMove(move);
      await cubeComponent.executeMove(move);
    });
    isExecuting = false;
  }

  async function executeAlgorithm() {
    if (!algorithmInput.trim() || isExecuting) return;

    isExecuting = true;
    await executor.executeAlgorithm(algorithmInput, async (move) => {
      solver.recordMove(move);
      await cubeComponent.executeMove(move);
    });
    isExecuting = false;
  }

  async function solveCube() {
    if (isExecuting) return;

    let solution: Move[];
    if (solveMethod === "cfop") {
      // Get scramble history from solver
      const scramble = shuffleAlgorithm.split(" ").filter((m) => m.trim()) as Move[];
      solution = cfopSolver.solve(scramble);
    } else {
      solution = solver.solve();
    }

    if (solution.length === 0) {
      solutionAlgorithm = "Cube is already solved!";
      return;
    }

    solutionAlgorithm = solution.join(" ");

    isExecuting = true;
    await executor.executeAlgorithm(solutionAlgorithm, async (move) => {
      await cubeComponent.executeMove(move);
    });
    isExecuting = false;

    // Reset solver after solving
    solver.reset();
  }

  function stopAlgorithm() {
    executor.stop();
  }

  function resetCube() {
    engine.reset();
    solver.reset();
    shuffleAlgorithm = "";
    solutionAlgorithm = "";
    location.reload();
  }
</script>

<RubiksCube bind:this={cubeComponent} {engine} {executor} />

<div class="fixed top-5 left-5 max-w-md rounded-lg bg-white/90 p-5 shadow-lg">
  <h1 class="mb-3 text-lg font-semibold text-gray-800">Rubik's Cube</h1>

  <div class="mb-4">
    <button
      onclick={shuffleCube}
      disabled={isExecuting}
      class="w-full rounded border-2 border-purple-600 bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isExecuting && shuffleAlgorithm ? "Shuffling..." : "Shuffle Cube"}
    </button>
  </div>

  {#if shuffleAlgorithm}
    <div class="mb-4 rounded bg-purple-50 p-3">
      <p class="text-xs font-semibold text-purple-900">Shuffle Algorithm:</p>
      <p class="mt-1 text-xs break-words text-purple-700">{shuffleAlgorithm}</p>
    </div>
  {/if}

  <div class="mb-4">
    <label for="solve-method" class="mb-2 block text-xs font-semibold text-gray-700"
      >Solve Method:</label
    >
    <select
      id="solve-method"
      bind:value={solveMethod}
      disabled={isExecuting}
      class="w-full rounded border-2 border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="inverse">Inverse Scramble</option>
      <option value="cfop">CFOP (Cross, F2L, OLL, PLL)</option>
    </select>
  </div>

  <div class="mb-4">
    <button
      onclick={solveCube}
      disabled={isExecuting}
      class="w-full rounded border-2 border-green-600 bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isExecuting && solutionAlgorithm && solutionAlgorithm !== "Cube is already solved!"
        ? "Solving..."
        : "Solve Cube"}
    </button>
  </div>

  {#if solutionAlgorithm}
    <div class="mb-4 rounded bg-green-50 p-3">
      <p class="text-xs font-semibold text-green-900">Solution Algorithm:</p>
      <p class="mt-1 text-xs break-words text-green-700">{solutionAlgorithm}</p>
    </div>
  {/if}

  <div class="mb-4">
    <input
      type="text"
      bind:value={algorithmInput}
      placeholder="Enter algorithm (e.g., R U R' U')"
      class="w-full rounded border-2 border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      disabled={isExecuting}
    />
  </div>

  <div class="flex gap-2">
    <button
      onclick={executeAlgorithm}
      disabled={isExecuting || !algorithmInput.trim()}
      class="flex-1 rounded border-2 border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isExecuting && !shuffleAlgorithm ? "Executing..." : "Execute"}
    </button>

    {#if isExecuting}
      <button
        onclick={stopAlgorithm}
        class="rounded border-2 border-red-600 bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700"
      >
        Stop
      </button>
    {/if}

    <button
      onclick={resetCube}
      disabled={isExecuting}
      class="rounded border-2 border-gray-600 bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Reset
    </button>
  </div>

  <div class="mt-4 rounded bg-gray-100 p-3">
    <p class="text-xs font-semibold text-gray-700">Example algorithms:</p>
    <ul class="mt-1 space-y-1 text-xs text-gray-600">
      <li><strong>Sexy Move:</strong> R U R' U'</li>
      <li><strong>T-Perm:</strong> R U R' U' R' F R2 U' R' U' R U R' F'</li>
      <li><strong>Double Moves:</strong> R2 U2 F2</li>
      <li><strong>Wide Moves:</strong> Rw U Rw' U' (or r U r' U')</li>
      <li><strong>Slice Moves:</strong> M2 E2 S2</li>
      <li><strong>Cube Rotations:</strong> x2 y2 z2</li>
    </ul>
  </div>
</div>
