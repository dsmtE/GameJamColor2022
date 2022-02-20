<script>
  import objectsData from "./data/img_data";
  import Img from "./Image.svelte";

</script>

<main>
  {#each Object.keys(objectsData) as key}
    <Img object={objectsData[key]} />
  {/each}
</main>
