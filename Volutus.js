import "./css/volutus.css";
import { ScrollManager } from "./Managers/ScrollManager";
import { DragManager } from "./Managers/DragManager";
import { SnapManager } from "./Managers/SnapManager";
import { ButtonsManager } from "./Managers/ButtonsManager";
import { positiveModulo } from "./Utils/positiveModulo";

let instance = null;

export class Volutus {
  constructor(parameters) {
    if (instance) {
      return instance;
    }

    instance = this;

    // Parameters
    this.direction = "column";

    this.container = null;
    this.items = null;

    this.previousButton = null;
    this.nextButton = null;

    this.supportScroll = true;
    this.supportDrag = true;
    this.supportButtons = true;

    this.gap = 12;

    this.scrollStrength = 0.2;
    this.dragStrength = 1.5;
    this.snapStrength = 0.02;

    this.lerpFactor = 0.05;

    // Set values
    this.setValues(parameters);

    this.isColumn = this.direction === "column";

    this.itemQuantity = this.items.length;

    this.itemsSizes = {};
    this.blockSizes = {};
    this.containerSizes = {};
    this.sliderSizes = {};

    this.targetScrollY = 0;
    this.targetScrollX = 0;
    this.scrollY = 0;
    this.scrollX = 0;

    this.animate = this.animate.bind(this);

    this.init();
  }

  setValues(values) {
    if (values === undefined) {
      console.warn("Volutus: no parameter were provided");
      return;
    }

    if (!values.direction || !values.items || !values.container) {
      console.warn("Volutus: one or multiple required parameters are missing");
      return;
    }

    if (values.direction !== "column" && values.direction !== "row") {
      console.warn("Volutus: direction hasn't been properly set");
      return;
    }

    for (const key in values) {
      const newValue = values[key];

      if (newValue === undefined) {
        console.warn(`Volutus: parameter '${key}' has value of undefined.`);
        continue;
      }

      const currentValue = this[key];

      if (currentValue === undefined) {
        console.warn(`Volutus: '${key}' is not a property of Volutus.`);
        continue;
      }

      this[key] = newValue;
    }
  }

  init = () => {
    this.applyRequiredStyles();
    this.instantiateManagers();
    this.getSizes();
    this.calculateBasePositions();
    this.updateItems();
    this.animate();
  };

  applyRequiredStyles = () => {
    this.applyContainerRequiredStyle();
    this.applyItemsRequiredStyle();
  };

  applyContainerRequiredStyle = () => {
    this.container.classList.add("volutusContainer");
  };

  applyItemsRequiredStyle = () => {
    this.items.forEach((item) => {
      item.classList.add("volutusItem");
    });
  };

  instantiateManagers = () => {
    if (this.supportScroll) this.scrollManager = new ScrollManager();
    if (this.supportDrag) this.dragManager = new DragManager();
    if (this.supportButtons) this.buttonsManager = new ButtonsManager();
    this.snapManager = new SnapManager();
  };

  getSizes = () => {
    this.itemsSizes = [];
    this.blockSizes = [];
    this.itemsOffset = [];
    this.sliderSizes = {
      width: 0,
      height: 0,
    };
    const { height, width } = this.container.getBoundingClientRect();
    this.containerSizes = { height, width };

    for (let i = 0; i < this.items.length; i++) {
      const { height, width } = this.items[i].getBoundingClientRect();
      this.itemsSizes.push({ width, height });

      const blockWidth = width + this.gap;
      const blockHeight = height + this.gap;
      this.blockSizes.push({ width: blockWidth, height: blockHeight });

      this.sliderSizes.width += blockWidth;
      this.sliderSizes.height += blockHeight;

      const offsetRow = (this.containerSizes.width - width) / 2;
      const offsetColumn = (this.containerSizes.height - height) / 2;
      this.itemsOffset.push({ row: offsetRow, column: offsetColumn });
    }
  };

  calculateBasePositions = () => {
    this.basePositions = [];
    const offsetDirection = this.isColumn ? "column" : "row";
    const blockSide = this.isColumn ? "height" : "width";

    let currentPosition = this.itemsOffset[1][offsetDirection];

    for (let i = 0; i < this.items.length; i++) {
      this.basePositions.push(currentPosition);

      currentPosition += this.blockSizes[i][blockSide];
    }
  };

  updateItems = () => {
    const config = this.isColumn
      ? {
          blockSide: "height",
          sliderSize: this.sliderSizes.height,
          transformPrefix: "translateY(",
        }
      : {
          blockSide: "width",
          sliderSize: this.sliderSizes.width,
          transformPrefix: "translateX(",
        };

    for (let i = 0; i < this.items.length; i++) {
      let adjustedPosition =
        -this.blockSizes[0][config.blockSide] +
        ((this.basePositions[i] -
          (this.isColumn ? this.scrollY : this.scrollX)) %
          config.sliderSize);
      if (adjustedPosition < -this.blockSizes[i][config.blockSide]) {
        adjustedPosition += config.sliderSize;
      }

      this.items[
        i
      ].style.transform = `${config.transformPrefix}${adjustedPosition}px`;
    }
  };

  animate = () => {
    this.scrollY += (this.targetScrollY - this.scrollY) * this.lerpFactor;
    this.scrollX += (this.targetScrollX - this.scrollX) * this.lerpFactor;
    this.updateItems();
    this.computeIndexes();
    this.snapManager.snap();
    this.refreshStyle();
    requestAnimationFrame(this.animate);
  };

  computeIndexes = () => {
    const itemSize = this.isColumn
      ? this.itemsSizes[0].height
      : this.itemsSizes[0].width;

    this.currentIndex = Math.round(((this.scrollY * this.isColumn) + (this.scrollX * !this.isColumn)) / (itemSize + this.gap)) + 1;

    this.currentItemIndex = positiveModulo(this.currentIndex, this.itemQuantity);
    this.previousItemIndex = positiveModulo(
      this.currentIndex - 1,
      this.itemQuantity
    );
    this.nextItemIndex = positiveModulo(this.currentIndex + 1, this.itemQuantity);
    this.currentItem = this.items[this.currentItemIndex]
  };

  refreshStyle = () => {
    this.removeSelectedStyle();
    this.applySelectedStyle();
  };

  applySelectedStyle = () => {
    this.items[this.currentItemIndex].classList.add("volutusItemSelected");
  };

  removeSelectedStyle = () => {
    this.items[this.previousItemIndex].classList.remove("volutusItemSelected");
    this.items[this.nextItemIndex].classList.remove("volutusItemSelected");
  };
}
