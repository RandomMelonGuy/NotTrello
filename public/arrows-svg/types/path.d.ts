import { Container } from './container';
import { Point } from './point';
import { Size } from './size';
export declare type Path = Point[];
export declare const convertPathToSVG: (path: Path) => string;
export declare const pathReducer: (path: Path, reducer: (prev: Point, curr: Point) => Point) => Point;
export declare const pathListBezier: (container: Container, padding: Size) => Path;
