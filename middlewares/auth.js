const jwt = require('jsonwebtoken');
const { secret } = require('../config');

// Checking token middleware
function auth(req, res, next) {
  if (req.headers.authorization) {
    const [prefix, token] = req.headers.authorization.split(' ');

    if (prefix === 'Bearer') {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token.',
          });
        }
  
        req.decoded = decoded;
        return next();
      });
    }
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided',
    });
  }
}

module.exports = auth;
