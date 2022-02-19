import { writable } from 'svelte/store'
import { Home } from './scenes'

export const gameName = writable('<VariableNomDuJeu>')
export const flowScene = writable(new Home())
