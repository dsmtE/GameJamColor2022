<script>
  import { get } from "svelte/store";
  import { Level } from "./level.js";
  import { flowScene, level } from "./stores.js";
  import Dialog from "./Dialog.svelte";
  import Merge from "./Merge.svelte";

  let currentLevel = new Level(get(flowScene));
  level.set(currentLevel);

  function advance() {
    currentLevel.advance();
  
    // svelte tricks update
    currentLevel = currentLevel;

    if (currentLevel.isComplete()) {
      get(flowScene).transitionToLevelSelection(true);
    }
  }

</script>

<main>

  {#if currentLevel.currentFlowType() === "dialog"}
    <Dialog dialog={currentLevel.currentFlow()} on:end={advance} />
  {/if}

  {#if currentLevel.currentFlowType() === "game"}
	  <Merge />
  {/if}

</main>
