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
    width: 40%;
  }
  img {
    height: 50%;
    background-color: #ffffffbb;
  }
</style>
