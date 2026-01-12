<script lang="ts">
  import RubiksCube from "$lib/components/RubiksCube.svelte";
  import { CubeEngine } from "$lib/cube-engine";
  import { AlgorithmExecutor } from "$lib/algorithm-executor";

  let cubeComponent: RubiksCube;
  const engine = new CubeEngine();
  const executor = new AlgorithmExecutor();

  let algorithmInput = "";
  let isExecuting = false;

  async function executeAlgorithm() {
    if (!algorithmInput.trim() || isExecuting) return;

    isExecuting = true;
    await executor.executeAlgorithm(algorithmInput, async (move) => {
      await cubeComponent.executeMove(move);
    });
    isExecuting = false;
  }

  function stopAlgorithm() {
    executor.stop();
  }

  function resetCube() {
    engine.reset();
    location.reload();
  }
</script>

<RubiksCube bind:this={cubeComponent} {engine} {executor} />

<div class="fixed top-5 left-5 max-w-md rounded-lg bg-white/90 p-5 shadow-lg">
  <h3 class="mb-3 text-lg font-semibold text-gray-800">Algorithm Executor</h3>

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
      {isExecuting ? "Executing..." : "Execute"}
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
      <li><strong>Cube Rotation:</strong> x y' z</li>
    </ul>
  </div>
</div>
