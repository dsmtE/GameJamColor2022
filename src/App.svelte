<script>
  import Home from "./Home.svelte";
  import LevelSelection from "./LevelSelection.svelte";
  import Achievements from "./Achievements.svelte";
  import Settings from "./Settings.svelte";
  import Menu from "./Menu.svelte";
  import { flowScene } from "./stores";
</script>

<main>
  <Menu />
  {#if $flowScene.name === "home"}<Home />{/if}
  {#if $flowScene.name === "levelSelection"}<LevelSelection />{/if}
  {#if $flowScene.name === "achievements"}<Achievements />{/if}
  {#if $flowScene.name === "settings"}<Settings />{/if}
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
