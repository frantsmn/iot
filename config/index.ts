import path from "path";
import schedule from 'node-schedule'
import {tuyaDeviceController} from "../controller";
import {userDeviceController} from "../controller";
import loggerCreator from "../logger"

const log = loggerCreator('config');

enum RuleMethods {
    // DEVICE = 'device',
    SCHEDULE = 'schedule',
    CRON = 'cron',
}

enum MobileDeviceStatus {
    DISCONNECTED = 0,
    CONNECTED = 1,
    ANY = 2,
}

interface RuleColor {
    r: number,
    g: number,
    b: number,
}

type RuleAction = 'on' | 'off' | 'toggle' | 'rgb' | 'data';

interface RuleSchedule {
    hour?: number,
    minute?: number,
    dayOfWeek?: number[],
}

interface Rule {
    method: RuleMethods,
    action: RuleAction,
    iotDevice: string,
    mobileDeviceStatus: MobileDeviceStatus,
    schedule?: RuleSchedule | RuleSchedule[],
    cron?: string,
    data?: RuleColor | Object
}

const CONFIG_PATH = path.resolve(require('os').homedir(), '.iot/rules.json');


class Config {
    rules: Array<Rule>
    jobs: Array<Object | void>

    constructor() {
        this.rules = Array.from(require(CONFIG_PATH));
        this.jobs = this.rules.map((rule) => this.handleRule(rule));
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
        return schedule.scheduleJob(rule.schedule, this.getJobFunc(rule));
    }

    getJobFunc(rule: Rule) {
        return async () => {
            if (rule.mobileDeviceStatus !== MobileDeviceStatus.ANY) {
                if (userDeviceController.isAnyDeviceConnected === Boolean(rule.mobileDeviceStatus)) {
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
        }
    }
}

new Config();
