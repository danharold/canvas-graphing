import { Drawable } from '../components/models';
import { CanvasTransformManager } from './CanvasTransformManager';
import { getWorldBoundary } from './utils';

const debugToggle = document.querySelector('.debug-ui-toggle') as HTMLElement;
const debugInfo = document.querySelector('.debug-ui-info') as HTMLElement;

debugToggle.addEventListener('click', () => {
	debugInfo.classList.toggle('debug-ui--open');
});

const addToggle = document.querySelector('.add-ui-toggle') as HTMLElement;
const addMenu = document.querySelector('.add-ui-menu') as HTMLElement;

addToggle.addEventListener('click', () => {
	addMenu.classList.toggle('add-ui--open');
});

export function updateDebugInfo(
	transform: CanvasTransformManager,
	drawables: Drawable[]
): void {
	const worldBoundary = getWorldBoundary(transform.vt);
	let drawablesString: string = '';
	for (const drawable of drawables) {
		drawablesString += '&nbsp; ' + drawable.repr + '<br>';
	}
	debugInfo.innerHTML = `
        <strong>mouse position</strong><br>
        &nbsp; world: ${transform.currentMousePos.world.x.toFixed(2)}, ${transform.currentMousePos.world.y.toFixed(2)}<br>
        &nbsp; screen: ${transform.currentMousePos.screen.x}, ${transform.currentMousePos.screen.y}<br><br>
        <strong>view transform</strong><br>
        &nbsp; offset: ${transform.vt.offset.x.toFixed(2)}, ${transform.vt.offset.y.toFixed(2)}<br>
        &nbsp; scale: ${transform.vt.scale.toFixed(2)}<br>
        &nbsp; &nbsp; min: ${transform.minScale}<br>
        &nbsp; &nbsp; max: ${transform.maxScale}<br><br>
        <strong>world boundary</strong><br>
        &nbsp; x: ${worldBoundary.x.min.toFixed(2)}, ${worldBoundary.x.max.toFixed(2)}<br>
        &nbsp; y: ${worldBoundary.y.min.toFixed(2)}, ${worldBoundary.y.max.toFixed(2)}<br><br>
        <strong>plots</strong><br>
        ${drawablesString}
    `;
}
