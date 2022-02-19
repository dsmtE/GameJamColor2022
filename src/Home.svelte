<script>
  import { gameName, flowScene, introText } from "./stores";
  import { Article, Button } from "spaper"
</script>

<div class="main">
    <Article title={$gameName} border>
        {@html $introText}
        <Button on:click={$flowScene.transitionToLevelSelection()}>Jouer</Button>
    </Article>

    <br/>
  <div>
    <button on:click={$flowScene.transitionToAchievements()}>Succès</button>
    <button on:click={$flowScene.transitionToSettings()}>Paramètres</button>
  </div>
</div>