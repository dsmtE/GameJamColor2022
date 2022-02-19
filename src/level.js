import levels from './data/levels'
import { levelsComplete } from './stores'

export class Level {
  constructor (gameFlow) {
    this.name = gameFlow.levelName
    this.flow = []
    this.advancement = 0
    this.complete = false
    this.load()
  }

  load () {
    const levelData = levels[this.name]
    this.flow = []
    levelData.forEach(levelStep => {
      if (levelStep['type'] === 'dialog') {
        this.flow.push(new Dialog(levelStep))
      }
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
    const newComplete = { ...levelsComplete }
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
