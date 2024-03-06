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

export interface WorldBoundary {
	x: { min: number; max: number };
	y: { min: number; max: number };
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

export function getWorldBoundary(vt: ViewTransform): WorldBoundary {
	const topLeft = screenToPos({ x: 0, y: 0 }, vt);
	const bottomRight = screenToPos({ x: canvas.width, y: canvas.height }, vt);

	return {
		x: {
			min: topLeft.world.x,
			max: bottomRight.world.x
		},
		y: {
			min: bottomRight.world.y,
			max: topLeft.world.y
		}
	};
}

export function distance(a: Vector2D, b: Vector2D): number {
	return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function crossProduct(a: Vector2D, b: Vector2D): number {
	return a.x * b.y - a.y * b.x;
}

export function magnitude(a: Vector2D): number {
	return Math.sqrt(a.x ** 2 + a.y ** 2);
}

export function round(num: number, n: number): number {
	return Math.round(num * 10 ** n) / 10 ** n;
}
