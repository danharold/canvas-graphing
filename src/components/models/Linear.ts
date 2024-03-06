import {
	Vector2D,
	ViewTransform,
	worldToPos,
	magnitude,
	crossProduct,
	getWorldBoundary,
	dotProduct,
	distance
} from '../../utils/utils';
import { Drawable } from './Drawable';
import { ctx } from '../../utils/CanvasContextManager';

export class Linear implements Drawable {
	width: number;
	colour: string;
	// cartesian representation y=mx+c
	m: number;
	c: number;

	// vector representation a + lambda b
	a: Vector2D;
	b: Vector2D;

	repr: string;

	constructor(m: number, c: number, width: number, colour: string) {
		this.m = m;
		this.c = c;
		this.width = width;
		this.colour = colour;

		this.repr = `y=${m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '-x' : m + 'x'}${
			c === 0 ? '' : c < 0 ? c : '+' + c
		}`;

		// get vector representation
		const p: Vector2D = { x: 0, y: c };
		this.b = { x: 1, y: 1 * m };
		this.a = { x: p.x, y: p.y };
	}

	closestPointToLine(p: Vector2D): [Vector2D, number] {
		// we want the closest point c on the line from p
		// do this by projecting ap onto b

		// calculate ap = p - a
		const ap: Vector2D = { x: p.x - this.a.x, y: p.y - this.a.y };

		// project ap onto the line with dir vector b
		// length ac = (ap . b)/|b|
		// multiply by unit vector to obtain this vector
		// =>     ac = (b/|b|)*(ap . b)/|b|
		const magb = magnitude(this.b);
		const acLength: number = dotProduct(ap, this.b) / magb;
		const ac: Vector2D = {
			x: (acLength * this.b.x) / magb,
			y: (acLength * this.b.y) / magb
		};

		// to get the position vector oc (or just c)
		// c = oc = oa + ac
		const c: Vector2D = {
			x: this.a.x + ac.x,
			y: this.a.y + ac.y
		};
		return [c, distance(p, c)];
	}

	fx(x: number) {
		return this.m * x + this.c;
	}

	fy(y: number) {
		return (y - this.c) / this.m;
	}

	draw(vt: ViewTransform): void {
		const worldBoundary = getWorldBoundary(vt);
		const leftScreenPos = worldToPos(
			{ x: worldBoundary.x.min, y: this.fx(worldBoundary.x.min) },
			vt
		).screen;
		const rightScreenPos = worldToPos(
			{ x: worldBoundary.x.max, y: this.fx(worldBoundary.x.max) },
			vt
		).screen;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.colour;
		ctx.lineWidth = this.width;
		ctx.moveTo(leftScreenPos.x, leftScreenPos.y);
		ctx.lineTo(rightScreenPos.x, rightScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}
}
