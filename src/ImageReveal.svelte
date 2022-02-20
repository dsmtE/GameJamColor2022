<!--  -->
<script>
  export let imgObject;

  import { createEventDispatcher } from "svelte";
  import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
  import { fade, scale } from 'svelte/transition';

  import { Toast } from "spaper";

  const dispatch = createEventDispatcher();

  $: showImg = $progress > 0.1 && $progress < 0.6;
  
  const progress = tweened(0, {
    duration: 2000,
		easing: linear
	});

  // const customTransition = () => {
  //   return {
  //     css: (t) => {
  //       return `
  //       transform: scale(${t});
  //       `;
  //     },
  //     easing: elasticInOut,
  //     duration: 2000,
  //   };
  // };

  $: if ($progress == 1) {
    dispatch("end");
  }

  progress.set(1);  

</script>

<div class="container">
  {#if showImg}
    <div in:scale out:fade class="item">
      <img src={"./img/" + imgObject.src + ".png"} alt={imgObject.name} />
    </div>
  {/if}
</div>

<style>

  .container {
     display: flex;
     align-items: center;
     justify-content: center;
     flex-flow: column;
     height: 100%;

  }
  .item {
      width: 200px;
      height: 200px; 
  }

  img {
    background-color: #ffffffbb;
  }

</style>
