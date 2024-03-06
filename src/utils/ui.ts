import { CanvasTransformManager } from './CanvasTransformManager';
import { getWorldBoundary } from './graphicsUtils';

export function updateDebugInfo(transform: CanvasTransformManager): void {
	const ui = document.getElementById('ui') as HTMLElement;
	const worldBoundary = getWorldBoundary(transform.vt);
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
        &nbsp; x: ${round(worldBoundary.x.min, 2)}, ${round(worldBoundary.x.max, 2)}
        &nbsp; y: ${round(worldBoundary.y.min, 2)}, ${round(worldBoundary.y.max, 2)}
    `;
}

function round(num: number, n: number): number {
	return Math.round(num * 10 ** n) / 10 ** n;
}
