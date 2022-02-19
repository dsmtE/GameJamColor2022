<script>
  import { createEventDispatcher } from "svelte";

  import { Button } from "spaper";

  const dispatch = createEventDispatcher();

  export let dialog;

  let step = 0;

  function next() {
    if (step < dialog.content.length) {
      step += 1;
    }

    if (step == dialog.content.length) {
      dispatch("end", { test: "s" });
      step = 0;
    }
  }
</script>

{#each { length: step + 1 } as _, i}
  <div class="margin padding border border-5">
    <p>{@html dialog.content[i]}</p>
  </div>
{/each}

<Button on:click={next}>Next</Button>
