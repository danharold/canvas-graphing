import Graph from '../components/Graph';
import { Drawable, Linear } from '../components/models';
import { CanvasTransformManager } from './CanvasTransformManager';
import { getWorldBoundary } from './utils';

// toggle class to open/close debug info
const debugToggle = document.querySelector('.debug-ui-toggle') as HTMLElement;
const debugInfo = document.querySelector('.debug-ui-info') as HTMLElement;

debugToggle.addEventListener('click', () => {
	debugInfo.classList.toggle('debug-ui--open');
});

// toggle class to open/close add plot menu
const addUI = document.querySelector('.add-ui') as HTMLElement;
const addToggle = document.querySelector('.add-ui-toggle') as HTMLElement;
const addMenu = document.querySelector('.add-ui-menu') as HTMLElement;

addToggle.addEventListener('click', () => {
	addMenu.classList.toggle('add-ui--open');
});

// function to create buttons for several plotting options
// also on click, open a drawer with relevant inputFields
export interface Option {
	name: string;
	inputFields: string[];
}
export function createPlotMenu(plotOptions: Option[], g: Graph): void {
	plotOptions.forEach((option) => {
		const button = document.createElement('p');
		button.textContent = option.name;
		button.addEventListener('click', () => {
			createDrawer(option, button, g);
		});
		addMenu.appendChild(button);
	});
}

// create a drawer given a plot option, allowing relevant inputs
// TODO:
// - drawers still a little buggy, appearing above the button then moving down
// - removing flex from .drawer fixes this but then can mess arrangement up
function createDrawer(option: Option, button: HTMLElement, g: Graph) {
	const addMenu = document.querySelector('.add-ui-menu') as HTMLElement;

	// if an existing drawer exists, remove it
	const existingDrawer = document.querySelector('.drawer');
	if (existingDrawer) {
		existingDrawer.classList.remove('open');
		// remove element after transition is over
		existingDrawer.addEventListener('transitionend', () => {
			existingDrawer.remove();
		});
		if (existingDrawer.id === option.name + '-drawer') {
			// the current button was clicked to close the drawer, so return out
			return;
		}
	}

	// initialise drawer div with unique id for checking if an opened drawer was clicked to be closed
	const drawer = document.createElement('div');
	drawer.classList.add('drawer');
	drawer.id = option.name + '-drawer';

	// input fields
	option.inputFields.forEach((input) => {
		const inputField = document.createElement('input');
		inputField.type = 'number';
		inputField.placeholder = input;
		inputField.id = input + 'Input';

		// match against regex to only allow numeric inputs
		inputField.addEventListener('input', () => {
			const regex = /^[+-]?(\d*\.)?\d+$/; // Regex to match numbers and floats
			if (!regex.test(inputField.value)) {
				inputField.value = inputField.value.replace(/[^0-9.-]/g, '');
			}
		});

		drawer.appendChild(inputField);
	});

	// add plot button
	const plotButton = document.createElement('div');
	plotButton.textContent = 'add';
	plotButton.addEventListener('click', () => {
		addPlot(option, g);
	});
	drawer.appendChild(plotButton);

	// insert the drawer element after the button (not as a child)
	button.insertAdjacentElement('afterend', drawer);

	setTimeout(() => {
		drawer.classList.add('open');
	}, 10);
}

function addPlot(option: Option, g: Graph) {
	const inputs = option.inputFields.map((input: string): number => {
		const inputElement = document.getElementById(
			input + 'Input'
		) as HTMLInputElement;
		return parseFloat(inputElement.value);
	});
	const colours = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
	const colourIndex = Math.floor(Math.random() * colours.length);
	if (inputs.every((input) => !isNaN(input))) {
		switch (option.name) {
			case 'linear':
				g.add(new Linear(inputs[0], inputs[1], 2, colours[colourIndex])); // Example color: "red"
				break;
			// TODO: add more plot options
		}
	} else {
		alert('Please enter valid values for all input fields.');
	}
}

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
