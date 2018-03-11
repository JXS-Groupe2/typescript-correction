import { Coordinates2D } from "./Snake";

export abstract class DrawablePart {
  constructor(
    public coordinates: Coordinates2D,
    protected gridSize: number,
    private borderWidth: number,
    private borderColor : string,
    private bodyColor : string
  ) {}

  draw(canvasContext : CanvasRenderingContext2D) {
    const coordinatesToDrawTo = new Coordinates2D(
      this.coordinates.x * this.gridSize,
      this.coordinates.y * this.gridSize
    )

    canvasContext.lineWidth = this.borderWidth
    canvasContext.strokeStyle = this.borderColor
    canvasContext.fillStyle = this.bodyColor

    // Draw the part as a rectangle
    canvasContext.beginPath()
    canvasContext.fillRect(coordinatesToDrawTo.x, coordinatesToDrawTo.y, this.gridSize, this.gridSize)
    canvasContext.beginPath()
    canvasContext.rect(coordinatesToDrawTo.x, coordinatesToDrawTo.y, this.gridSize, this.gridSize)
    canvasContext.stroke()
  }
}