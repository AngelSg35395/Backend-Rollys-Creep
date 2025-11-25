export const checkOrderKey = (req, res, next) => {
    const clientKey = req.headers['x-order-key'];

    if (!clientKey) {
        return res.status(401).json({ error: "Missing order key" });
    }

    if (clientKey !== process.env.ORDER_KEY) {
        return res.status(403).json({ error: "Invalid order key" });
    }

    next();
};