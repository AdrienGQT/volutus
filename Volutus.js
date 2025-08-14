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
    this.direction = null;

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

    this.itemSizes = {};
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
    this.calculateCenterOffset();
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
    const { height, width } = this.items[0].getBoundingClientRect();
    this.itemSizes = {
      height,
      width,
    };
    this.blockSizes = {
      height: height + this.gap,
      width: width + this.gap,
    };
    this.sliderSizes = {
      height: (height + this.gap) * this.itemQuantity,
      width: (width + this.gap) * this.itemQuantity,
    };
  };

  calculateCenterOffset = () => {
    const { height, width } = this.container.getBoundingClientRect();
    this.containerSizes = { height, width };
    this.centerOffset = {
      column: (height - this.itemSizes.height) / 2,
      row: (width - this.itemSizes.width) / 2,
    };
  };

  updateItems = () => {
    const config = this.isColumn
      ? {
          itemSize: this.itemSizes.height,
          blockSize: this.blockSizes.height,
          sliderSize: this.sliderSizes.height,
          centerOffset: this.centerOffset.column,
          transformPrefix: "translateY(",
        }
      : {
          itemSize: this.itemSizes.width,
          blockSize: this.blockSizes.width,
          sliderSize: this.sliderSizes.width,
          centerOffset: this.centerOffset.row,
          transformPrefix: "translateX(",
        };

    for (let i = 0; i < this.items.length; i++) {
      const basePosition = i * config.blockSize + config.centerOffset;
      let adjustedPosition =
        -config.blockSize + (((basePosition - this.scrollY) * this.isColumn + (basePosition - this.scrollX) * !this.isColumn) % config.sliderSize);
      if (adjustedPosition < -config.blockSize) {
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
      ? this.itemSizes.height
      : this.itemSizes.width;

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
