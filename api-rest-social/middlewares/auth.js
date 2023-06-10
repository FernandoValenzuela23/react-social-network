const { response } = require("express");
const jwt = require("jwt-simple");
const moment = require('moment')
const appJwt = require('../helpers/jwt')

const secret = appJwt.secret;

exports.auth = async (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).json({
            status: 'error',
            message: 'Cabecera sin authenticacion'
        });
    }

    // Limpiar el token de comillas simples o dobles
    let token = req.headers.authorization.replace(/['"']+/g, '');

    try {
        let payload = await jwt.decode(token, secret);
        
        if(payload.exp <= moment().unix()) {
            return res.status(401).json({
                status: 'error',
                message: 'Token expirado'
            });
        }

        req.user = payload;

    } catch(err) {
        return res.status(404).json({
            status: 'error',
            message: err.message
        });
    }
    
    next();
}
