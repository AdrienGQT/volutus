import { Volutus } from "../Volutus";

export class ScrollManager {
  constructor() {
    this.volutus = new Volutus();

    this.init();
  }

  init = () => {
    this.setEventListener();
  };

  setEventListener = () => {
    window.addEventListener("wheel", (e) => {
      if (this.volutus.isColumn) {
        this.volutus.targetScrollY = Math.round(
          this.volutus.targetScrollY -
            e.wheelDeltaY * this.volutus.scrollStrength
        );
      } else {
        this.volutus.targetScrollX = Math.round(
          this.volutus.targetScrollX -
            (e.wheelDeltaX + e.wheelDeltaY) * this.volutus.scrollStrength
        );
      }
    });
  };
}
