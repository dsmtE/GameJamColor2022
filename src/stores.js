import { writable } from 'svelte/store'

export const gameName = writable('Childchemy')
export const flowScene = writable()
export const levelsComplete = writable()
export const level = writable()
export const introText = writable(`
<p> Bienvenue dans la cour des grands ! </p>
<p>
    Dans ce jeu dans le style d’un “Little Alchemy”, combine les objets dans la marmite pour en débloquer de nouveaux et résoudre tes problèmes de manière ingénieuse et parfois inattendue !
</p>
<p>
    Laisse libre cours à ton imagination !  Chaque niveau comporte 3 fins : une simple, une complexe et une mauvaise fin.
</p>
<p>
    Sauras-tu toutes les débloquer ?
</p>
`)
