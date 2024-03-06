import {
	Position,
	ViewTransform,
	Vector2D,
	screenToPos,
	worldToPos
} from './utils';
import { canvas, ctx } from './CanvasContextManager';

export class CanvasTransformManager {
	vt: ViewTransform = {
		offset: { x: 0, y: 0 },
		scale: 1
	};
	clicked: boolean = false;
	mouseClickPos: Position = {
		world: { x: 0, y: 0 },
		screen: { x: 0, y: 0 }
	};
	currentMousePos: Position = {
		world: { x: 0, y: 0 },
		screen: { x: 0, y: 0 }
	};
	minScale: number = 0.1;
	maxScale: number = 150;

	constructor(minScale: number, maxScale: number) {
		this.minScale = minScale;
		this.maxScale = maxScale;
		window.addEventListener('resize', () => this.resizeCanvas());
		window.addEventListener('mousedown', (e) => this.toggleDown(e));
		window.addEventListener('mouseup', (e) => this.toggleUp(e));
		window.addEventListener('mousemove', (e) => this.pan(e));
		window.addEventListener('wheel', (e) => this.zoom(e));
		this.resizeCanvas();
	}

	// resize canvas to full screen and redraw
	private resizeCanvas(): void {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	// if mouse clicked
	// set clicked to true and record click location
	private toggleDown(e: MouseEvent): void {
		this.clicked = true;
		this.mouseClickPos = this.getMousePos(e);
	}

	// if mouse is not clicked, set clicked to false
	// panning stops
	private toggleUp(e: MouseEvent): void {
		this.clicked = false;
	}

	// update current mouse location while moving
	// and if mouse moves while clicked,
	// then pan, which means update the offset and draw
	// this means the canvas is static when no panning is occurring
	private pan(e: MouseEvent): void {
		this.currentMousePos = this.getMousePos(e);
		if (this.clicked) {
			this.vt.offset.x +=
				this.currentMousePos.world.x - this.mouseClickPos.world.x;
			this.vt.offset.y +=
				this.currentMousePos.world.y - this.mouseClickPos.world.y;
		}
	}

	private zoom(e: WheelEvent): void {
		if (e.deltaY > 0) {
			if (this.vt.scale > this.minScale) {
				this.vt.scale *= 1 / 1.2;
			}
		} else if (e.deltaY < 0) {
			if (this.vt.scale < this.maxScale) {
				this.vt.scale *= 1.2;
			}
		}
		let mousePosAfterZoom = screenToPos(this.currentMousePos.screen, this.vt);
		this.vt.offset.x +=
			mousePosAfterZoom.world.x - this.currentMousePos.world.x;
		this.vt.offset.y +=
			mousePosAfterZoom.world.y - this.currentMousePos.world.y;
	}

	private getMousePos(event: MouseEvent): Position {
		let rect = canvas.getBoundingClientRect();
		let screenPos: Vector2D = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
		return screenToPos(screenPos, this.vt);
	}
}
