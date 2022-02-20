import { writable } from 'svelte/store'

export const gameName = writable('La Cour des Grands')
export const flowScene = writable()
export const levelsComplete = writable()
export const level = writable()
export const introText = writable(`
<p> Bienvenue dans la cour des grands ! </p>
<p>
    Dans ce jeu de craft, combine les objets pour en débloquer de nouveaux et résoudre tes problèmes de manière ingénieuse et parfois inattendue.
</p>
<p>
    Laisse libre cours à ton imagination, il y a plusieurs solutions pour chaque niveau !
</p>
`)
