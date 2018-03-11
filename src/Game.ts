import { Coordinates2D, Snake, SnakeDirection } from './Snake'
import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP } from './Keys'
import { Food } from './Food'

export class Game {

  canvasContext : CanvasRenderingContext2D
  gridWidth : number
  gridHeight : number

  snake: Snake
  food: Food
  isGameOver: boolean
  score: number

  constructor(public canvas : HTMLCanvasElement, public speed : number, public gridSize : number = 5) {
    this.gridWidth = canvas.width / gridSize
    this.gridHeight = canvas.height / gridSize
    this.canvasContext = canvas.getContext("2d")

    this.isGameOver = false
    this.score = 0

    this.draw()

    document.addEventListener('keydown', ((evt: KeyboardEvent) => {
      if ([ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP].indexOf(evt.keyCode) > -1)
        this.snake.setDirection(SnakeDirection[SnakeDirection[evt.keyCode]])
    }).bind(this))
  }

  /**
  * Start game
  */
  start(): void {
    this.snake = Snake.newOfSize(3, this.getGridMiddlePoint(), this.gridSize, this.gridWidth, this.gridHeight)
    this.relocate()
    this.draw()

    this.animate(); // Start animation
  }

  private animate(): void {
    let fps = this.speed;
    let now;
    let then = Date.now();
    let interval = 1000/fps;
    let delta;

    let animationLoop = (function () {
      if (!this.isGameOver) {
        requestAnimationFrame(animationLoop);
      } else {
        alert('Game over, refresh the page to restart')
      }

      now = Date.now();
      delta = now - then;

      if (delta > interval) {
        then = now - (delta % interval);
        this.update();
      }

    }).bind(this);

    animationLoop();
  }

  /**
  * Update status of game and view
  */
  private update(): void {
    const nextSnake = this.snake.move()
    this.isGameOver = this.computeIsGameOver(this.snake, nextSnake)

    if (!this.isGameOver) {
      this.snake = nextSnake
      if (this.snake.head().coordinates.equals(this.food.coordinates)) {
        this.snake.grow()
        this.score ++
        this.relocate()
      }
      this.draw()
    }
  }

  private computeIsGameOver(previous: Snake, next: Snake): boolean {
    return this.snakeTouchBorder(previous, next) || this.snakeEatHimself(next)
  }

  private snakeTouchBorder(previous: Snake, next: Snake): boolean {
    const previousSnakeHead = previous.head().coordinates
    const nextSnakeHead = next.head().coordinates

    if (
      (previousSnakeHead.x === (this.gridWidth - 1) && nextSnakeHead.x === 0)
      || (previousSnakeHead.x === 0 && nextSnakeHead.x === (this.gridWidth - 1))
      || (previousSnakeHead.y === (this.gridHeight - 1) && nextSnakeHead.y === 0)
      || (previousSnakeHead.y === 0 && nextSnakeHead.y === (this.gridHeight - 1))
    ) return true
    
    return false
  }

  private snakeEatHimself(next: Snake): boolean {
    const snakeHead = next.head().coordinates

    return next.tail()
      .map((part) => part.coordinates)
      .filter((coordinates) => coordinates.x === snakeHead.x && coordinates.y === snakeHead.y)
      .length > 0
  }

  private draw(): void {
    this.canvasContext.fillStyle = '#F0F0F0' // set canvas' background color
    this.canvasContext.beginPath
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)  // now fill the canvas

    document.getElementById('score').innerText = this.score.toString()

    if (this.snake !== undefined)
      this.snake.draw(this.canvasContext)
    if (this.food !== undefined)
      this.food.draw(this.canvasContext)
  }

  private relocate(): void {
    const nextFoodPosition = (() => {
      const x = Math.round(Math.random() * this.gridWidth) % this.gridWidth
      const y = Math.round(Math.random() * this.gridHeight) % this.gridHeight
      return new Coordinates2D(x, y)
    }).bind(this)

    let next
    do {
      next = nextFoodPosition()
    } while ((this.snake.parts.map((part) => part.coordinates).indexOf(next) > -1) || (this.food && this.food.coordinates === next))
    
    this.food = new Food(next, this.gridSize)
  }

  private getGridMiddlePoint(): Coordinates2D {
    const middleX = Math.floor(this.gridWidth / 2)
    const middleY = Math.floor(this.gridHeight / 2)
    return new Coordinates2D(middleX, middleY)
  }

}
