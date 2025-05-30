import { AnchorWithPoint } from './anchor';
import { Point } from './point';
import { Size } from './size';
export declare type Container = {
    position: Point;
    relativeFrom: AnchorWithPoint;
    relativeTo: AnchorWithPoint;
    size: Size;
};
export declare const produceContainer: (from: AnchorWithPoint, to: AnchorWithPoint, padding: Size) => Container;
