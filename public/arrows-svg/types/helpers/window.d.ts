import { IArrow, IArrowProps } from '../interfaces/IArrow';
declare global {
    interface Window {
        arrowCreate: (props: IArrowProps) => IArrow;
    }
}
export declare const assignArrowCreate: (customWindow: Window) => void;
