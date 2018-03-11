import { ARROW_RIGHT, ARROW_LEFT, ARROW_UP, ARROW_DOWN } from './Keys'
import { SnakePart } from './SnakePart'

export class Coordinates2D {
  constructor(public x: number, public y: number){}

  equals(coordinates: Coordinates2D): boolean {
    return this.x === coordinates.x && this.y === coordinates.y
  }
}

export class Snake {
  public static borderWidth = 1
  public static borderColor = '#A2A2A2'
  public static bodyColor = '#303030'

  constructor(
    public parts: Array<SnakePart>,
    private gridSize: number,
    private gridWidth: number,
    private gridHeight: number,
    public direction: SnakeDirection = SnakeDirection.UP
  ) {}

  static newOfSize(size: number, origin: Coordinates2D, gridSize: number, gridWidth: number, gridHeight: number): Snake {
    let parts = new Array<SnakePart>()

    for(let i = 0; i < size; i++) {
      const coordinates = new Coordinates2D(origin.x, (origin.y + i) % gridHeight)
      parts.push(new SnakePart(coordinates, gridSize, gridWidth, gridHeight))
    }

    return new Snake(parts, gridSize, gridWidth, gridHeight)
  }

  head(): SnakePart { return this.parts[0] }
  tail(): Array<SnakePart> { return this.parts.slice(1) }
  previous(part: SnakePart): SnakePart { return this.parts[this.parts.indexOf(part) - 1] }

  setDirection(direction: SnakeDirection): void {
    this.direction = direction
  }

  move(): Snake {
    const newHead = this.head().moveTo(this.computeNextHeadPosition())

    const parts = new Array<SnakePart>()
    parts.push(newHead)

    this.tail().forEach((part) => parts.push(part.moveTo(this.previous(part).coordinates)))
    return new Snake(parts, this.gridSize, this.gridWidth, this.gridHeight, this.direction)
  }

  grow(): void {
    this.parts.push(new SnakePart(new Coordinates2D(-1, -1), this.gridSize, this.gridWidth, this.gridHeight))
  }

  private computeHeadMovement(): Coordinates2D {
    const x = (this.direction === ARROW_RIGHT) ? 1 : (this.direction === ARROW_LEFT) ? -1 : 0
    const y = (this.direction === ARROW_UP) ? -1 : (this.direction === ARROW_DOWN) ? 1 : 0
    return new Coordinates2D(x, y)
  }

  private computeNextHeadPosition(): Coordinates2D {
    const headMovement = this.computeHeadMovement()

    const x = (this.head().coordinates.x + headMovement.x)
    const y = (this.head().coordinates.y + headMovement.y)

    return new Coordinates2D(
      x >= 0 ? x % this.gridWidth : this.gridWidth + x,
      y >= 0 ? y % this.gridHeight : this.gridHeight + y
    )
  }

  draw(canvasContext : CanvasRenderingContext2D): void {
    this.parts.forEach((part) => part.draw(canvasContext))
  }
}

export enum SnakeDirection { UP = 38, DOWN = 40, RIGHT = 39, LEFT = 37 }
