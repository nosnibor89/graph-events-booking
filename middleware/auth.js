const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        req.isAuthenticated = false;
        return next();
    }

    const [, token]  = authHeader.split(' ');

    if(!token || token === ''){
        req.isAuthenticated = false;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            req.isAuthenticated = false;
            return next();
        }

        req.isAuthenticated = true;
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        req.isAuthenticated = false;
        return next();
    }
}