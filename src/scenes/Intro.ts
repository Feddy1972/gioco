import { GameData } from "../GameData";
import { GameObjects } from "phaser";

export default class Intro extends Phaser.Scene {
  private tastoa: Phaser.Input.Keyboard.Key;
  private tastol: Phaser.Input.Keyboard.Key;
  private tastod: Phaser.Input.Keyboard.Key;
  private _mySprite: Phaser.GameObjects.Sprite;
  private tastok: Phaser.Input.Keyboard.Key;
  private animando: boolean = false;
  private attaccando: boolean = false; // Flag per verificare se il personaggio sta attaccando
  private attaccoCompletato: boolean = true; // Flag per evitare attacchi ripetuti
  private ambiente: Phaser.Sound.BaseSound;

  constructor() {
    super({
      key: "Intro",
    });
  }

  preload() {
    // Caricamento dei file audio
    this.load.audio("ambiente", "assets/sounds/ambiente.ogg");
    this.load.audio("spada", "assets/sounds/spada.ogg"); // Usa load.audio invece di audioSprite

    // Caricamento delle immagini
    this.load.spritesheet("player", "assets/images/player.png", {
      frameWidth: 120,
      frameHeight: 80,
    });
    this.load.spritesheet("idle", "assets/images/idle.png", {
      frameWidth: 120,
      frameHeight: 80,
    });
    this.load.spritesheet("attacco", "assets/images/attacco.png", {
      frameWidth: 120,
      frameHeight: 80,
    });
    this.load.spritesheet("capriola", "assets/images/capriola.png", {
      frameWidth: 120,
      frameHeight: 80,
    });

    // Aggiungi un listener per il caricamento dei file
    this.load.on("filecomplete", (file: Phaser.Loader.File) => {
      console.log(`File caricato con successo: ${file.key}`);
    });

    // Aggiungi un listener per eventuali errori
    this.load.on("fileerror", (file: Phaser.Loader.File) => {
      console.error(`Errore nel caricamento del file: ${file.key}`);
    });
  }

  create() {
    // Creazione del personaggio
    this._mySprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "player");

    // Creazione delle animazioni
    let running: Phaser.Types.Animations.Animation = {
      key: "player-running",
      frames: this.anims.generateFrameNumbers("player", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
      frameRate: 10,
      yoyo: false,
      repeat: -1,
    };
    let idle: Phaser.Types.Animations.Animation = {
      key: "idle",
      frames: this.anims.generateFrameNumbers("idle", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
      frameRate: 10,
      yoyo: false,
      repeat: -1,
    };
    let attacco: Phaser.Types.Animations.Animation = {
      key: "attacco",
      frames: this.anims.generateFrameNumbers("attacco", { frames: [0, 1, 2, 3, 4, 5] }),
      frameRate: 8,
      yoyo: false,
      repeat: 0,
    };
    let capriola: Phaser.Types.Animations.Animation = {
      key: "capriola",
      frames: this.anims.generateFrameNumbers("capriola", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }),
      frameRate: 20,
      yoyo: false,
      repeat: 0,
    };


    this.anims.create(running);
    this.anims.create(idle);
    this.anims.create(attacco);
    this.anims.create(capriola);

    // Configura i tasti
    this.tastoa = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.tastod = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.tastok = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.tastol = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);


    // Impostazioni della fotocamera e sfondo
    this.cameras.main.setBackgroundColor("FFFFFF");
    this.cameras.main.startFollow(this._mySprite, false, 0.2, 0.2);

    // Scala il personaggio
    this._mySprite.setScale(1.5);

    // Riproduci la musica di sottofondo
    this.ambiente = this.sound.add("ambiente", { loop: true, volume: 0.3 });
    this.ambiente.play();

    // Riproduci l'effetto sonoro della spada
    this.sound.add("spada").play({ loop: false, volume: 0.0 });
  }

  update(time: number, delta: number): void {
    if (!this.tastoa.isDown && !this.tastod.isDown && !this.tastok.isDown) {
      if (!this.attaccando) {
        if (!this.animando) {
          this._mySprite.anims.play("idle");
        }
      }
      this.animando = false;
    }
    if (this.tastoa.isDown) {
      this._mySprite.x -= 2;
      if (!this.animando && !this.attaccando) {
        this._mySprite.anims.play("player-running");
        this.animando = true;
        this._mySprite.flipX = true;
      }
    }

    if (this.tastod.isDown) {
      this._mySprite.x += 2;
      if (!this.animando && !this.attaccando) {
        this._mySprite.anims.play("player-running");
        this.animando = true;
        this._mySprite.flipX = false;
      }
    }
    if(this.tastol.isDown){
      this._mySprite.anims.play("capriola");
      this.animando=true;
    }

    if (this.tastok.isDown && this.attaccoCompletato) {
      this.attaccoCompletato = false; // Impediamo che l'attacco venga ripetuto mentre è in corso
      this._mySprite.anims.play("attacco", true); // Gioca l'animazione di attacco
      this.attaccando = true; // Il personaggio sta attaccando
      this.sound.add("spada").play({ loop: false, volume: 0.5 });
    }

    // Quando l'animazione di attacco è terminata, riprendiamo il movimento
    if (this._mySprite.anims.getProgress() === 1 && this.attaccando) {
      this.attaccando = false;
      this.attaccoCompletato = true;
      if (this.tastoa.isDown || this.tastod.isDown) {
        this.animando = true;
        this._mySprite.anims.play("player-running", true); // Riprendi a correre se si preme A o D
      } else {
        this.animando = false;
        this._mySprite.anims.play("idle", true); // Torna all'animazione idle se non si preme nessun tasto
      }
    }
  }
}