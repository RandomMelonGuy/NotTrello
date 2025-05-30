import { Point, PointArray } from './point';
export declare type Anchor = {
    node: HTMLElement | (() => HTMLElement);
    direction?: string;
    translation?: PointArray;
};
export declare type AnchorWithPoint = Anchor & Point;
export declare const castToAnchor: (anchorParam: Anchor | HTMLElement | (() => HTMLElement)) => Anchor;
export declare const createAnchorWithPoint: (anchorParam: Anchor | HTMLElement | (() => HTMLElement)) => AnchorWithPoint;
export declare const autoAnchorWithPoint: (pointA: AnchorWithPoint, pointB: AnchorWithPoint) => AnchorWithPoint;
