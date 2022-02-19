<script>
  import { ComputeMixing } from "./core/recipesUtils";
  import levelsRecipes from "./data/levels_data";
  import { flip } from "svelte/animate";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let level = "Ballon perché";

  // copy startingItems in current inventory
  let inventory = [...levelsRecipes[level].startingItems];

  export let mixingBowl = [];

  function handleDragStartFromInventory(event, itemIndex) {
    const data = {
      itemIndex: itemIndex,
    };
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
  }

  function handleDragEndFromInventory(event, itemIndex) {
    event.preventDefault();
  }

  function clearMixingBowl() {
    mixingBowl = [];
  }

  function handleDragDropToMixingBowl(event) {
    event.preventDefault();

    const data = JSON.parse(event.dataTransfer.getData("text/plain"));

    mixingBowl = new Array(
      ...new Set([...mixingBowl, inventory[data.itemIndex]])
    );

    const mixingResult = ComputeMixing(
      mixingBowl,
      levelsRecipes[level].recipes
    );
    if (mixingResult !== undefined) {
      mixingBowl = [];
      inventory = new Array(...new Set([...inventory, ...mixingResult]));
      dispatch("newItem", mixingResult);
    }
  }
</script>

<h1>niveau {levelsRecipes[level].name}</h1>

<div>
  <b>MixingBowl</b>
  <button on:click={(e) => clearMixingBowl()}> clear </button>
  <ul
    id="mixingBowl"
    on:drop={(e) => handleDragDropToMixingBowl(e)}
    ondragover="return false"
  >
    {#each mixingBowl as item, itemIndex (item)}
      <div class="item" animate:flip>
        <li>
          {item}
        </li>
      </div>
    {/each}
  </ul>
</div>

<div>
  <b>Inventory</b>
  <ul>
    {#each inventory as item, itemIndex (item)}
      <div class="item" animate:flip>
        <li
          draggable={true}
          on:dragstart={(e) => handleDragStartFromInventory(e, itemIndex)}
          on:dragend={(e) => handleDragEndFromInventory(e, itemIndex)}
        >
          {item}
        </li>
      </div>
    {/each}
  </ul>
</div>

<style>
  .item {
    display: inline; /* required for flip to work */
  }

  li {
    background-color: lightgray;
    cursor: pointer;
    display: inline-block;
    margin-right: 10px;
    padding: 10px;
  }
  li:hover {
    background: orange;
    color: white;
  }
  ul {
    border: solid lightgray 1px;
    display: flex; /* required for drag & drop to work when .item display is inline */
    height: 40px; /* needed when empty */
    padding: 10px;
  }
</style>
