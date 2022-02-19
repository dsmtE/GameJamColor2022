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

    this.flow.push(new Dialog({ type: "dialog", content: this.levelData["dialogsBegin"] }));

    this.flow.push(new Game({ type: "game"}));

    // ajouet jeu dans le flow
    this.gameEndWithSolution(true);
  }

  gameEndWithSolution (easy = false, expert = false, fail = false) {
    if (easy)
      this.flow.push(new Dialog({ type: "dialog", content: this.levelData["dialogsEasySolution"] }));
    if (expert)
      this.flow.push(new Dialog({ type: "dialog", content: this.levelData["dialogsExpertSolution"] }));
    if (fail)
    this.flow.push(new Dialog({ type: "dialog", content: this.levelData["dialogsFailSolution"] }));
  }

  currentFlowType () {
    return this.flow[this.advancement].type
  }

  currentFlow() {
    return this.flow[this.advancement];
  }

  advance() {
    this.advancement += 1;
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
  constructor(params) {
    this.type = params["type"];
  }
}

class Dialog extends Flow {
  constructor(params) {
    super(params);
    this.content = params["content"];
  }
}

class Game extends Flow {
  constructor(params) {
    super(params);
  }
}
