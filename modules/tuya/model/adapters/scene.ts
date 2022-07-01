import rgbToHsv from 'rgb-hsv';
import convertHsvColorToTuyaHsvString from '../helpers/convertHsvColorToTuyaHsvString';

export interface SceneConfig {
    white: number, // [0..100]
    temperature: number, // [0..100]
    color: {
        r: number, // [0..255]
        g: number, // [0..255]
        b: number, // [0..255]
    },
    switch: 'static' | 'jump' | 'gradient'
}

const switchMap = {
    static: '00',
    jump: '01',
    gradient: '02',
};

const formatLightValue = (num) => {
    if (num.toString().length >= 4) {
        return '1000';
    }

    return (`000${num.toString()}`).slice(-4);
};

const formatColorValue = ({r, g, b}) => {
    const [h, s, v] = rgbToHsv(r, g, b);

    return convertHsvColorToTuyaHsvString({h, s, v});
};

/**
 *
 * @param {SceneConfig} data
 */
export default function sceneAdapter(data: SceneConfig) {
    const switchMethod = switchMap[data.switch];
    const white = formatLightValue(data.white * 10);
    const temperature = formatLightValue(data.temperature * 10);
    const color = formatColorValue(data.color);

    return {
        21: 'scene',
        25: `000000${switchMethod}${color}${white}${temperature}`,
    };
}
