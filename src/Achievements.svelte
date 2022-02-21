<script>
  import ImageComponent from "./Image.svelte";
  import { get } from "svelte/store";
  import { levelsComplete, hiddenAchievement } from "./stores.js";
  import levelsData from "./data/levels_data.js";
  import imagesData from "./data/img_data.js";

  const allAchievements = {};
  let allAchievementsCount = 0;
  let allAchievementsDone = 0;
  for (let key in levelsData) {
    allAchievements[key] = {
      Facile: false,
      Expert: false,
      Raté: false,
    };
    allAchievementsCount += 3;
    if (get(levelsComplete)) {
      const currentLevelComplete = get(levelsComplete)[key] || {};
      if (
        currentLevelComplete["easy"] &&
        currentLevelComplete["easy"] === true
      ) {
        allAchievementsDone += 1;
        const solutionKey = levelsData[key]["easySolution"];
        const currentImageObjectProp = imagesData[solutionKey];
        currentImageObjectProp["name"] = solutionKey;
        allAchievements[key]["Facile"] = {
          done: true,
          class: "easy",
          object: currentImageObjectProp,
        };
      }
      if (
        currentLevelComplete["expert"] &&
        currentLevelComplete["expert"] === true
      ) {
        allAchievementsDone += 1;
        const solutionKey = levelsData[key]["expertSolution"];
        const currentImageObjectProp = imagesData[solutionKey];
        currentImageObjectProp["name"] = solutionKey;
        allAchievements[key]["Expert"] = {
          done: true,
          class: "expert",
          object: currentImageObjectProp,
        };
      }
      if (
        currentLevelComplete["fail"] &&
        currentLevelComplete["fail"] === true
      ) {
        allAchievementsDone += 1;
        const solutionKey = levelsData[key]["failSolution"];
        const currentImageObjectProp = imagesData[solutionKey];
        currentImageObjectProp["name"] = solutionKey;
        allAchievements[key]["Raté"] = {
          done: true,
          class: "fail",
          object: currentImageObjectProp,
        };
      }
    }
  }
  const questionObject = { src: "question", name: "Inconnu" };
  const brokenSwordObject = { src: "epee_cassee", name: "PKC" };
</script>

<h3>{allAchievementsDone} succès déverrouillés sur {allAchievementsCount}</h3>

{#each Object.keys(levelsData) as key}
  <div class="item row">
    <div class="col col-3 align-middle">
      <p class="achievement-name">{key}</p>
    </div>
    {#each Object.keys(allAchievements[key]) as difficulty}
      {#if allAchievements[key][difficulty]}
        <div class="col col-3">
          <div class={"difficulty true " + difficulty}>
            <p>{difficulty}</p>
            <ImageComponent
              object={allAchievements[key][difficulty]["object"]}
            />
          </div>
        </div>
      {:else}
        <div class="col col-3">
          <div class={"difficulty false " + difficulty}>
            <p>{difficulty}</p>
            <ImageComponent object={questionObject} />
          </div>
        </div>
      {/if}
    {/each}
  </div>
  <!-- {/if} -->
{/each}

<h3>Succès cachés</h3>

<div class="item row">
  {#if $hiddenAchievement["brokenSword"]}
    <div class="col col-3 align-middle">
      <div class="difficulty true">
        <p>Crafter l'épée légendaire</p>
        <ImageComponent object={brokenSwordObject} />
      </div>
    </div>
  {:else}
    <div class="col col-3 align-middle">
      <div class="difficulty true">
        <p>Crafter l'épée légendaire</p>
        <ImageComponent object={questionObject} />
      </div>
    </div>
  {/if}
</div>

<style>
  .achievement-name {
    font-size: 1.7em;
  }

  .difficulty {
    font-size: 1.4em;
  }

  .difficulty p {
    text-align: left;
  }
</style>
