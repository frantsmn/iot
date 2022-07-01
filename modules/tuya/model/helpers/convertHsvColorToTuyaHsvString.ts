type HsvColor = {
    h: number,
    s: number,
    v: number,
};

export default function convertHsvColorToTuyaHsvString(hsvColor: HsvColor): String {
    const tuyaH = hsvColor.h.toString(16).padStart(4, '0');
    const tuyaS = (10 * hsvColor.s).toString(16).padStart(4, '0');
    const tuyaV = (10 * hsvColor.v).toString(16).padStart(4, '0');

    return tuyaH + tuyaS + tuyaV;
}
