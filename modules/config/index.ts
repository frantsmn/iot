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
        this.rules = Array.from(require(CONFIG_PATH));
        this.jobs = this.rules.map((rule) => this.handleRule(rule));
        this.mobileDeviceStatusMap = {
            disconnected: false,
            connected: true,
        };
    }

    handleRule(rule: Rule) {
        switch (rule.method) {
            case RuleMethods.CRON:
                this.createCronJob(rule);
                break;
            case RuleMethods.SCHEDULE:
                this.createScheduleJob(rule);
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

    getJobFunc(rule: Rule) {
        return async () => {
            if (rule.mobileDeviceStatus !== MobileDeviceStatus.ANY) {
                if (userDevicesController.isAnyDeviceConnected === this.mobileDeviceStatusMap[rule.mobileDeviceStatus]) {
                    log.info(`${rule.action} <${rule.iotDevice}> по правилу`);
                    // todo человекопонятные логи
                    console.log(rule);
                    await tuyaDeviceController.action(rule.iotDevice, rule.action, rule.data);
                }
            } else {
                log.info(`${rule.action} <${rule.iotDevice}> по правилу`);
                // todo человекопонятные логи
                console.log(rule);
                await tuyaDeviceController.action(rule.iotDevice, rule.action, rule.data);
            }
        };
    }
}

new Config();