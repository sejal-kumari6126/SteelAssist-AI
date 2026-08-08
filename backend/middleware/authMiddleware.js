const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                message: "Access Denied. No token provided"
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : authHeader;

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verified;

        next();

    } catch (err) {
        console.error("JWT ERROR:", err.message);

        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};

module.exports = authMiddleware;