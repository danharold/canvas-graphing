import { getMousePos, MousePosition } from '../utils/inputHandler';
import { screenToWorld, worldToScreen } from '../utils/graphicsUtils';
import Square from './Square';

export default class Graph {
	private canvas: HTMLCanvasElement;

	private clicked: boolean = false;
	mouseClickPos: MousePosition = {
		wx: 0,
		wy: 0,
		sx: 0,
		sy: 0
	};
	currentMousePos: MousePosition = {
		wx: 0,
		wy: 0,
		sx: 0,
		sy: 0
	};

	offsetX: number = 0;
	offsetY: number = 0;
	scale: number = 1;

	private squares: Square[] = [];

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.init();
	}

	private init(): void {
		window.addEventListener('resize', () => this.resizeCanvas());
		window.addEventListener('mousedown', (e) => this.toggleDown(e));
		window.addEventListener('mouseup', (e) => this.toggleUp(e));
		window.addEventListener('mousemove', (e) => this.pan(e));
		window.addEventListener('keydown', (e) => this.spawnSquare(e));
		window.addEventListener('wheel', (e) => this.zoom(e));
		this.resizeCanvas();
	}

	private resizeCanvas(): void {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.draw();
	}

	// if mouse clicked
	// set clicked to true and record click location
	private toggleDown(e: MouseEvent) {
		this.clicked = true;
		this.mouseClickPos = getMousePos(
			e,
			this.canvas,
			this.offsetX,
			this.offsetY,
			this.scale
		);
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
		this.currentMousePos = getMousePos(
			e,
			this.canvas,
			this.offsetX,
			this.offsetY,
			this.scale
		);
		if (this.clicked) {
			this.offsetX += this.currentMousePos.wx - this.mouseClickPos.wx;
			this.offsetY += this.currentMousePos.wy - this.mouseClickPos.wy;
			this.redraw();
		}
	}

	private zoom(e: WheelEvent) {
		if (e.deltaY > 0) {
			this.scale *= 1 / 1.2;
		} else if (e.deltaY < 0) {
			this.scale *= 1.2;
		}
		let mouseWorldPosAfterZoom = screenToWorld(
			this.currentMousePos.sx,
			this.currentMousePos.sy,
			this.offsetX,
			this.offsetY,
			this.scale
		);
		console.log('Before', this.currentMousePos.wx, this.currentMousePos.wy);
		console.log('After', mouseWorldPosAfterZoom[0], mouseWorldPosAfterZoom[0]);
		this.offsetX += mouseWorldPosAfterZoom[0] - this.currentMousePos.wx;
		this.offsetY += mouseWorldPosAfterZoom[1] - this.currentMousePos.wy;
		this.redraw();
	}

	// spawn square on mouse when pressing E
	private spawnSquare(e: KeyboardEvent) {
		if (e.key === 'e' || e.key === 'E') {
			let randomWidth = Math.random() * 100;
			let randomHeight = Math.random() * 100;
			let colour = 'white';
			let sq = new Square(
				this.currentMousePos.wx,
				this.currentMousePos.wy,
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
		let ctx = this.canvas.getContext('2d');
		console.log(ctx);
		if (ctx) {
			for (let i = 0; i < this.squares.length; i++) {
				this.squares[i].draw(ctx, this.offsetX, this.offsetY, this.scale);
			}
			ctx.fillStyle = 'white';
			ctx.fillRect(10, 10, 100, 100);
		}
	}

	private clear(): void {
		let ctx = this.canvas.getContext('2d');
		if (ctx) {
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

	private redraw() {
		this.clear();
		this.draw();
	}
}
