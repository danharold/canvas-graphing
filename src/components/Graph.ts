import { canvas, ctx } from '../utils/CanvasContextManager';
import { CanvasTransformManager } from '../utils/CanvasTransformManager';
import { Position, worldToPos } from '../utils/graphicsUtils';
import Square from './Square';

export default class Graph {
	transform: CanvasTransformManager;
	squares: Square[] = [];

	constructor() {
		canvas.style.backgroundColor = 'white';
		this.transform = new CanvasTransformManager();
		window.addEventListener('keydown', (e) => this.spawnSquare(e));
		this.update();
	}

	// spawn square on mouse when pressing E
	spawnSquare(e: KeyboardEvent) {
		if (e.key === 'e' || e.key === 'E') {
			let randomWidth = Math.random() * 100;
			let randomHeight = Math.random() * 100;
			let colour = 'black';
			let sq = new Square(
				this.transform.currentMousePos,
				randomWidth,
				randomHeight,
				colour
			);
			this.squares.push(sq);
			console.log(sq.pos.world);
		}
	}

	draw(): void {
		for (let i = 0; i < this.squares.length; i++) {
			this.squares[i].draw(this.transform.vt);
		}
		ctx.fillStyle = 'black';
		ctx.font = '50px roman';
		let test = {
			'(+x,+y)': worldToPos({ x: 250, y: 250 }, this.transform.vt),
			'(-x,+y)': worldToPos({ x: -250, y: 250 }, this.transform.vt),
			'(+x,-y)': worldToPos({ x: 250, y: -250 }, this.transform.vt),
			'(-x,-y)': worldToPos({ x: -250, y: -250 }, this.transform.vt)
		};
		for (const [key, value] of Object.entries(test)) {
			ctx.fillText(key, value.screen.x, value.screen.y);
		}
	}

	update() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.draw();
		requestAnimationFrame(() => this.update());
	}
}
