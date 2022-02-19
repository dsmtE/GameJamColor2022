<script>
  import { gameName, flowScene } from "./stores";
</script>

<div class="main">
  <h1>{$gameName}</h1>
  <h2>
    <button on:click={$flowScene.transitionToLevelSelection()}>Jouer</button>
  </h2>
  <div>
    <button on:click={$flowScene.transitionToAchievements()}>Succès</button>
    <button on:click={$flowScene.transitionToSettings()}>Paramètres</button>
  </div>
</div>
