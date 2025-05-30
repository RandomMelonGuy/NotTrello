import { Anchor } from '../anchor';
declare type Observer = (from: Anchor, to: Anchor, options: {
    update: () => void;
    updateDelay?: number;
}) => {
    clear: () => void;
};
declare const observer: Observer;
export default observer;
