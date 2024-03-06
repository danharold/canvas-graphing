import Graph from './components/Graph';
import * as m from './components/models';

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	if (canvas) {
		main();
	}
});

function main(): void {
	let g = new Graph();
	//g.add(new m.Line({ x: -5, y: -5 }, { x: 5, y: 5 }, 2, 'red'));
	g.add(new m.Linear(1, 0, 1, 'blue'));
	console.log(g.drawables);
}
