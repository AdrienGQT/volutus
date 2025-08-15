# Volutus

## Introduction

Volutus is a loghtweight JavaScript library designed to create smooth, infinite sliders with minimal setup. it provides seamless scrolling experiences and supports many gestures : mouse wheel navigation, touch/drag interactions and button controls.

<br>

## Content

- [Installation](#installation)
- [Setup](#setup)
- [Settings](#settings)
- [Properties](#properties)
- [Default CSS](#default-css)

<br>

## Installation

Using a package manager:

```bash
npm i volutus
```
```js
import Volutus from 'volutus'
```

<br>

## Setup

### Basic

```js
const volutus = new Volutus({
  direction : 'column',
  container: container,
  items: items
})
```

### Custom

```js
  const volutus = new Volutus({
    // Direction
    direction: "row",
    // HTML Elements
    container : container,
    items : items,
    previousButton : buttonPrev,
    nextButton : buttonNext,
    // Features
    supportScroll: true,
    supportDrag: true,
    supportButtons : true,
    // Tweaks
    gap: 12,
    scrollStrength: 0.4,
    dragStrength: 1.3,
    snapStrength: 0.02,
    lerpFactor: 0.09
  });
```

<br>

## Settings

| Option                 | Type                       | Default                                            | Description                                                                                               |
|------------------------|----------------------------|----------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `direction`            | `string`                   | `undefined`                                        | The direction of the scroll. Either 'column' or 'row'.                                                    |
| `container`            | `HTMLElement`              | `undefined`                                        | The element that will be used as the scroll container.                                                    |
| `items`                | `NodeList`                 | `undefined`                                        | A list that contains the elements that will be scrolled, usually `container`'s children.                  |
| `previousButton`       | `HTMLElement`              | `undefined`                                        | The element that will be used as the previous item navigation button.                                     |
| `nextButton`           | `HTMLElement`              | `undefined`                                        | The element that will be used as the next item navigation button.                                         |
| `gap`                  | `number`                   | `12`                                               | The space between the items.                                                                              |
| `scrollStrength`       | `number`                   | `0.2`                                              | A value that sets the strength of the mouse wheel on the slider. (Min: 0.01, Max: 1.0, Step: 0.01)        |
| `dragStrength`         | `number`                   | `1.5`                                              | A value that sets the strength of the touch/drag on the slider. (Min: 0.1, Max: 1.5, Step: 0.1)           |
| `snapStrength`         | `number`                   | `0.02`                                             | A value that sets the strength of the snap effect on the slider. (Min: 0.001, Max: 0.15, Step: 0.002)     |
| `lerpFactor`           | `number`                   | `0.05`                                             | A value that determines the interpolation weight in the scroll lerp. (Min: 0.01, Max: 0.3, Step: 0.01)    |
| `supportScroll`        | `boolean`                  | `true`                                             | Wether or not to support mouse wheel navigation.                                                          |
| `supportDrag`          | `boolean`                  | `true`                                             | Wether or not to support touch/drag interactions.                                                         |
| `supportButtons`       | `boolean`                  | `true`                                             | Wether or not to support button controls.                                                                 |

<br>

## Properties

| Property                  | Type            | Description                                                                                               |
|---------------------------|-----------------|-----------------------------------------------------------------------------------------------------------|
| `currentItemIndex`        | `number`        | Index of the current item.                                                                                |
| `currentItem`             | `HTMLElement`   | The HTML of the current item.                                                                             |
| `itemSizes`               | `object`        | An object that contains sizes properties of the items.                                                    |
| `blockSizes`              | `object`        | An object that contains sizes properties of a block (a block is the sum of an item and the gap).          |
| `containerSizes`          | `object`        | An object that contains sizes properties of a the container.                                              |
| `sliderSizes`             | `object`        | An object that contains sizes properties of the theoritical slider (the sum of all the elements and gaps).|
| `targetScrollY`           | `number`        | The scroll level on Y axis the slider is aiming to. Based on the user inputs.                             |
| `scrollY`                 | `number`        | The current scroll level on Y axis.                                                                       |
| `isColumn`                | `boolean`       | Direction indicator. Returns `true` if the direction is set `column`.                                     |

<br>

## Default CSS

Volutus applies three basic CSS classes on the slider elements: 

- `.volutusContainer` on the container.
- `.volutusItem` on each items.
- `.volutusItemSelected` on the currently selected item.