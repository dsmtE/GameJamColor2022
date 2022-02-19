import { writable } from 'svelte/store'

export const gameName = writable('<VariableNomDuJeu>')
export const flowScene = writable()
export const levelsComplete = writable()
export const level = writable()
export const introText = writable(`
<p> Bienvenue dans notre super jeu ! </p>
<p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti iure totam nam debitis aliquid impedit, et quas omnis aspernatur optio molestias ex laborum quia. Ducimus culpa tempore, veritatis officia delectus dolore dignissimos reprehenderit vero, sunt odit placeat est non molestiae ipsa nam velit in iusto hic quasi similique facere. Maxime?
</p>
`)
