import {
	Vector2D,
	ViewTransform,
	worldToPos,
	magnitude,
	crossProduct,
	getWorldBoundary
} from '../../utils/graphicsUtils';
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

	constructor(m: number, c: number, w: number, colour: string) {
		this.m = m;
		this.c = c;
		this.w = w;
		this.colour = colour;

		// get vector representation
		const p1: Vector2D = { x: 0, y: c };
		const p2: Vector2D = { x: -c / m, y: 0 };
		this.dirVec = { x: p1.x - p2.x, y: p1.x - p2.x };
		const magnitudeDirVec = magnitude(this.dirVec);
		this.dirVec = {
			x: this.dirVec.x / magnitudeDirVec,
			y: this.dirVec.y / magnitudeDirVec
		};
		this.posVec = { x: p1.x, y: p1.y };

		console.log(`y+${this.m}x+${this.c}`);
		console.log(this.posVec);
		console.log(this.dirVec);
	}

	distancePointToLine(a: Vector2D) {
		// d = || v x dirVec ||/|| dirVec ||
		// where v is the vector between the point and a point on the line
		const v: Vector2D = { x: a.x - this.posVec.x, y: a.y - this.posVec.y };
		return crossProduct(v, this.dirVec) / magnitude(this.dirVec);
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
		console.log('wd', {
			x: worldBoundary.x.min,
			y: this.fx(worldBoundary.x.min)
		});
		console.log({ x: worldBoundary.x.max, y: this.fx(worldBoundary.x.max) });
		console.log(leftScreenPos);
		console.log(rightScreenPos);
		ctx.moveTo(leftScreenPos.x, leftScreenPos.y);
		ctx.lineTo(rightScreenPos.x, rightScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}
}
