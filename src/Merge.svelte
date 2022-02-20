<script>
  import { ComputeMixing } from "./core/recipesUtils";
  import interact from "interactjs";
  import { createEventDispatcher } from "svelte";
  import { get } from "svelte/store";
  import { level } from "./stores.js";
  import ImageComponent from "./Image.svelte";
  import imagesData from "./data/img_data";

  const dispatch = createEventDispatcher();

  let currentLevel = get(level);

  let inventory = [...currentLevel.startingItems];
  let mixingBowl = [];

  function getImageDataFromName(name) {
    const data = imagesData[name] || { src: "" };
    const src = data["src"];
    return { name, src };
  }

  function resetMove() {
    Array.from(document.getElementsByClassName("drag-drop"))
         .forEach((element) =>
    {
      element.style.transform = "translate(0px, 0px)";
      element.setAttribute("data-x", "0");
      element.setAttribute("data-y", "0");
      if (element.classList.contains("can-drop")) {
        // remove the drop feedback style
        element.classList.remove("can-drop");
      }
    });
    mixingBowl = [];
  }

  function newElem() {
    //new elem ?
    const mixingResult = ComputeMixing(mixingBowl, currentLevel.recipes);
    if (mixingResult !== undefined) {
      mixingBowl = [];
      inventory = new Array(...new Set([...inventory, ...mixingResult]));
      resetMove();
      dispatch("newItem", mixingResult);
    }
  }

  //DRAG N DROP

  function dragMoveListener(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.transform = "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }

  // enable draggables to be dropped into this
  interact(".dropzone").dropzone({
    // only accept elements matching this CSS selector
    accept: "#item",
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.2,

    // listen for drop related events:

    ondropactivate: function (event) {
      // add active dropzone feedback
      event.target.classList.add("drop-active");
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget;
      var dropzoneElement = event.target;

      // feedback the possibility of a drop
      dropzoneElement.classList.add("drop-target");
      draggableElement.classList.add("can-drop");
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove("drop-target");
      event.relatedTarget.classList.remove("can-drop");
      //delete object
      let item = event.relatedTarget.textContent.slice(1, -1);
      mixingBowl.forEach((element, i) => {
        if (element == item) {
          mixingBowl.splice(i, 1);
        }
      });
      newElem();
    },
    ondrop: function (event) {
      //add object
      let item = event.relatedTarget.textContent.slice(1, -1);
      mixingBowl = new Array(...new Set([...mixingBowl, item]));
      newElem();
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove("drop-active");
      event.target.classList.remove("drop-target");
    },
  });

  interact(".drag-drop").draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
      }),
    ],
    autoScroll: true,
    // dragMoveListener from the dragging demo above
    listeners: { move: dragMoveListener },
  });
</script>

<h1>{currentLevel.name}</h1>

<div>
  <b>MixingBowl</b>
  <button on:click={(e) => resetMove()}> Ranger la table </button>
  <div id="MixingBowl" class="dropzone" />

  <b>Inventory</b>
  {#each inventory as item, itemIndex (item)}
    <div id="item" class="drag-drop object">  
      <img src={"./img/" + getImageDataFromName(item).src + ".png"} alt={getImageDataFromName(item).name} />
      <p>{getImageDataFromName(item).name}</p>
    </div>
  {/each}
</div>

<style>
  .object {
    flex-direction: column;
    float: right;
    width: 120px;
  }
  img {
    height: 120px;
  }
   #MixingBowl {
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
    padding: 2em 0.5em;
    margin: 1rem 0 0 1rem;
    touch-action: none;
    transform: translate(0px, 0px);

    transition: background-color 0.3s;
  }

  div:global(.drag-drop.can-drop) img {
    color: #000;
    border-color: #4e4;
  }
</style>
