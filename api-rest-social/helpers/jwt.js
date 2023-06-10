const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_JWT_KEY = 'Fernand0$123';

const generateJWT = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        uat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, SECRET_JWT_KEY);
}

module.exports = { generateJWT, secret: SECRET_JWT_KEY }