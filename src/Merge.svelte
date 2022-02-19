<script>
	import {ComputeMixing} from "./core/recipesUtils"
	import levelsRecipes from "./data/levels_data"
	import interact from "interactjs";

	import {flip} from 'svelte/animate';
	
	let level = 0

	// copy startingItems in current inventory
	let inventory =  [...levelsRecipes[level].startingItems]

	let mixingBowl = []

	function handleDragStartFromInventory(event, itemIndex) {
		const data = {
			"itemIndex": itemIndex
		};
   		event.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

	function handleDragEndFromInventory(event, itemIndex) {
		event.preventDefault();
    }

	function clearMixingBowl() {
		mixingBowl = []
	}

	function handleDragDropToMixingBowl(event) {
		event.preventDefault();

		const data = JSON.parse(event.dataTransfer.getData("text/plain"));
		
		mixingBowl = new Array(...new Set([...mixingBowl, inventory[data.itemIndex]]));
		
		const mixingResult = ComputeMixing(mixingBowl, levelsRecipes[level].recipes);
		if(mixingResult !== undefined) {
			mixingBowl = [];
			alert("You unlock" + mixingResult);
			inventory = new Array(...new Set([...inventory, ...mixingResult]));
		}
    }

// temp

  function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '#yes-drop',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active')
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget
    var dropzoneElement = event.target

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target')
    draggableElement.classList.add('can-drop')
    draggableElement.textContent = 'Dragged in'
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target')
    event.relatedTarget.classList.remove('can-drop')
    event.relatedTarget.textContent = 'Dragged out'
  },
  ondrop: function (event) {
    event.relatedTarget.textContent = 'Dropped'
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active')
    event.target.classList.remove('drop-target')
  }
})

interact('.drag-drop')
  .draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    autoScroll: true,
    // dragMoveListener from the dragging demo above
    listeners: { move: dragMoveListener }
  })

// temp 

</script>

<h1> niveau {levelsRecipes[level].name} </h1>

<!-- temp -->

<div id="no-drop" class="drag-drop"> #no-drop </div>

<div id="yes-drop" class="drag-drop"> #yes-drop </div>

<div id="outer-dropzone" class="dropzone">
  #outer-dropzone
  <div id="inner-dropzone" class="dropzone">#inner-dropzone</div>
 </div>

<!-- temp -->

<div>
	<b>MixingBowl</b>
	<button on:click={e => clearMixingBowl()} > clear </button>
	<ul id="mixingBowl"
		on:drop={e => handleDragDropToMixingBowl(e)}
		ondragover="return false">
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
			<li draggable={true}
				on:dragstart={e => handleDragStartFromInventory(e, itemIndex)}
				on:dragend={e => handleDragEndFromInventory(e, itemIndex)}>
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

	/* temp */

	#outer-dropzone {
	height: 200px;
	}

	#inner-dropzone {
	height: 140px;
	}

	.dropzone {
	background-color: #cfb41b;
	border: dashed 4px transparent;
	border-radius: 4px;
	margin: 10px auto 30px;
	padding: 10px;
	width: 80%;
	transition: background-color 0.3s;
	}

	div:global(.drop-active) {
		border-color: rgb(240, 50, 50);
	}

	div:global(.drop-target) {
		background-color: rgb(157, 196, 223);
		border-color: #fff;
		border-style: solid;
	}

	.drag-drop {
	display: inline-block;
	min-width: 40px;
	padding: 2em 0.5em;
	margin: 1rem 0 0 1rem;

	color: #fff;
	background-color: #29e;
	border: solid 2px #fff;

	touch-action: none;
	transform: translate(0px, 0px);

	transition: background-color 0.3s;
	}

	:global(.drag-drop.can-drop) {
	color: #000;
	background-color: #4e4;
	}

/* temp */
</style>