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

    if (currentLevel.isComplete()) {
      get(flowScene).transitionToLevelSelection(true);
    } else {
      // svelte tricks update
      currentLevel = currentLevel;
    }
  }

  function callBackNewItem(event) {
    for (let key in event.detail) {
      const mixingItem = event.detail[key];
      const isSolution = get(level).isSolutionItem(mixingItem);
      if (isSolution) {
        get(level).gameEndWithSolution(isSolution);
        advance();
      }
    }
  }
</script>

<main>
  {#if currentLevel.currentFlowType() === "dialog"}
    <Dialog dialog={currentLevel.currentFlow()} on:end={advance} />
  {/if}

  {#if currentLevel.currentFlowType() === "game"}
    <Merge on:newItem={callBackNewItem} />
  {/if}
</main>
