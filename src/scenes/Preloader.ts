//importiamo la classe GameData
import { GameData } from "../GameData";
import WebFontFile from '../scenes/webFontFile';

export default class Preloader extends Phaser.Scene {

  private _loading: Phaser.GameObjects.Text;
  private _progress: Phaser.GameObjects.Graphics;
  private _image: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "Preloader",
    });
  }

  preload() {
    this.cameras.main.setBackgroundColor(GameData.globals.bgColor);
    this._progress = this.add.graphics();
    this.loadAssets();
  }

  init() {
    this._image = this.add
      .image(
        GameData.preloader.imageX,
        GameData.preloader.imageY,
        GameData.preloader.image
      )
      .setAlpha(0).setScale(.4);

    this.tweens.add({
      targets: [this._image],
      alpha: 1,
      duration: 500,
    });

    this._loading = this.add
      .text(this.game.canvas.width / 2, GameData.preloader.loadingTextY, "")
      .setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1).setColor("#000000").setFontSize(40).setFontFamily(GameData.preloader.loadingTextFont);
  }

  loadAssets(): void {

    this.load.on("start", () => { });

    this.load.on("fileprogress", (file: any, value: any) => {

    });

    this.load.on("progress", (value: number) => {

      this._progress.clear();
      this._progress.fillStyle(GameData.preloader.loadingBarColor, 1);
      this._progress.fillRect(0, GameData.preloader.loadingBarY, GameData.globals.gameWidth * value, 70);
      this._loading.setText(GameData.preloader.loadingText + " " + Math.round(value * 100) + "%");
    });

    this.load.on("complete", () => {

      this._progress.clear();
      this._loading.setText(GameData.preloader.loadingTextComplete);

      this.input.once("pointerdown", () => {
        this.tweens.add({
          targets: [this._image, this._loading],
          alpha: 0,
          duration: 500,
          onComplete: () => {

            //fermiamo la scena corrente
            this.scene.stop("Preloader");
            //richiamiamo il metodo start della far partire la scena Intro
            this.scene.start("Intro");

          },
        });

      });

    });


    //Assets Load
    //--------------------------

    //WEB FONT

    if (GameData.fonts != null) {
      let _fonts: Array<string> = [];
      GameData.fonts.forEach((element: FontAsset) => {
        _fonts.push(element.key);
      });
      this.load.addFile(new WebFontFile(this.load, _fonts));
    }
  }
}