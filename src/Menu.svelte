<script>
  import { gameName, flowScene } from "./stores"
  import { Button, Navbar } from "spaper"
</script>

<Navbar class="margin-bottom">
  <h3 slot="brand">
    <span class="home-button" on:click={$flowScene.transitionToHome()}>{$gameName}</span>
  </h3>
  <ul class="inline">
    <li>
      <Button size="small" block="true" class="inline">About Us</Button>
    </li>
    <li>
      <Button
        size="small"
        block="true"
        href="https://github.com/dsmtE/GameJamColor2022">Github</Button
      >
    </li>
  </ul>
</Navbar>

<style>
    .home-button {
        border-bottom: 5px solid;
        border-bottom-left-radius: 15px 3px;
        border-bottom-right-radius: 15px 5px;
    }
    .home-button:hover {
        cursor: pointer;
    }
  </style>
  