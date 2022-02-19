<script>
  import { flowScene, levelsComplete } from "./stores";

  const levels = ["Ballon perché", 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>

<div class="main">
  <div class="levels">
    {#each levels as level}
      <div class="level">
        <img src="" alt="" />
        <button on:click={$flowScene.transitionToGame(level)}
          >Niveau {level}</button
        >
        {#if $levelsComplete && $levelsComplete[level]}
          <p>Completed !!</p>
        {/if}
      </div>
    {/each}
  </div>
</div>
