import { Volutus } from "../Volutus";

export class ButtonsManager {
  constructor() {
    this.volutus = new Volutus();

    this.init();
  }

  init = () => {
    this.setButtons();
  };

  setButtons = () => {
    if (this.volutus.previousButton)
      this.volutus.previousButton.addEventListener("click", () => {
        this.previousItem();
      });
    if (this.volutus.nextButton)
      this.volutus.nextButton.addEventListener("click", () => {
        this.nextItem();
      });
  };

  previousItem = () => {
    if (this.volutus.isColumn) {
      this.volutus.targetScrollY -= this.volutus.blockSizes.height;
    } else {
      this.volutus.targetScrollX -= this.volutus.blockSizes.width;
    }
  };

  nextItem = () => {
    if (this.volutus.isColumn) {
      this.volutus.targetScrollY += this.volutus.blockSizes.height;
    } else {
      this.volutus.targetScrollX += this.volutus.blockSizes.width;
    }
  };
}
