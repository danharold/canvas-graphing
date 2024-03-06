import { Drawable } from '../components/models';
import { CanvasTransformManager } from './CanvasTransformManager';
import { getWorldBoundary, round } from './utils';

export function updateDebugInfo(
	transform: CanvasTransformManager,
	drawables: Drawable[]
): void {
	const ui = document.getElementById('ui') as HTMLElement;
	const worldBoundary = getWorldBoundary(transform.vt);
	let drawablesString: string = '';
	for (const drawable of drawables) {
		drawablesString += '&nbsp; ' + drawable.repr + '<br>';
	}
	ui.innerHTML = `
        <strong>mouse position</strong><br>
        &nbsp; world: ${round(transform.currentMousePos.world.x, 2)}, ${round(transform.currentMousePos.world.y, 2)}<br>
        &nbsp; screen: ${round(transform.currentMousePos.screen.x, 2)}, ${round(transform.currentMousePos.screen.y, 2)}<br><br>
        <strong>view transform</strong><br>
        &nbsp; offset: ${round(transform.vt.offset.x, 2)}, ${round(transform.vt.offset.y, 2)}<br>
        &nbsp; scale: ${round(transform.vt.scale, 2)}<br>
        &nbsp; &nbsp; min: ${transform.minScale}<br>
        &nbsp; &nbsp; max: ${transform.maxScale}<br><br>
        <strong>world boundary</strong><br>
        &nbsp; x: ${round(worldBoundary.x.min, 2)}, ${round(worldBoundary.x.max, 2)}<br>
        &nbsp; y: ${round(worldBoundary.y.min, 2)}, ${round(worldBoundary.y.max, 2)}<br><br>
        <strong>plots</strong><br>
        ${drawablesString}
    `;
}
