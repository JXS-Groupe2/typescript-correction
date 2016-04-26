import {Game} from "./Game"

const canvas = <HTMLCanvasElement> document.getElementById("snakeGame");
const speed = 10;
const game = new Game(canvas, speed);
game.start();