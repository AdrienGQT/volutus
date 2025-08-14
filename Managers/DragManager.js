import { Volutus } from "../Volutus";

export class DragManager {
  constructor() {
    this.volutus = new Volutus();

    this.init();
  }

  init = () => {
    this.createProxy();
    this.setDraggableForDesktop();
    this.setDraggableForMobile();
    this.setDragCursor();
  };

  createProxy = () => {
    this.proxy = document.createElement("div");
  };

  setDraggableForDesktop = () => {
    this.volutus.container.addEventListener("mousedown", () => {
      this.volutus.container.addEventListener(
        "mousemove",
        this.handleMouseMove
      );
    });

    this.volutus.container.addEventListener("mouseup", () => {
      this.volutus.container.removeEventListener(
        "mousemove",
        this.handleMouseMove
      );
    });
  };

  setDraggableForMobile = () => {
    this.volutus.container.addEventListener(
      "touchstart",
      this.handleTouchStart
    );
    this.volutus.container.addEventListener("touchmove", this.handleTouchMove, {
      passive: false,
    });
    this.volutus.container.addEventListener("touchend", this.handleTouchEnd);
  };

  handleMouseMove = (e) => {
    e.preventDefault;
    this.handleDrag(e.movementX, e.movementY);
  };

  handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (!touch) return;

    this.touchStartX = this.lastTouchX = touch.clientX;
    this.touchStartY = this.lastTouchY = touch.clientY;
  };

  handleTouchMove = (e) => {
    e.preventDefault();

    const touch = e.touches[0];
    if (!touch) return;

    const { clientX: currentTouchX, clientY: currentTouchY } = touch;
    const deltaX = this.lastTouchX - currentTouchX;
    const deltaY = this.lastTouchY - currentTouchY;
    this.lastTouchX = currentTouchX;
    this.lastTouchY = currentTouchY;

    this.handleDrag(-deltaX, -deltaY);
  };

  handleTouchEnd = () => {
    this.touchStartX = this.lastTouchX = 0;
    this.touchStartY = this.lastTouchY = 0;
  };

  handleDrag = (deltaX, deltaY) => {
    if (this.volutus.isColumn) {
      this.volutus.targetScrollY = Math.round(
        this.volutus.targetScrollY - deltaY * this.volutus.dragStrength
      );
    } else {
      this.volutus.targetScrollX = Math.round(
        this.volutus.targetScrollX - deltaX * this.volutus.dragStrength
      );
    }
  };

  setDragCursor = () => {
    this.volutus.container.style.cursor = "grab";
  };
}
