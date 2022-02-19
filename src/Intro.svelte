<script>
  import { gameName, flowScene, introText } from "./stores"
  import { Article, Button } from "spaper"
</script>

<Article title={"Intro"} border>
  {@html $introText}
  <Button on:click={$flowScene.transitionToHome()}>Go</Button>
</Article>
