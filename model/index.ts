import path from 'path'
import TuyaDevice from './tuya-device'
import UserDevice from './user-device'
import User from './user'

interface RawTuyaDevice {
    id: number
    key: number
    name: string
}

interface RawUserDevice {
    name: string
    mac_wifi: string
    mac_bluetooth?: string
    ip: string
}

interface RawUser {
    login: string
    password: string
}

const TUYA_DEVICES_PATH = path.resolve(require('os').homedir(), '.iot/tuya-devices.json');
const USER_DEVICES_PATH = path.resolve(require('os').homedir(), '.iot/user-devices.json');
const USERS_DATA_PATH = path.resolve(require('os').homedir(), '.iot/users.json');

export const tuyaDevices: Array<TuyaDevice> =
    Array.from(require(TUYA_DEVICES_PATH))
        .map((rawTuyaDevice: RawTuyaDevice) => new TuyaDevice(rawTuyaDevice));

export const userDevices: Array<UserDevice> =
    Array.from(require(USER_DEVICES_PATH))
        .map((rawUserDevice: RawUserDevice) => new UserDevice(rawUserDevice));

export const users: Array<User> =
    Array.from(require(USERS_DATA_PATH))
        .map((rawUser: RawUser) => new User(rawUser));
