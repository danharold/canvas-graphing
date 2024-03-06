import { canvas, ctx } from '../utils/CanvasContextManager';
import { CanvasTransformManager } from '../utils/CanvasTransformManager';
import { Vector2D, worldToPos, distance } from '../utils/graphicsUtils';
import Square from './Square';
import { updateDebugInfo } from '../utils/ui';
import { Drawable } from './models/Drawable';
import { Line } from './models';

export default class Graph {
	transform: CanvasTransformManager;
	squares: Square[] = [];
	drawables: Drawable[] = [];

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
		window.addEventListener('mousemove', (e) => this.hoverPoint(e));

		this.update();
	}

	// spawn square on mouse when pressing E
	private spawnSquare(e: KeyboardEvent) {
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

	// calculate the closest line segment of any drawable object to the mouse
	// and place a point at the shortest distance
	private hoverPoint(e: MouseEvent) {
		// for lines and linear functions
		// we can check against its entirety
		const threshold = 5;

		let closestLine = null;
		let shortestDistance = Infinity;

		for (const drawable of this.drawables) {
			if (drawable instanceof Line) {
				//todo
			}
		}
	}

	private drawAxes() {
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

	private drawGrid() {
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

	// alternative to g.drawables.push()
	public add(model: Drawable) {
		this.drawables.push(model);
	}

	private draw(): void {
		this.drawGrid();

		for (let i = 0; i < this.squares.length; i++) {
			this.squares[i].draw(this.transform.vt);
		}

		for (const i in this.drawables) {
			this.drawables[i].draw(this.transform.vt);
		}

		this.drawAxes();
	}

	private update() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		updateDebugInfo(this.transform);
		this.draw();
		requestAnimationFrame(() => this.update());
	}
}
