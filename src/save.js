import { get } from 'svelte/store'
import { levelsComplete, hiddenAchievement } from './stores'

function makeProgression (reset = false) {
  const progression = {
    levelsComplete: {},
    hiddenAchievement: {}
  }

  if (!reset) {
    progression['levelsComplete'] = get(levelsComplete)
    progression['hiddenAchievement'] = get(hiddenAchievement)
  }

  return JSON.stringify(progression)
}

export function saveProgression (reset = false) {
  const progression = makeProgression(reset)
  localStorage.setItem('progression', progression)
  console.log('Saved progression', progression)
}

export function loadProgression () {
  const progressionStr =
    localStorage.getItem('progression') || makeProgression()
  const progression = JSON.parse(progressionStr)

  if (progression['levelsComplete'])
    levelsComplete.set(progression['levelsComplete'])

  if (progression['hiddenAchievement'])
    hiddenAchievement.set(progression['hiddenAchievement'])
}
