import Phaser from 'phaser';

interface Audio {
  name: string;
  jsonpath: string;
  paths: string[];
  instances: number;
}

interface GameData {
  globals: {
    gameWidth: number;
    gameHeight: number;
    bgColor: string;
    debug: boolean;
  };
  preloader: {
    bgColor: string;
    image: string;
    imageX: number;
    imageY: number;
    loadingText: string;
    loadingTextFont: string;
    loadingTextComplete: string;
    loadingTextY: number;
    loadingBarColor: number;
    loadingBarY: number;
  };
  spritesheets: Array<{ name: string; path: string; width: number; height: number; frames: number }>;
  images: Array<{ name: string; path: string }>;
  atlas: any[];
  sounds: Array<{ name: string; paths: string[] }>;
  videos: any[];
  audios: Audio[];
  scripts: any[];
  fonts: Array<{ key: string }>;
  bitmapfonts: any[];
}

// Dati di gioco
export let GameData: GameData = {
  globals: {
    gameWidth: 1731,
    gameHeight: 800,
    bgColor: "#ffffff",
    debug: false
  },
  preloader: {
    bgColor: "937364",
    image: "phaser",
    imageX: 1731 / 2,
    imageY: 800 / 2,
    loadingText: "Caricamento...",
    loadingTextFont: "roboto",
    loadingTextComplete: "Tappa/clicca per iniziare e aspetta 15 secondi (il tempo potrebbe variare)!!",
    loadingTextY: 700,
    loadingBarColor: 0xff0000,
    loadingBarY: 630
  },
  spritesheets: [
    { name: "player", path: "assets/images/player.png", width: 120, height: 80, frames: 10 },
    { name: "idle", path: "assets/images/idle.png", width: 120, height: 80, frames: 10 },
    { name: "attacco", path: "assets/images/attacco.png", width: 120, height: 80, frames: 4 },
    { name: "capriola", path: "assets/images/capriola.png", width: 120, height: 80, frames: 12 },
  ],
  images: [
    { name: "phaser", path: "assets/images/phaser.png" },
    { name: "freedoom", path: "assets/images/freedoom.png" },
    { name: "intro-bg", path: "assets/images/intro-bg.jpg" },
    { name: "bg-1", path: "assets/images/bg/1.png" },
    { name: "bg-2", path: "assets/images/bg/2.png" },
    { name: "bg-3", path: "assets/images/bg/3.png" },
    { name: "bg-4", path: "assets/images/bg/4.png" },
    { name: "bg-5", path: "assets/images/bg/5.png" },
    { name: "bg-6", path: "assets/images/bg/6.png" },
    { name: "bg-7", path: "assets/images/bg/7.png" }
  ],
  atlas: [],
  sounds: [
    { name: "ambiente", paths: ["assets/sounds/ambiente.mp3"] }
  ],
  videos: [],
  audios: [
    {
      name: "spada",
      jsonpath: "assets/sounds/spada.json",
      paths: ["assets/sounds/spada.ogg"],
      instances: 10
    }
  ],
  scripts: [],
  fonts: [{ key: "Nosifer" }, { key: "Roboto" }, { key: "Press+Start+2P" }, { key: "Rubik+Doodle+Shadow" }, { key: "Rubik+Glitch" }],
  bitmapfonts: []
};

// Scena di pre-caricamento
class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloaderScene" });
  }

  preload(): void {
    // Carica l'immagine di pre-caricamento
    this.load.image(GameData.preloader.image, "assets/images/${GameData.preloader.image}.png");

    // Carica altre immagini
    GameData.images.forEach(image => {
      this.load.image(image.name, image.path);
    });

    // Carica i suoni
    GameData.sounds.forEach(sound => {
      this.load.audio(sound.name, sound.paths);
    });

    // Carica gli audio (se presenti)
    GameData.audios.forEach(audio => {
      this.load.audio(audio.name, audio.paths);
    });

    // (Opzionale) Carica i font o altre risorse, se necessario
  }

  create(): void {
    // Mostra un messaggio di caricamento completato

    // Passa alla scena successiva (ad esempio, la scena principale)
    this.scene.start("MainScene");
  }
}

// Scena principale (dopo il caricamento)
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  create(): void {
    // Usa le immagini caricate per iniziare a creare il gioco
    this.add.image(GameData.globals.gameWidth / 2, GameData.globals.gameHeight / 2, "phaser");
  }
}

// Configurazione del gioco
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GameData.globals.gameWidth,
  height: GameData.globals.gameHeight,
  scene: [PreloaderScene, MainScene]
};

// Avvio del gioco
const game = new Phaser.Game(config);
