<!--  -->
<script>
  export let object;
  
</script>

<main>
  <div class="object">
    <img src={"./img/" + object.src + ".png"} alt={object.name} />
    <p>{object.name}</p>
  </div>
</main>

<style>
  .object {
    flex-direction: column;
    float: right;
    width: 120px;
  }
  img {
    height: 120px;
  }
  div:global(.drag-drop) img {
    color: #000;
    background-color: rgb(238, 68, 229);
  }
</style>
