import jwt from "jsonwebtoken";

export const generateOrderToken = (req, res) => {
    try {
        const payload = {
            type: "order",
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET,
            {expiresIn: "30s"}
        );

        return res.status(200).json({token});
    } catch (error) {
        return res.status(500).json({error: "Error al generar token"});
    }
};