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
    {#each levels as level}
      <div class="level">
        <img src="" alt="" />
        <button on:click={$flowScene.transitionToGame(level)}
          >Niveau {level}</button
        >
        {#if localLevelsComplete && localLevelsComplete[level]}
          <p>Completed !!</p>
        {/if}
      </div>
    {/each}
  </div>
  <div class="reset">
    <button on:click={reset}>DEBUG: Reset progression</button>
  </div>
</div>
