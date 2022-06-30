import path from 'path';
import {homedir} from 'os';
import User from './model/user';
import type {RawUser} from './types';

const USERS_DATA_PATH = path.resolve(homedir(), '.iot/users.json');

// eslint-disable-next-line import/no-dynamic-require
const users: Array<User> = Array.from(require(USERS_DATA_PATH))
    .map((rawUser: RawUser) => new User(rawUser));

export default users;
