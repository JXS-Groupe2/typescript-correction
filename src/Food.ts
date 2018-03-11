import { Coordinates2D } from "./Snake";
import { DrawablePart } from "./DrawablePart";

export class Food extends DrawablePart {
  constructor(public coordinates: Coordinates2D, gridSize: number) {
    super(coordinates, gridSize, 1, 'red', 'red')
  }
}