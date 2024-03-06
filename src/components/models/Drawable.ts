import { ViewTransform } from '../../utils/utils';

export interface Drawable {
	repr: string;
	colour: string;
	draw(vt: ViewTransform): void;
}
