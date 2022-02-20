<script>
  import { get } from "svelte/store";
  import { Level } from "./level.js";
  import { flowScene, level } from "./stores.js";
  import Dialog from "./Dialog.svelte";
  import Merge from "./Merge.svelte";
  import ImageReveal from"./ImageReveal.svelte";

  let currentLevel = new Level(get(flowScene));
  let solutionHasBeenFound = false
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
      if (!solutionHasBeenFound) {
        const isSolution = get(level).isSolutionItem(mixingItem);
        if (isSolution) {
          solutionHasBeenFound = true
          get(level).ImageToPrint(isSolution);
          get(level).gameEndWithSolution(isSolution);
          advance();
          // setTimeout(() => {
          //   advance()
          // }, 2000);
        }
      }   
    }
  }
</script>

{#if currentLevel.currentFlowType() === "dialog"}
  <Dialog dialog={currentLevel.currentFlow()} on:end={advance} />
{/if}
{#if currentLevel.currentFlowType() === "image"}
  <ImageReveal imgObject={{src: currentLevel.currentFlow().src, name: currentLevel.currentFlow().name}} on:end={advance}/>
{/if}
{#if currentLevel.currentFlowType() === "game"}
  <Merge on:newItem={callBackNewItem} />
{/if}

