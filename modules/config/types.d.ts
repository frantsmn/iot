declare enum RuleMethods {
    // DEVICE = 'device',
    SCHEDULE = 'schedule',
    CRON = 'cron',
}

declare enum MobileDeviceStatus {
    DISCONNECTED = 'disconnected',
    CONNECTED = 'connected',
    ANY = 'any',
}

export interface RuleColor {
    r: number,
    g: number,
    b: number,
}

export type RuleAction = 'on' | 'off' | 'toggle' | 'rgb' | 'data';

export interface RuleSchedule {
    hour?: number,
    minute?: number,
    dayOfWeek?: number[],
}

export interface Rule {
    method: RuleMethods,
    action: RuleAction,
    iotDevice: string,
    mobileDeviceStatus: MobileDeviceStatus,
    schedule?: RuleSchedule | RuleSchedule[],
    cron?: string,
    data?: RuleColor | Object
}
