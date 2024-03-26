import Graph from './components/Graph';
import * as m from './components/models';

import { Option, createPlotMenu } from './utils/ui';

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	if (canvas) {
		main();
	}
});

function main(): void {
	// initialise graph
	let g = new Graph();

	// initialise the menu
	const plotOptions: Option[] = [
		{ name: 'point', inputFields: [] },
		{ name: 'linear', inputFields: ['m', 'c'] },
		{ name: 'blablabla', inputFields: [] },
		{ name: 'trigonometric', inputFields: [] }
	];
	createPlotMenu(plotOptions, g);
}
