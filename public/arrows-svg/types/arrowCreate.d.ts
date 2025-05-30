/// <reference types="react" />
import { IArrow, IArrowProps, IArrowComponentProps } from './interfaces/IArrow';
export declare const Arrow: ({ className, head, from, to, forwardRef, updateDelay, }: IArrowComponentProps) => JSX.Element;
declare const arrowCreate: ({ className, head, from, to, updateDelay, }: IArrowProps) => IArrow;
export default arrowCreate;
