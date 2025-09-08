import { Volutus } from "../Volutus";

export class SnapManager {
  constructor() {
    this.volutus = new Volutus();
  }

  snap = () => {
    this.computeSnap();
    this.applySnap();
  };

  computeSnap = () => {
    const blockSide = this.volutus.isColumn ? "height" : "width";
    const itemSize = this.volutus.itemsSizes[0][blockSide];
    const blockSize = itemSize + this.volutus.gap;

    this.currentIndex = this.volutus.currentIndex;

    this.currentItemPosition = this.currentIndex * blockSize - blockSize;

    this.currentScrollY = this.volutus.scrollY;
    this.currentScrollX = this.volutus.scrollX;

    this.deltaToCurrentItemPosition = this.volutus.isColumn
      ? this.currentScrollY - this.currentItemPosition
      : this.currentScrollX - this.currentItemPosition;

    this.currentSnap =
      this.deltaToCurrentItemPosition * this.volutus.snapStrength;
  };

  applySnap = () => {
    if (this.volutus.isColumn) {
      this.volutus.targetScrollY -= this.currentSnap;
    } else {
      this.volutus.targetScrollX -= this.currentSnap;
    }
  };
}
