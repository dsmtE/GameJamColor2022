<script>
  import { flowScene, levelsComplete } from "./stores";
  import { saveProgression } from "./save";
  import levelsData from "./data/levels_data.js";

  let levels = Object.keys(levelsData);

  function reset() {
    saveProgression(true);
    levels = Object.keys(levelsData);
  }

  let localLevelsComplete = {};
  levelsComplete.subscribe((completion) => (localLevelsComplete = completion));
</script>

<div class="main">
  <div class="levels">
    {#each levels as level, i}
        {#if i === 0 || (localLevelsComplete && localLevelsComplete[levels[i - 1]])}
        <div class="level">
            <img src="" alt="" />
            <button on:click={$flowScene.transitionToGame(level)}
            >{level}</button
            >
            </div>
        {/if}
    {/each}
  </div>
</div>
