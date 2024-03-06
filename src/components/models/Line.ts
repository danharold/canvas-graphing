import { Vector2D, ViewTransform, worldToPos } from '../../utils/utils';
import { Drawable } from './Drawable';
import { ctx } from '../../utils/CanvasContextManager';

export class Line implements Drawable {
	a: Vector2D;
	b: Vector2D;
	w: number;
	colour: string;
	repr: string;

	constructor(a: Vector2D, b: Vector2D, w: number, colour: string) {
		this.a = a;
		this.b = b;
		this.w = w;
		this.colour = colour;
		this.repr = `line (${a.x}, ${a.y}) -> (${b.x}, ${b.y})`;
	}

	draw(vt: ViewTransform): void {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.colour;
		ctx.lineWidth = this.w;
		const aScreen = worldToPos(this.a, vt).screen;
		const bScreen = worldToPos(this.b, vt).screen;
		ctx.moveTo(aScreen.x, aScreen.y);
		ctx.lineTo(bScreen.x, bScreen.y);
		ctx.stroke();
		ctx.restore();
	}
}
