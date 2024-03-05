export function worldToScreen(
	wx: number,
	wy: number,
	offsetX: number,
	offsetY: number,
	scale: number
) {
	return [(wx + offsetX) * scale, (wy + offsetY) * scale];
}

export function screenToWorld(
	sx: number,
	sy: number,
	offsetX: number,
	offsetY: number,
	scale: number
) {
	return [sx / scale - offsetX, sy / scale - offsetY];
}
