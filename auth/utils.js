const jwt = require("jsonwebtoken");

const signatureAccess = process.env.SIGNATURE_ACCESS;
const signatureRefresh = process.env.SIGNATURE_REFRESH;

const accessTokenAge = 60*60; //s
const refreshTokenAge = 24* 60 * 60; //s (1h)

const verifyAuthorizationMiddleware = (req, res, next) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : "";

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, signatureAccess);
        req.user = decoded;
    } catch (err) {
        return res.sendStatus(401);
    }
    return next();
};

const verifyRefreshTokenMiddleware = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(refreshToken, signatureRefresh);
        req.user = decoded;
    } catch (err) {
        return res.sendStatus(401);
    }
    return next();
};

const getTokens = (login) => ({
    accessToken: jwt.sign({ login }, signatureAccess, {
        expiresIn: `${accessTokenAge}s`,
    }),
    refreshToken: jwt.sign({ login }, signatureRefresh, {
        expiresIn: `${refreshTokenAge}s`,
    }),
});

module.exports = {
    getTokens,
    accessTokenAge,
    refreshTokenAge,
    verifyAuthorizationMiddleware,
    verifyRefreshTokenMiddleware,
};
