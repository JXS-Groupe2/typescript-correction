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
    public direction: SnakeDirection = SnakeDirection.UP
  ) {}

  static newOfSize(size: number, origin: Coordinates2D, outbounds: Coordinates2D): Snake {
    let parts = new Array<SnakePart>()

    for(let i = 0; i < size; i++) {
      const coordinates = new Coordinates2D(origin.x, (origin.y + i) % outbounds.y)
      parts.push(new SnakePart(coordinates))
    }

    return new Snake(parts)
  }

  head(): SnakePart { return this.parts[0] }
  tail(): Array<SnakePart> { return this.parts.slice(1) }
  previous(part: SnakePart): SnakePart { return this.parts[this.parts.indexOf(part) - 1] }

  withDirection(direction: SnakeDirection): Snake {
    return new Snake(this.parts, direction)
  }

  move(outbounds: Coordinates2D): Snake {
    const parts = new Array<SnakePart>()
    const newHead = this.head().moveTo(this.computeNextHeadPosition(outbounds))
    parts.push(newHead)
    this.parts.slice(0, this.parts.length - 1).forEach((part) => parts.push(part))
    return new Snake(parts, this.direction)
  }

  grow(): void {
    this.parts.push(new SnakePart(new Coordinates2D(-1, -1)))
  }

  private computeHeadMovement(): Coordinates2D {
    const x = (this.direction === ARROW_RIGHT) ? 1 : (this.direction === ARROW_LEFT) ? -1 : 0
    const y = (this.direction === ARROW_UP) ? -1 : (this.direction === ARROW_DOWN) ? 1 : 0
    return new Coordinates2D(x, y)
  }

  private computeNextHeadPosition(outbounds: Coordinates2D): Coordinates2D {
    const headMovement = this.computeHeadMovement()

    const x = (this.head().coordinates.x + headMovement.x)
    const y = (this.head().coordinates.y + headMovement.y)

    return new Coordinates2D(
      x >= 0 ? x % outbounds.x : outbounds.x + x,
      y >= 0 ? y % outbounds.y : outbounds.y + y
    )
  }

  draw(canvasContext : CanvasRenderingContext2D, sideLength: number): void {
    this.parts.forEach((part) => part.draw(canvasContext, sideLength))
  }

}

export enum SnakeDirection { UP = 38, DOWN = 40, RIGHT = 39, LEFT = 37 }
