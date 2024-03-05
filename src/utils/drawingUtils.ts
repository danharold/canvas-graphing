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
