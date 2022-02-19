<script>
  import "papercss/dist/paper.min.css";

  import { flowScene } from "./stores";
  import { loadProgression } from "./save";
  import { Home, Intro } from "./scenes";

  // Import scenes
  import HomeScene from "./Home.svelte";
  import IntroScene from "./Intro.svelte";
  import LevelSelection from "./LevelSelection.svelte";
  import Achievements from "./Achievements.svelte";
  import Settings from "./Settings.svelte";
  import Menu from "./Menu.svelte";
  import GameFlow from "./GameFlow.svelte";

  flowScene.set(new Intro());
  loadProgression();
</script>

<main>
  <Menu />
  {#if $flowScene.name === "intro"}<IntroScene />{/if}
  {#if $flowScene.name === "home"}<HomeScene />{/if}
  {#if $flowScene.name === "levelSelection"}<LevelSelection />{/if}
  {#if $flowScene.name === "achievements"}<Achievements />{/if}
  {#if $flowScene.name === "settings"}<Settings />{/if}
  {#if $flowScene.name === "gameFlow"}<GameFlow />{/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
