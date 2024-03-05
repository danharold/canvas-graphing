import { worldToScreen } from '../utils/graphicsUtils';

export default class Square {
	// x and y are the center point of the square in world space
	x: number;
	y: number;
	w: number;
	h: number;
	colour: string;

	constructor(x: number, y: number, w: number, h: number, colour: string) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.colour = colour;
	}

	draw(
		ctx: CanvasRenderingContext2D,
		offsetX: number,
		offsetY: number,
		scale: number
	) {
		const scaledWidth = this.w * scale;
		const scaledHeight = this.h * scale;
		const [x, y] = worldToScreen(this.x, this.y, offsetX, offsetY, scale);
		console.log(ctx);
		console.log(offsetX, offsetY, scale);
		ctx.fillStyle = 'white';
		ctx.fillRect(x, y, scaledWidth, scaledHeight);
	}
}
