<script>
import {getImageDataFromName} from "./core/getImageDataFromName";

import { get } from "svelte/store";
import { level } from "./stores.js";
import levels from './data/levels_data.js'

let type = 0
let Solution = "Échelle"
let test = getImageDataFromName(Solution);
console.log(levels['Ballon perché']);
Array.prototype.forEach.call(levels, child => {
  console.log(child)
});
</script>

<h3>15 succés déverrouillés sur 15</h3>

<div class="container">
    <div class="inner-container">
        <div class="red" /><div class="red" /><div class="red" />
    </div>
    <div class="inner-container">
        <div class="red" /><div class="red" /><div class="red" />
    </div>
</div>

<!--{#each inventory as item, itemIndex (item)}
    <div id="item" class="drag-drop object"> 
      <img src={"./img/" + getImageDataFromName(item).src + ".png"} alt={getImageDataFromName(item).name} />
      <p>{getImageDataFromName(item).name}</p>
    </div>
{/each}-->

<style>

.red {
    background-color : red;
    height : 100px;
    width : 100px;
    margin: 2px;
}

.container {
    display: flex;
    flex-direction: column;
}

.inner-container {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    margin: 20px;
}

</style>