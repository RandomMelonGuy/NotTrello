import { Head } from '../head';
declare const image: ({ src, width, height }: {
    src: string;
    width: number;
    height: number;
}) => Head;
export default image;
