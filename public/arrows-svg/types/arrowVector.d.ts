import { Anchor } from './anchor';
import { HeadFactory, HeadFactoryList, HeadWithPoint } from './head';
import { Point } from './point';
import { Size } from './size';
export declare type ArrowVector = {
    pathCommands: string;
    size: Size;
    offset: Point;
    heads: HeadWithPoint[];
};
declare const arrowVector: (from: Anchor, to: Anchor, headFactory: HeadFactory | HeadFactoryList) => ArrowVector;
export default arrowVector;
