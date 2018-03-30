import { Snake, Coordinates2D } from './Snake'

export enum Difficulty { EASY, MEDIUM, HARD }

export class GameRules {

  constructor(public difficulty: Difficulty) {}

  public isGameOver(previous: Snake, next: Snake, gridOutbounds: Coordinates2D): boolean {
    switch (this.difficulty) {
      case Difficulty.MEDIUM:
        return this.snakeEatHimself(next) && this.snakeTouchBorder(previous, next, gridOutbounds)
      default:
        console.error('Not supported level')
        break;
    }
  }
  
  private snakeEatHimself(next: Snake): boolean {
    const snakeHead = next.head().coordinates

    return next.tail()
      .map((part) => part.coordinates)
      .filter((coordinates) => coordinates.x === snakeHead.x && coordinates.y === snakeHead.y)
      .length > 0
  }

  private snakeTouchBorder(previous: Snake, next: Snake, gridOutbounds: Coordinates2D): boolean {
    const previousSnakeHead = previous.head().coordinates
    const nextSnakeHead = next.head().coordinates

    if (
      (previousSnakeHead.x === (gridOutbounds.x - 1) && nextSnakeHead.x === 0)
      || (previousSnakeHead.x === 0 && nextSnakeHead.x === (gridOutbounds.x - 1))
      || (previousSnakeHead.y === (gridOutbounds.y - 1) && nextSnakeHead.y === 0)
      || (previousSnakeHead.y === 0 && nextSnakeHead.y === (gridOutbounds.y - 1))
    ) return true
    
    return false
  }

}