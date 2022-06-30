export interface RawTuyaDevice {
    type: 'bulb' | 'plug'
    id: number
    key: number
    name: string
}

export type RgbColor = {
    r: number,
    g: number,
    b: number,
};

export type HsvColor = {
    h: number,
    s: number,
    v: number,
};

export interface RawTuyaDevice {
    type: 'bulb' | 'plug'
    id: number
    key: number
    name: string
}
