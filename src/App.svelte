<script>
  import { flowScene } from "./stores";
  import HomeScene from "./Home.svelte";
  import LevelSelection from "./LevelSelection.svelte";
  import Achievements from "./Achievements.svelte";
  import Settings from "./Settings.svelte";
  import Menu from "./Menu.svelte";
  import GameFlow from "./GameFlow.svelte";

  import { Home } from "./scenes";
  import Merge from './Merge.svelte'

  flowScene.set(new Home());
</script>

<main>
  <Menu />
  {#if $flowScene.name === "home"}<HomeScene />{/if}
  {#if $flowScene.name === "levelSelection"}<LevelSelection />{/if}
  {#if $flowScene.name === "achievements"}<Achievements />{/if}
  {#if $flowScene.name === "settings"}<Settings />{/if}
  {#if $flowScene.name === "gameFlow"}<GameFlow />{/if}
</main>
<Merge />

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
