import path from 'path'

interface User {
    login: string
    password: string
}

const USERS_DATA_PATH = path.resolve(require('os').homedir(), '.iot/users.json');

class Users {
    users: Array<User>

    constructor(path) {
        this.users = Array.from(require(path));
    }

    findUser({login, password}) {
        return this.users.find(user => (
                user.login === login
                && user.password === password
            )
        );
    }
}

export default new Users(USERS_DATA_PATH);
