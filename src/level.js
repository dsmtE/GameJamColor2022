import levels from './data/levels'

export class Level {
  constructor (gameFlow) {
    this.name = gameFlow.level
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
