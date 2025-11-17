const allowedOrigins = [
    "https://test-six-omega-10.vercel.app",
]

export function securityOrigin(req, res, next) {
    const origin = req.headers.origin

    // if origin is null, return
    if (!origin) {
        return res.status(403).json({ error: "Forbidden: Origin missing" });
    }

    // if origin is not allowed, return
    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: "Forbidden: Origin not allowed" });
    }

    next();
}