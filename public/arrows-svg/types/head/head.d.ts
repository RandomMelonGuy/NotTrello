import { ComponentChild } from 'preact';
import { Path } from '../path';
import { Point } from '../point';
import { Size } from '../size';
export declare type Head = {
    id?: number;
    node?: ComponentChild;
    distance?: number;
    height?: number;
    width?: number;
    degree?: number;
    radius?: number;
};
export declare type HeadFunc = (params: any) => Head;
export declare type HeadFactory = {
    func: HeadFactory;
    [key: string]: any;
} | HeadFunc | string;
export declare type HeadFactoryList = HeadFactory[];
export declare type HeadWithPoint = Head & Point;
export declare const prepareHeadNode: (head: HeadFactory) => Head;
export declare const prepareHeads: (headFactory: HeadFactory | HeadFactoryList) => Head[];
export declare const calculateHeadsPadding: (heads: Head[]) => Size;
export declare const assignPathToHeads: (heads: Head[], path: Path) => HeadWithPoint[];
export declare const headTransformCSS: (head: HeadWithPoint) => string;
