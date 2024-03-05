import { getMousePos } from '../utils/inputHandler';
import {
	Position,
	ViewTransform,
	screenToPos,
	worldToPos
} from '../utils/graphicsUtils';
import { canvas, ctx } from '../utils/CanvasContextManager';
import Square from './Square';

export default class Graph {
	private clicked: boolean = false;
	mouseClickPos: Position = {
		world: { x: 0, y: 0 },
		screen: { x: 0, y: 0 }
	};
	currentMousePos: Position = {
		world: { x: 0, y: 0 },
		screen: { x: 0, y: 0 }
	};
	vt: ViewTransform = {
		offset: { x: 0, y: 0 },
		scale: 1
	};

	private squares: Square[] = [];

	constructor() {
		window.addEventListener('resize', () => this.resizeCanvas());
		window.addEventListener('mousedown', (e) => this.toggleDown(e));
		window.addEventListener('mouseup', (e) => this.toggleUp(e));
		window.addEventListener('mousemove', (e) => this.pan(e));
		window.addEventListener('keydown', (e) => this.spawnSquare(e));
		window.addEventListener('wheel', (e) => this.zoom(e));
		this.resizeCanvas();
	}

	private resizeCanvas(): void {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		this.draw();
	}

	// if mouse clicked
	// set clicked to true and record click location
	private toggleDown(e: MouseEvent) {
		this.clicked = true;
		this.mouseClickPos = getMousePos(e, this.vt);
	}

	// if mouse is not clicked, set clicked to false
	// panning stops
	private toggleUp(e: MouseEvent) {
		this.clicked = false;
	}

	// update current mouse location while moving
	// and if mouse moves while clicked,
	// then pan, which means update the offset and draw
	// this means the canvas is static when no panning is occurring
	private pan(e: MouseEvent) {
		this.currentMousePos = getMousePos(e, this.vt);
		if (this.clicked) {
			this.vt.offset.x +=
				this.currentMousePos.world.x - this.mouseClickPos.world.x;
			this.vt.offset.y +=
				this.currentMousePos.world.y - this.mouseClickPos.world.y;
			this.redraw();
		}
	}

	private zoom(e: WheelEvent) {
		if (e.deltaY > 0) {
			this.vt.scale *= 1 / 1.2;
		} else if (e.deltaY < 0) {
			this.vt.scale *= 1.2;
		}
		let mousePosAfterZoom = screenToPos(this.currentMousePos.screen, this.vt);
		console.log(
			'Before',
			this.currentMousePos.world.x,
			this.currentMousePos.world.y
		);
		console.log('After', mousePosAfterZoom.world.x, mousePosAfterZoom.world.x);
		this.vt.offset.x +=
			mousePosAfterZoom.world.x - this.currentMousePos.world.x;
		this.vt.offset.y +=
			mousePosAfterZoom.world.y - this.currentMousePos.world.y;
		this.redraw();
	}

	// spawn square on mouse when pressing E
	private spawnSquare(e: KeyboardEvent) {
		if (e.key === 'e' || e.key === 'E') {
			let randomWidth = Math.random() * 100;
			let randomHeight = Math.random() * 100;
			let colour = 'white';
			let sq = new Square(
				this.currentMousePos,
				randomWidth,
				randomHeight,
				colour
			);
			console.log(sq);
			this.squares.push(sq);
			this.draw();
		}
	}

	private draw(): void {
		console.log(ctx);
		if (ctx) {
			for (let i = 0; i < this.squares.length; i++) {
				this.squares[i].draw(this.vt);
			}
			ctx.fillStyle = 'white';
			ctx.fillRect(10, 10, 100, 100);
		}
	}

	private clear(): void {
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	private redraw() {
		this.clear();
		this.draw();
	}
}
