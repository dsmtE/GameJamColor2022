import { flowScene } from './stores.js'

export class Home {
  constructor () {
    this.name = 'home'
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

export class LevelSelection {
  constructor () {
    this.name = 'levelSelection'
  }
  transitionToHome () {
    flowScene.set(new Home())
  }
}

export class Settings {
  constructor () {
    this.name = 'settings'
  }
  transitionToHome () {
    flowScene.set(new Home())
  }
}

export class Achievements {
  constructor () {
    this.name = 'achievements'
  }
  transitionToHome () {
    flowScene.set(new Home())
  }
}
