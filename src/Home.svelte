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
    <div class="footer">
      <button on:click={$flowScene.transitionToAchievements()}>Succès</button>
      <img class="logo" src="./img/logo_pkc.png"
      alt="logo_team"/>
      <button on:click={$flowScene.transitionToSettings()}>Paramètres</button>
    </div>
  </div>
</div>