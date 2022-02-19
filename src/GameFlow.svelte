<script>
  import { get } from "svelte/store";
  import { Level } from "./level.js";
  import { flowScene, level } from "./stores.js";
  import Dialog from "./Dialog.svelte";

  let levelDisplay = [];

  level.set(new Level(get(flowScene)));

  function advance() {
    get(level).advance();
    computeDisplay();
    if (get(level).isComplete()) {
      get(flowScene).transitionToLevelSelection(true);
    }
  }

  function computeDisplay() {
    levelDisplay = get(level).flow.filter(
      (_, index) => !(index > get(level).advancement)
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
  {#if ["dialog"].includes(get(level).currentFlowType())}
    <button on:click={advance}>Okay.</button>
  {/if}
</main>
