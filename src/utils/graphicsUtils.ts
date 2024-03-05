import { canvas } from './CanvasContextManager';

export interface Vector2D {
	x: number;
	y: number;
}

export interface Position {
	world: Vector2D;
	screen: Vector2D;
}

export interface ViewTransform {
	offset: Vector2D;
	scale: number;
}

export function worldToPos(worldPos: Vector2D, vt: ViewTransform): Position {
	return {
		world: worldPos,
		screen: {
			x: (worldPos.x + vt.offset.x) * vt.scale,
			y: canvas.height - (worldPos.y + vt.offset.y) * vt.scale
		}
	};
}

export function screenToPos(screenPos: Vector2D, vt: ViewTransform): Position {
	return {
		screen: screenPos,
		world: {
			x: screenPos.x / vt.scale - vt.offset.x,
			y: (canvas.height - screenPos.y) / vt.scale - vt.offset.y
		}
	};
}
