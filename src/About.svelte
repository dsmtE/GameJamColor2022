<script>
  import { Article } from "spaper";
  import shuffleArray from "./core/shuffleArray";
  let about = [
    { name: "Jules", website: "https://julesfouchy.github.io/home/" },
    { name: "Anaïs", website: "#" },
    { name: "Clémence", website: "https://www.instagram.com/poulpillow/" },
    { name: "Lilou", website: "https://www.instagram.com/miss_bidule/" },
    { name: "Amalia", website: "https://github.com/mmmaxou" },
    { name: "Enguerrand", website: "#" },
    { name: "Emma", website: "#" },
    { name: "Aurore", website: "#" },
  ];
  console.log(about);
  shuffleArray(about);
</script>

<div class="main">
  <Article title={"Les alchimistes :"} border>
    <ul>
      {#each about as { name, website }}
        <li>
          {#if website != "#"}
            <a target="_blank" href={website}>{name}</a>
          {:else}
            {name}
          {/if}
        </li>
      {/each}
    </ul>
  </Article>

  <br />
</div>
