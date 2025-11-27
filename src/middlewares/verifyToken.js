import jwt from 'jsonwebtoken'
import supabase from '../config/supabase.js'

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const { data: revoked, error: revokedError } = await supabase
            .from('revoked_tokens')
            .select('*')
            .eq('token', token)
            .maybeSingle()

        if (revokedError) {
            return res.status(500).json({ error: 'Failed to validate token status', description: revokedError.message })
        }

        if (revoked) {
            return res.status(401).json({ error: 'Token revoked' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.admin = decoded
        return next()
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' })
    }
}