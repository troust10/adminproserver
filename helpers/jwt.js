const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {
        const payload = {
            uid
        }

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.error('ERROR GENERANDO TOKEN')
                reject('ERROR GENERANDO TOKEN')
            }
            else {
                resolve(token);
            }
        });

    });
}

module.exports = { generarJWT }