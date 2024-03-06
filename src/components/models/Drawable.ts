import { ViewTransform } from '../../utils/utils';

export interface Drawable {
	repr: string;

	draw(vt: ViewTransform): void;
}
