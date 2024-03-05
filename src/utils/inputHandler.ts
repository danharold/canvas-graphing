import { screenToWorld } from './graphicsUtils';

export interface MousePosition {
	wx: number;
	wy: number;
	sx: number;
	sy: number;
}

export function getMousePos(
	event: MouseEvent,
	canvas: HTMLCanvasElement,
	offsetX: number,
	offsetY: number,
	scale: number
): MousePosition {
	let rect = canvas.getBoundingClientRect();
	let sx = event.clientX - rect.left;
	let sy = event.clientY - rect.top;
	let [wx, wy] = screenToWorld(sx, sy, offsetX, offsetY, scale);
	return {
		sx: sx,
		sy: sy,
		wx: wx,
		wy: wy
	};
}
