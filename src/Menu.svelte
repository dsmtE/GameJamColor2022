<script>
  import { gameName, flowScene } from "./stores";
  import { Button, Navbar } from "spaper";
</script>

<Navbar class="margin-bottom">
  <h3 slot="brand">
    <span class="home-button" on:click={$flowScene.transitionToHome()}
      >{$gameName}</span
    >
  </h3>
  <ul class="inline">
    <li>
      <Button
        size="small"
        block="true"
        class="inline"
        on:click={$flowScene.transitionToAbout()}>À propos</Button
      >
    </li>
    <li>
      <Button
        size="small"
        block="true"
        on:click={() =>
          window.open("https://github.com/dsmtE/GameJamColor2022", "_blank")}
        >Github</Button
      >
    </li>
  </ul>
</Navbar>

<style>
  .home-button:hover {
    cursor: pointer;
  }
</style>
