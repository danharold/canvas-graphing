class CanvasContextManager {
	private static instance: CanvasContextManager | null = null;
	private canvasId: string;
	private canvas: HTMLCanvasElement | null;
	private ctx: CanvasRenderingContext2D | null;

	constructor(canvasId: string) {
		this.canvasId = canvasId;
		this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		if (this.canvas) {
			this.ctx = this.canvas.getContext('2d');
		} else {
			throw new Error(`Canvas element with id "${canvasId}" not found.`);
		}
	}

	public static getInstance(canvasId: string): CanvasContextManager {
		if (!CanvasContextManager.instance) {
			CanvasContextManager.instance = new CanvasContextManager(canvasId);
		}
		return CanvasContextManager.instance;
	}

	public getContext(): CanvasRenderingContext2D {
		if (!this.ctx) {
			throw new Error('CanvasRenderingContext2D is not initialised.');
		}
		return this.ctx;
	}

	public getCanvas(): HTMLCanvasElement {
		if (!this.canvas) {
			throw new Error('HTMLCanvasElement is not initialised.');
		}
		return this.canvas;
	}
}

const ccm = CanvasContextManager.getInstance('canvas');
export const ctx = ccm.getContext();
export const canvas = ccm.getCanvas();
