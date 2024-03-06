import { canvas, ctx } from '../utils/CanvasContextManager';
import { CanvasTransformManager } from '../utils/CanvasTransformManager';
import { Vector2D, worldToPos, distance, Position } from '../utils/utils';
import { updateDebugInfo } from '../utils/ui';
import { Drawable } from './models/Drawable';
import { Point, Linear } from './models';

export default class Graph {
	transform: CanvasTransformManager;
	drawables: Drawable[] = [];
	hover: Point | null = null;
	hoverPos: Position | null = null;

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

		window.addEventListener('keydown', (e) => this.spawnPoint(e));
		window.addEventListener('mousemove', () => this.updateHoverPoint());

		this.update();
	}

	// spawn point on mouse when pressing E
	private spawnPoint(e: KeyboardEvent) {
		if (e.key === 'e' || e.key === 'E') {
			let colour = 'white';
			let p = new Point(this.transform.currentMousePos.world, 5, colour);
			this.add(p);
		}
	}

	// calculate the closest line segment of any drawable object to the mouse
	// and place a point at the shortest distance
	private updateHoverPoint() {
		// for lines and linear functions
		// we can check against its entirety
		const threshold = 1;

		let closestLine: Linear | null = null;
		let closestPoint: Vector2D | null = null;
		let shortestDistance: number = Infinity;
		let isFound: boolean = false;

		for (const drawable of this.drawables) {
			if (drawable instanceof Linear) {
				const [p, d]: [Vector2D, number] = drawable.closestPointToLine(
					this.transform.currentMousePos.world
				);
				console.log(drawable.colour, d);
				if (d < shortestDistance && d <= threshold) {
					shortestDistance = d;
					closestLine = drawable;
					closestPoint = p;
					isFound = true;
				}
			}
		}

		if (closestLine != null && closestPoint != null) {
			this.hover = new Point(
				closestPoint as Vector2D,
				6,
				closestLine.colour,
				2,
				'rgba(255,255,255,0.3)'
			);
			this.hoverPos = worldToPos(closestPoint, this.transform.vt);
		} else {
			this.hover = null;
			this.hoverPos = null;
		}
	}

	private drawHover() {
		if (this.hoverPos != null && this.hover != null) {
			// draw point
			this.hover?.draw(this.transform.vt);

			// offsets and label text for determining label width
			const boxOffset = 5;
			const textOffset = {
				x: 8,
				y: 5
			};
			const text = `(${this.hoverPos.world.x.toFixed(2)},${this.hoverPos.world.y.toFixed(2)})`;
			const widthPerChar = 10;

			// draw box
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
			ctx.roundRect(
				this.hoverPos?.screen.x + boxOffset,
				this.hoverPos?.screen.y - boxOffset,
				widthPerChar * text.length,
				-20,
				3
			);
			ctx.fill();
			ctx.restore();

			// draw text
			ctx.save();
			ctx.beginPath();
			ctx.font = '16px monospace';
			ctx.fillStyle = 'black';
			ctx.fillText(
				`(${this.hoverPos.world.x.toFixed(2)},${this.hoverPos.world.y.toFixed(2)})`,
				this.hoverPos.screen.x + boxOffset + textOffset.x,
				this.hoverPos.screen.y - boxOffset - textOffset.y
			);
			ctx.restore();
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

		for (const drawable of this.drawables) {
			drawable.draw(this.transform.vt);
		}

		this.drawHover();

		this.drawAxes();
	}

	private update() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		updateDebugInfo(this.transform, this.drawables);
		this.draw();
		requestAnimationFrame(() => this.update());
	}
}
