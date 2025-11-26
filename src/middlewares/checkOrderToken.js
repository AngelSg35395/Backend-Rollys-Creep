import jwt from "jsonwebtoken";

export const checkOrderToken = (req, res, next) => {
    const token = req.headers["x-order-key"];

    if (!token) {
        return res.status(401).json({ error: "Missing order token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== "order") {
            return res.status(403).json({ error: "Invalid token type" });
        }

        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};