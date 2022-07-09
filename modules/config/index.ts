import {homedir} from 'os';
import path from 'path';
import schedule from 'node-schedule';
import tuyaDeviceController from '../tuya';
import userDevicesController from '../userDevice';
import loggerCreator from '../logger';
import type {Rule} from './types';

enum MobileDeviceStatus {
    DISCONNECTED = 'disconnected',
    CONNECTED = 'connected',
    ANY = 'any',
}

enum RuleMethods {
    // DEVICE = 'device',
    SCHEDULE = 'schedule',
    CRON = 'cron',
}

const log = loggerCreator('config');
const CONFIG_PATH = path.resolve(homedir(), '.iot/rules.json');

class Config {
    rules: Array<Rule>;
    jobs: Array<Object | void>;
    private readonly mobileDeviceStatusMap: { connected: boolean; disconnected: boolean };

    constructor() {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        this.rules = Array.from(require(CONFIG_PATH));
        this.jobs = this.rules.map((rule) => this.handleRule(rule));
        this.mobileDeviceStatusMap = {
            disconnected: false,
            connected: true,
        };
    }

    handleRule(rule: Rule) {
        switch (rule.method) {
            case RuleMethods.CRON: {
                this.createCronJob(rule);
                break;
            }
            case RuleMethods.SCHEDULE: {
                this.createScheduleJob(rule);
                break;
            }
            default:
                break;
        }
    }

    createCronJob(rule: Rule) {
        return schedule.scheduleJob(rule.cron, this.getJobFunc(rule));
    }

    createScheduleJob(rule: Rule) {
        // @ts-ignore
        return schedule.scheduleJob(rule.schedule, this.getJobFunc(rule));
    }

    // eslint-disable-next-line class-methods-use-this
    getJobFunc({
        title,
        mobileDeviceStatus,
        iotDevice,
        action,
        data,
    }: Rule): () => Promise<void> {
        return async () => {
            switch (mobileDeviceStatus) {
                case MobileDeviceStatus.CONNECTED: {
                    if (userDevicesController.isAnyDeviceConnected) {
                        await tuyaDeviceController.action(iotDevice, action, data);
                        log.info(title);
                    }
                    break;
                }
                case MobileDeviceStatus.DISCONNECTED: {
                    if (!userDevicesController.isAnyDeviceConnected) {
                        await tuyaDeviceController.action(iotDevice, action, data);
                        log.info(title);
                    }
                    break;
                }
                default: {
                    await tuyaDeviceController.action(iotDevice, action, data);
                    log.info(title);
                    break;
                }
            }
        };
    }
}

const config = new Config();

export default config;
