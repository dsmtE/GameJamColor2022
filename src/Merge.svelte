<script>
	import {ComputeMixing} from "./core/recipesUtils"
	import levelsRecipes from "../data/recipes"

	import {flip} from 'svelte/animate';
	
	let level = 0

	let inventory =  [...levelsRecipes[level].startingItems]

	let mixingBowl = []

	let mixingBowlHover = false;
	let status = '';

	function handleDragStart(event, itemIndex, fromInventory) {
		status = "handleDragStart with " + itemIndex;

		const data = {
			"fromInventory": fromInventory,
			"itemIndex": itemIndex
		};

   		event.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

	function handleDragEnd(event, itemIndex, fromInventory) {
		event.preventDefault();

		if(!fromInventory && !mixingBowlHover) {
			mixingBowl.splice(itemIndex, 1);
			mixingBowl = mixingBowl;
		}
    }

	function handleDragDrop(event) {
		event.preventDefault();

		console.log("handleDragDrop", event)
		const data = JSON.parse(event.dataTransfer.getData("text/plain"));

		if(data.fromInventory) {
			status = "You droped " + data.itemIndex + " into mixing bowl";
			mixingBowl = new Array(...new Set([...mixingBowl, inventory[data.itemIndex]]));
			
			const mixingResult = ComputeMixing(mixingBowl, levelsRecipes[level].recipes);
			if(mixingResult !== undefined) {
				mixingBowl = [];
				alert("You unlock" + mixingResult);
				inventory = [...inventory, ...mixingResult];
			}
		}
    }

</script>

<h1> niveau {levelsRecipes[level].name} </h1>

<p> debug status : {status} </p>

<div>
	<b>MixingBowl</b>
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<ul id="mixingBowl"
		on:drop={e => handleDragDrop(e)}
		on:dragenter={event => {
			if ( event.target.id == "mixingBowl" ) {
				console.log("dragenter bowl");
				
				mixingBowlHover = true
			}
		}}
		on:dragleave={event => {
			if ( event.target.id == "mixingBowl" ) {
				console.log("dragleave bowl");
				mixingBowlHover = false
			}
			
		}}
		ondragover="return false">
		{#each mixingBowl as item, itemIndex (item)}
			<div class="item" animate:flip>
				<li draggable={true}
				on:dragstart={e => handleDragStart(e, itemIndex, false)}
				on:dragend={e => handleDragEnd(e, itemIndex, false)}>
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
			<li draggable={true}
				on:dragstart={e => handleDragStart(e, itemIndex, true)}
				on:dragend={e => handleDragEnd(e, itemIndex, true)}>
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