import {
	screenToPos,
	ViewTransform,
	Position,
	Vector2D
} from './graphicsUtils';
import { canvas } from './CanvasContextManager';

export function getMousePos(event: MouseEvent, vt: ViewTransform): Position {
	let rect = canvas.getBoundingClientRect();
	let screenPos: Vector2D = {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
	return screenToPos(screenPos, vt);
}
