const jwt = require('jsonwebtoken');
const checkAuth = (req, res, next) => { // next - tell us if the user is logged in and he can move to the next function, or Not!

    try {
        // 'Bearer eyJhbGciOiJI' we need the tokens without the Bearer.
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY); // verifi the token with our key
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed'
        })
    }


}

module.exports = checkAuth;