import { Coordinates2D, Snake } from './Snake'
import { DrawableRectangle } from './DrawablePart';

export class SnakePart extends DrawableRectangle {
  constructor(public coordinates: Coordinates2D) {
    super(coordinates, Snake.borderWidth, Snake.borderColor, Snake.bodyColor)
  }

  moveTo(nextPosition: Coordinates2D): SnakePart {
    return new SnakePart(nextPosition)
  }
}