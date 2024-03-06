import {
	Vector2D,
	ViewTransform,
	worldToPos,
	magnitude,
	crossProduct,
	getWorldBoundary
} from '../../utils/utils';
import { Drawable } from './Drawable';
import { ctx } from '../../utils/CanvasContextManager';

export class Linear implements Drawable {
	w: number;
	colour: string;
	// cartesian representation y=mx+c
	m: number;
	c: number;

	// vector representation a + lambda b
	posVec: Vector2D;
	dirVec: Vector2D;

	repr: string;

	constructor(m: number, c: number, w: number, colour: string) {
		this.m = m;
		this.c = c;
		this.w = w;
		this.colour = colour;

		this.repr = `y=${m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '-x' : m + 'x'}${
			c === 0 ? '' : c < 0 ? c : '+' + c
		}`;

		// get vector representation
		const p: Vector2D = { x: 0, y: c };
		this.dirVec = { x: 1, y: 1 * m };
		const magnitudeDirVec = magnitude(this.dirVec);
		this.dirVec = {
			x: this.dirVec.x / magnitudeDirVec,
			y: this.dirVec.y / magnitudeDirVec
		};
		this.posVec = { x: p.x, y: p.y };
	}

	distancePointToLine(a: Vector2D) {
		// d = || v x dirVec ||/|| dirVec ||
		// where v is the vector between the point and a point on the line
		const v: Vector2D = { x: a.x - this.posVec.x, y: a.y - this.posVec.y };
		return crossProduct(v, this.dirVec);
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
		ctx.lineWidth = this.w;
		ctx.moveTo(leftScreenPos.x, leftScreenPos.y);
		ctx.lineTo(rightScreenPos.x, rightScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}
}
