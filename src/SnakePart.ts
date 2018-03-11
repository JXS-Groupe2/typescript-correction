import { Coordinates2D, Snake } from './Snake'
import { DrawablePart } from './DrawablePart';

export class SnakePart extends DrawablePart {
  constructor(public coordinates: Coordinates2D, gridSize: number, private gridWidth: number, private gridHeight: number) {
    super(coordinates, gridSize, Snake.borderWidth, Snake.borderColor, Snake.bodyColor)
  }

  moveTo(nextPosition: Coordinates2D): SnakePart {
    return new SnakePart(nextPosition, this.gridSize, this.gridWidth, this.gridHeight)
  }
}