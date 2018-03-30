import { Coordinates2D, Snake, SnakeDirection } from './Snake'
import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP } from './Keys'
import { Food } from './Food'
import { Difficulty, GameRules } from './GameRules'

export class Game {

  canvasContext : CanvasRenderingContext2D
  gridOutbounds : Coordinates2D
  gameRules: GameRules

  snake: Snake
  food: Food
  isGameOver: boolean
  score: number

  constructor(
    public canvas : HTMLCanvasElement,
    public speed : number,
    public gridSize : number = 5,
    public difficulty: Difficulty = Difficulty.MEDIUM
  ) {
    this.gridOutbounds = new Coordinates2D(canvas.width / gridSize, canvas.height / gridSize)
    this.canvasContext = canvas.getContext("2d")
    this.gameRules = new GameRules(difficulty)

    this.isGameOver = false
    this.score = 0

    this.draw()

    document.addEventListener('keydown', ((evt: KeyboardEvent) => {
      if ([ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP].indexOf(evt.keyCode) > -1)
        this.snake = this.snake.withDirection(SnakeDirection[SnakeDirection[evt.keyCode]])
    }).bind(this))
  }

  /**
  * Start game
  */
  start(): void {
    this.snake = Snake.newOfSize(3, this.getGridMiddlePoint(), this.gridOutbounds)

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
      if (!this.isGameOver) requestAnimationFrame(animationLoop);
      else alert('Game over, refresh the page to restart')

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
    const nextSnake = this.snake.move(this.gridOutbounds)
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
    return this.gameRules.isGameOver(previous, next, this.gridOutbounds)
  }

  private draw(): void {
    this.canvasContext.fillStyle = '#F0F0F0' // set canvas' background color
    this.canvasContext.beginPath
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)  // now fill the canvas

    document.getElementById('score').innerText = this.score.toString()

    if (this.snake !== undefined) this.snake.draw(this.canvasContext, this.gridSize)
    if (this.food !== undefined) this.food.draw(this.canvasContext, this.gridSize)
  }

  private relocate(): void {
    const nextFoodPosition = (() => {
      const x = Math.round(Math.random() * this.gridOutbounds.x) % this.gridOutbounds.x
      const y = Math.round(Math.random() * this.gridOutbounds.y) % this.gridOutbounds.y
      return new Coordinates2D(x, y)
    }).bind(this)

    let next
    do {
      next = nextFoodPosition()
    } while ((this.snake.parts.map((part) => part.coordinates).indexOf(next) > -1) || (this.food && this.food.coordinates === next))
    
    this.food = new Food(next)
  }

  private getGridMiddlePoint(): Coordinates2D {
    const middleX = Math.floor(this.gridOutbounds.x / 2)
    const middleY = Math.floor(this.gridOutbounds.y / 2)
    return new Coordinates2D(middleX, middleY)
  }

}
