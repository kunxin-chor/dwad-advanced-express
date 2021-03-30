const jwt = require('jsonwebtoken');

// Register Check if Authenticated middleware
const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("error_messages", "You need to sign in to access this page");
        res.redirect('/users/login');
    }
}

const checkIfAuthenticatedJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    checkIfAuthenticated, checkIfAuthenticatedJWT
}