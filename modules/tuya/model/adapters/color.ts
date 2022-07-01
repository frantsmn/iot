import rgbToHsv from 'rgb-hsv';
import convertHsvColorToTuyaHsvString from '../helpers/convertHsvColorToTuyaHsvString';

export interface RGBColor {
    r: number, // [0..255]
    g: number, // [0..255]
    b: number, // [0..255]
}

export default function colorAdapter({r, g, b}: RGBColor) {
    const [h, s, v] = rgbToHsv(r, g, b);

    return {
        21: 'colour',
        24: `${convertHsvColorToTuyaHsvString({h, s, v})}`,
    };
}
