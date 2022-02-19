import { flowScene } from './stores.js'

class FlowScene {
  constructor (name) {
    this.name = name
  }
  transitionToLevelSelection () {
    throw Error('Not implemented')
  }
  transitionToSettings () {
    throw Error('Not implemented')
  }
  transitionToAchievements () {
    throw Error('Not implemented')
  }
  transitionToHome () {
    throw Error('Not implemented')
  }
  transitionToGame () {
    throw Error('Not implemented')
  }
}
export class Home extends FlowScene {
  constructor () {
    super('home')
  }
  transitionToLevelSelection () {
    flowScene.set(new LevelSelection())
  }
  transitionToSettings () {
    flowScene.set(new Settings())
  }
  transitionToAchievements () {
    flowScene.set(new Achievements())
  }
  transitionToHome () {
    return
  }
}

export class LevelSelection extends FlowScene {
  constructor () {
    super('levelSelection')
  }
  transitionToHome () {
    flowScene.set(new Home())
  }
  transitionToLevelSelection () {
    return
  }
  transitionToGame (level) {
    console.log('Transition to level ' + level)
    flowScene.set(new GameFlow(level))
  }
}

export class Settings extends FlowScene {
  constructor () {
    super('settings')
  }
  transitionToHome () {
    flowScene.set(new Home())
  }
  transitionToSettings () {
    return
  }
}

export class Achievements extends FlowScene {
  constructor () {
    super('achievements')
  }
  transitionToHome () {
    flowScene.set(new Home())
  }
  transitionToAchievements () {
    return
  }
}

export class GameFlow extends FlowScene {
  constructor (level) {
    super('gameFlow')
    this.level = level
  }
  transitionToHome () {
    flowScene.set(new Home())
    console.log('WE NEED TO SAVE HERE !!!')
  }
  transitionToGame () {
    return
  }
  transitionToLevelSelection (completed = false) {
    flowScene.set(new LevelSelection())
    console.log('WE NEED TO COMPLETE THE LEVEL HERE !!!')
  }
}

export class Intro extends FlowScene {
  constructor() {
    super("intro")
  }

  transitionToHome() {
    flowScene.set(new Home())
  }
}

