import { CanvasTransformManager } from './CanvasTransformManager';

export function updateDebugInfo(transform: CanvasTransformManager): void {
	const ui = document.getElementById('ui') as HTMLElement;
	ui.innerHTML = `
        <strong>mouse pos</strong><br>
        world: ${round(transform.currentMousePos.world.x, 2)}, ${round(transform.currentMousePos.world.y, 2)}<br>
        screen: ${round(transform.currentMousePos.screen.x, 2)}, ${round(transform.currentMousePos.screen.y, 2)}<br><br>
        <strong>view transform</strong><br>
        &nbsp; offset: ${round(transform.vt.offset.x, 2)}, ${round(transform.vt.offset.y, 2)}<br>
        &nbsp; scale: ${round(transform.vt.scale, 2)}<br>
        &nbsp; &nbsp; min: ${transform.minScale}<br>
        &nbsp; &nbsp; max: ${transform.maxScale}<br>
    `;
}

function round(num: number, n: number): number {
	return Math.round(num * 10 ** n) / 10 ** n;
}
