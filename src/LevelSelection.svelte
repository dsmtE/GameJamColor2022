<script>
  import { flowScene, levelsComplete } from "./stores";
  import { saveProgression } from "./save";
  import levelsData from "./data/levels_data.js";
  import { getImageDataFromName } from "./core/getImageDataFromName"

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
        <div class="level paper border"
        style = 'background-image : url("img/{getImageDataFromName(level).src}.png")'
        >
            <button on:click={$flowScene.transitionToGame(level)}
            >{level}</button
            >
            </div>
        {/if}
    {/each}
  </div>
</div>

<style>
  .levels {
    display: flex;
    flex-direction: column;
    height: auto;
    height: 100%;
  }

  .level {
    padding: 10px;
    height: 15%;
    background-position: center;
    background-attachment: cover;
    margin-top: auto;
    margin-bottom: auto;
  }

  .main {
    height: 80%;
  }
</style>