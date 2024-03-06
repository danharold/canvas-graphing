import { ViewTransform } from '../../utils/graphicsUtils';

export interface Drawable {
	draw(vt: ViewTransform): void;
}
