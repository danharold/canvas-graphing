import Graph from './components/Graph';

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	if (canvas) {
		let g = new Graph(canvas);
	}
});
