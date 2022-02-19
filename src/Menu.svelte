<script>
  import { gameName, flowScene } from "./stores"
  import { Button, Navbar } from "spaper"
</script>

<Navbar class="margin-bottom">
  <h3 slot="brand">
    <a href="#">{$gameName}</a>
  </h3>
  <ul class="inline">
    <li>
      <Button size="small" block="true" class="inline">About Us</Button>
    </li>
    <li>
      <Button size="small" block="true" on:click={$flowScene.transitionToHome()}>Home</Button>
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
