import { AnchorWithPoint } from './anchor';
import { Size } from './size';
export declare type Point = {
    x: number;
    y: number;
};
export declare type PointArray = [number, number];
export declare const pointToArray: (point: Point) => PointArray;
export declare const pointBezier: (point: AnchorWithPoint, containerVisibleSize: Size) => Point;
export declare const pointSubtraction: (point: AnchorWithPoint, subtrahend: Point) => AnchorWithPoint;
