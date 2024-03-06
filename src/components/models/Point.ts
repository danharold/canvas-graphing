import { Vector2D, ViewTransform, worldToPos, round } from '../../utils/utils';
import { Drawable } from './Drawable';
import { ctx } from '../../utils/CanvasContextManager';

export class Point implements Drawable {
	center: Vector2D;
	r: number;
	colour: string;
	outlineWidth: number;
	outlineColour: string;
	repr: string;

	constructor(
		center: Vector2D,
		r: number,
		colour: string,
		outlineWidth: number = 0,
		outlineColour: string = ''
	) {
		this.center = center;
		this.r = r;
		this.colour = colour;

		this.outlineWidth = outlineWidth;
		this.outlineColour = outlineColour;

		this.repr = `point (${round(this.center.x, 2)}, ${round(this.center.y, 2)})`;
	}

	draw(vt: ViewTransform): void {
		const centerPos = worldToPos(this.center, vt);
		ctx.save();
		if (this.outlineWidth > 0) {
			ctx.beginPath();
			ctx.arc(centerPos.screen.x, centerPos.screen.y, this.r, 0, 2 * Math.PI);
			ctx.fillStyle = this.outlineColour;
			ctx.fill();
			ctx.beginPath();
			ctx.arc(
				centerPos.screen.x,
				centerPos.screen.y,
				this.r - this.outlineWidth,
				0,
				2 * Math.PI
			);
			ctx.fillStyle = this.colour;
			ctx.fill();
		} else {
			ctx.beginPath();
			ctx.arc(centerPos.screen.x, centerPos.screen.y, this.r, 0, 2 * Math.PI);
			ctx.fillStyle = this.colour;
			ctx.fill();
		}
		ctx.restore();
	}
}
