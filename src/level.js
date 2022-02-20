import levels from './data/levels_data'
import { levelsComplete } from './stores'
import { get } from 'svelte/store'

import { getImageDataFromName } from './core/getImageDataFromName'

export class Level {
  constructor (gameFlow) {
    this.name = gameFlow.levelName
    this.flow = []
    this.advancement = 0
    this.complete = false
    this.levelData = undefined
    this.solutionFound = undefined
    this.load()
  }

  load () {
    this.levelData = levels[this.name]

    this.easySolution = this.levelData['easySolution'] || ''
    this.expertSolution = this.levelData['expertSolution'] || ''
    this.failSolution = this.levelData['failSolution'] || ''

    this.startingItems = this.levelData['startingItems'] || []
    this.recipes = this.levelData['recipes'] || []

    this.objective = this.levelData['objective'] || ''

    this.flow = []
    this.flow.push(
      new Dialog({ type: 'dialog', content: this.levelData['dialogsBegin'] })
    )
    this.flow.push(new Game({ type: 'game' }))
  }

  gameEndWithSolution (solution) {
    const possibleSolutions = {
      easy: 'dialogsEasySolution',
      expert: 'dialogsExpertSolution',
      fail: 'dialogsFail'
    }
    this.flow.push(
      new Dialog({
        type: 'dialog',
        content: this.levelData[possibleSolutions[solution]]
      })
    )
    this.solutionFound = solution
  }

  ImageToPrint (solution) {
    const possibleSolutions = {
      easy: 'easySolution',
      expert: 'expertSolution',
      fail: 'failSolution'
    }
    this.flow.push(
      new Image({
        type: 'image',
        src: getImageDataFromName(this.levelData[possibleSolutions[solution]])
          .src,
        name: this.levelData[possibleSolutions[solution]]
      })
    )
  }

  isSolutionItem (item) {
    if (item === this.easySolution) return 'easy'
    if (item === this.expertSolution) return 'expert'
    if (item === this.failSolution) return 'fail'
    return false
  }

  currentFlowType () {
    return this.flow[this.advancement].type
  }

  currentFlow () {
    return this.flow[this.advancement]
  }

  advance () {
    this.advancement += 1
  }

  isComplete () {
    if (this.flow.length - 1 < this.advancement) return true
  }

  end () {
    const newComplete = { ...get(levelsComplete) }
    if (!newComplete[this.name] || newComplete[this.name] === true) {
      newComplete[this.name] = {}
    }
    newComplete[this.name][this.solutionFound] = true
    levelsComplete.set(newComplete)
  }
}

class Flow {
  constructor (params) {
    this.type = params['type']
  }
}

class Dialog extends Flow {
  constructor (params) {
    super(params)
    this.content = params['content']
  }
}

class Game extends Flow {
  constructor (params) {
    super(params)
  }
}

class Image extends Flow {
  constructor (params) {
    super(params)
    this.src = params.src
    this.name = params.name
  }
}
