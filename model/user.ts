interface RawUser {
    login: string
    password: string
}

export default class User {
    login: string
    password: string

    constructor(rawUser: RawUser) {
        this.login = rawUser.login;
        this.password = rawUser.password;
    }

    static isArrayContainUser(array: Array<User>, {login, password}: RawUser) {
        return Boolean(array.find(user => (
                user.login === login
                && user.password === password
            )
        ));
    }
}
