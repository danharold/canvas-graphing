import { canvas, ctx } from '../utils/CanvasContextManager';
import { CanvasTransformManager } from '../utils/CanvasTransformManager';
import { Position, Vector2D, worldToPos } from '../utils/graphicsUtils';
import { plotLine } from '../utils/drawingUtils';
import Square from './Square';
import { updateDebugInfo } from '../utils/ui';

export default class Graph {
	transform: CanvasTransformManager;
	squares: Square[] = [];

	constructor() {
		canvas.style.backgroundColor = 'black';

		// init transform manager
		// set initial scale and offset for unit grid lines
		this.transform = new CanvasTransformManager(5, 150);
		this.transform.vt.scale = 50;
		this.transform.vt.offset = {
			x: canvas.width / 2 / this.transform.vt.scale,
			y: canvas.height / 2 / this.transform.vt.scale
		};

		window.addEventListener('keydown', (e) => this.spawnSquare(e));

		this.update();
	}

	// spawn square on mouse when pressing E
	spawnSquare(e: KeyboardEvent) {
		if (e.key === 'e' || e.key === 'E') {
			let randomWidth = Math.random();
			let randomHeight = Math.random();
			let colour = 'white';
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

	drawAxes() {
		const origin = worldToPos({ x: 0, y: 0 }, this.transform.vt);
		ctx.save();
		ctx.beginPath();

		ctx.moveTo(0, origin.screen.y);
		ctx.lineTo(canvas.width, origin.screen.y);
		ctx.moveTo(origin.screen.x, 0);
		ctx.lineTo(origin.screen.x, canvas.height);

		ctx.strokeStyle = 'white';
		ctx.stroke();
	}

	drawGrid() {
		let worldSpacing = 1;
		const count: Vector2D = {
			x: canvas.width / (worldSpacing * this.transform.vt.scale),
			y: canvas.height / (worldSpacing * this.transform.vt.scale)
		};
		const first: Vector2D = {
			x: Math.floor(-this.transform.vt.offset.x / worldSpacing) * worldSpacing,
			y: Math.floor(-this.transform.vt.offset.y / worldSpacing) * worldSpacing
		};

		ctx.save();
		ctx.beginPath();
		for (let i = 0; i <= count.x; i++) {
			const x = first.x + i * worldSpacing;
			const screenX = worldToPos({ x: x, y: 0 }, this.transform.vt).screen.x;
			ctx.moveTo(screenX, 0);
			ctx.lineTo(screenX, canvas.height);
		}
		for (let j = 0; j <= count.y; j++) {
			const y = first.y + j * worldSpacing;
			const screenY = worldToPos({ x: 0, y: y }, this.transform.vt).screen.y;
			ctx.moveTo(0, screenY);
			ctx.lineTo(canvas.width, screenY);
		}
		ctx.strokeStyle = '#1f1f1f';
		ctx.stroke();
		ctx.restore();
	}

	draw(): void {
		this.drawGrid();
		for (let i = 0; i < this.squares.length; i++) {
			this.squares[i].draw(this.transform.vt);
		}

		plotLine(
			{ x: -100, y: -100 },
			{ x: 100, y: 100 },
			2,
			'red',
			this.transform.vt
		);

		this.drawAxes();
	}

	update() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		updateDebugInfo(this.transform);
		this.draw();
		requestAnimationFrame(() => this.update());
	}
}
