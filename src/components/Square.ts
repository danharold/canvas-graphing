import { Position, ViewTransform, worldToPos } from '../utils/graphicsUtils';
import { ctx } from '../utils/CanvasContextManager';

export default class Square {
	pos: Position;
	w: number;
	h: number;
	colour: string;

	constructor(pos: Position, w: number, h: number, colour: string) {
		this.pos = pos;
		this.w = w;
		this.h = h;
		this.colour = colour;
	}

	draw(vt: ViewTransform) {
		// draw at scaled size and calculate new screen position
		const scaledWidth = this.w * vt.scale;
		const scaledHeight = this.h * vt.scale;
		this.pos = worldToPos(this.pos.world, vt);
		console.log(ctx);
		console.log(vt.offset.x, vt.offset, vt.scale);
		ctx.fillStyle = 'white';
		ctx.fillRect(
			this.pos.screen.x,
			this.pos.screen.y,
			scaledWidth,
			scaledHeight
		);
	}
}
