import { Coordinates2D } from "./Snake";
import { DrawableRectangle } from "./DrawablePart";

export class Food extends DrawableRectangle {
  constructor(public coordinates: Coordinates2D) {
    super(coordinates, 1, 'red', 'red')
  }
}