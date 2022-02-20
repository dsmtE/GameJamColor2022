import { get } from 'svelte/store'
import { saveProgression } from './save.js'
import { flowScene, level } from './stores.js'
import {getImageDataFromName} from "./core/getImageDataFromName";

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
  transitionToAbout() {
    document.body.style.backgroundImage = 'url(img/fond.png)';
    flowScene.set(new About())
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
    document.body.style.backgroundImage = 'url(img/fond.png)';
    flowScene.set(new Settings())
  }
  transitionToAchievements () {
    flowScene.set(new Achievements())
  }
  transitionToHome () {
    document.body.style.backgroundImage = 'url(img/fond.png)';
    return
  }
}

export class About extends FlowScene {
  constructor () {
    super('about')
  }
  transitionToLevelSelection () {
    return
  }
  transitionToSettings () {
    return
  }
  transitionToAchievements () {
    return
  }
  transitionToHome () {
    document.body.style.backgroundImage = 'url(img/fond.png)';
    flowScene.set(new Home())
  }
}

export class LevelSelection extends FlowScene {
  constructor () {
    super('levelSelection')
  }
  transitionToHome () {
    flowScene.set(new Home())
    document.body.style.backgroundImage = 'url(img/fond.png)';
  }
  transitionToLevelSelection () {
    return
  }
  transitionToGame (level) {
    let img = getImageDataFromName(level).src;
    console.log('Transition to level ' + level)
    document.body.style.backgroundImage = 'url(img/' + img + '.png)';
    flowScene.set(new GameFlow(level))
  }
}

export class Settings extends FlowScene {
  constructor () {
    super('settings')
  }
  transitionToHome () {
    document.body.style.backgroundImage = 'url(img/fond.png)';
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
    document.body.style.backgroundImage = 'url(img/fond.png)';
    flowScene.set(new Home())
  }
  transitionToAchievements () {
    return
  }
}

export class GameFlow extends FlowScene {
  constructor (levelName) {
    super('gameFlow')
    this.levelName = levelName
  }
  transitionToHome () {
    flowScene.set(new Home())
    document.body.style.backgroundImage = 'url(img/fond.png)';
    console.log('WE NEED TO SAVE HERE !!!')
  }
  transitionToGame () {
    return
  }
  transitionToLevelSelection (completed = false) {
    if (completed) {
      get(level).end()
      saveProgression()
    }
    flowScene.set(new LevelSelection())
  }
}

