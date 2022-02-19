import levels from './data/levels_data'
import { levelsComplete } from './stores'
import { get } from 'svelte/store'

export class Level {
  constructor (gameFlow) {
    this.name = gameFlow.levelName
    this.flow = []
    this.advancement = 0
    this.complete = false
    this.levelData = undefined
    this.load()
  }

  load () {
    this.levelData = levels[this.name]
    this.flow = []

    this.levelData['dialogsBegin'].forEach(sentence => {
      this.flow.push(new Dialog({ type: 'dialog', content: sentence }))
    })

    // ajouet jeu dans le flow

    this.gameEndWithSolution(true)
  }

  gameEndWithSolution (easy = false, expert = false, fail = false) {
    if (easy)
      this.levelData['dialogsEasySolution'].forEach(sentence => {
        this.flow.push(new Dialog({ type: 'dialog', content: sentence }))
      })
    if (expert)
      this.levelData['dialogsExpertSolution'].forEach(sentence => {
        this.flow.push(new Dialog({ type: 'dialog', content: sentence }))
      })
    if (fail)
      this.levelData['dialogsFailSolution'].forEach(sentence => {
        this.flow.push(new Dialog({ type: 'dialog', content: sentence }))
      })
  }

  currentFlowType () {
    return this.flow[this.advancement].type
  }

  advance () {
    this.advancement += 1
  }

  isComplete () {
    if (this.flow.length - 1 < this.advancement) return true
  }

  end () {
    const newComplete = { ...get(levelsComplete) }
    newComplete[this.name] = true
    levelsComplete.set(newComplete)
  }
}

class Flow {
  constructor (levelStep) {
    this.type = levelStep['type']
  }
}

class Dialog extends Flow {
  constructor (levelStep) {
    super(levelStep)
    this.content = levelStep['content']
  }
}
