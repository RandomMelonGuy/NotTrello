import { HeadFunc } from '../head';
declare type HeadTypes = {
    [type: string]: HeadFunc;
};
declare const TYPES: HeadTypes;
export default TYPES;
