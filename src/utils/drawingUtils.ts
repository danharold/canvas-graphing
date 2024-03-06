import { ctx } from './CanvasContextManager';
import {
	worldToPos,
	screenToPos,
	Vector2D,
	ViewTransform
} from './graphicsUtils';

// plot a line between 2 points in world space
export function plotLine(
	a: Vector2D,
	b: Vector2D,
	w: number,
	colour: string,
	vt: ViewTransform
) {
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = colour;
	ctx.lineWidth = w;
	const aScreen = worldToPos(a, vt).screen;
	const bScreen = worldToPos(b, vt).screen;
	ctx.moveTo(aScreen.x, aScreen.y);
	ctx.lineTo(bScreen.x, bScreen.y);
	ctx.stroke();
	ctx.restore();
}

// plot a point
export function plotPoint(
	center: Vector2D,
	r: number,
	colour: string,
	vt: ViewTransform,
	outline: boolean = false,
	outlineWidth: number = 1,
	outlineColour: string = 'white'
) {
	const centerPos = worldToPos(center, vt).screen;
	ctx.save();
	if (outline) {
		ctx.beginPath();
		ctx.arc(centerPos.x, centerPos.y, r, 0, 2 * Math.PI);
		ctx.fillStyle = outlineColour;
		ctx.fill();
		ctx.beginPath();
		ctx.arc(centerPos.x, centerPos.y, r - outlineWidth, 0, 2 * Math.PI);
		ctx.fillStyle = colour;
		ctx.fill();
	} else {
		ctx.beginPath();
		ctx.arc(centerPos.x, centerPos.y, r, 0, 2 * Math.PI);
		ctx.fillStyle = colour;
		ctx.fill();
	}
	ctx.restore();
}
