import users from '../modules/user/index';
import User from '../modules/user/model/user';

// eslint-disable-next-line consistent-return
export default (req, res, next): void => {
    // check for basic auth header
    if (!req.headers.authorization) {
        return res.status(401).json({message: 'Missing Authorization Header'});
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [login, password] = credentials.split(':');
    const user = User.isArrayContainUser(users, {login, password});
    if (!user) {
        return res.status(401).json({message: 'Invalid Authentication Credentials'});
    }

    // attach user to request object
    // req.user = user

    next();
};
