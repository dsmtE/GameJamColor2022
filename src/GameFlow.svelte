<script>
  import { get } from "svelte/store";
  import { Level } from "./level.js";
  import { flowScene } from "./stores.js";
  import Dialog from "./Dialog.svelte";

  let level = new Level(get(flowScene));
  let levelDisplay = [];

  function advance() {
    level.advance();
    computeDisplay();
    if (level.isComplete()) {
      get(flowScene).transitionToLevelSelection(true);
    }
  }

  function computeDisplay() {
    levelDisplay = level.flow.filter(
      (_, index) => !(index > level.advancement)
    );
  }

  computeDisplay();
</script>

<main>
  {#each levelDisplay as step}
    {#if step.type === "dialog"}
      <Dialog dialog={step} />
    {/if}
  {/each}
  {#if ["dialog"].includes(level.currentFlowType())}
    <button on:click={advance}>Okay.</button>
  {/if}
</main>
