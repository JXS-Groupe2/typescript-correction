import { Coordinates2D } from "./Snake";

export abstract class DrawableRectangle {
  constructor(
    public coordinates: Coordinates2D,
    private borderWidth: number,
    private borderColor : string,
    private bodyColor : string
  ) {}

  draw(canvasContext : CanvasRenderingContext2D, sideLength: number,) {
    const coordinatesToDrawTo = new Coordinates2D(
      this.coordinates.x * sideLength,
      this.coordinates.y * sideLength
    )

    canvasContext.lineWidth = this.borderWidth
    canvasContext.strokeStyle = this.borderColor
    canvasContext.fillStyle = this.bodyColor

    // Draw the part as a rectangle
    canvasContext.beginPath()
    canvasContext.fillRect(coordinatesToDrawTo.x, coordinatesToDrawTo.y, sideLength, sideLength)
    canvasContext.beginPath()
    canvasContext.rect(coordinatesToDrawTo.x, coordinatesToDrawTo.y, sideLength, sideLength)
    canvasContext.stroke()
  }
}