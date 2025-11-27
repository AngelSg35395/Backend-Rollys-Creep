import supabase from '../config/supabase.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getAdministrators = async (req, res) => {
    const { data, error } = await supabase
        .from('administrators')
        .select('admin_code, account_name, created_at')
        .order('created_at')

    if (error) {
        res.status(500).json({ error: 'Error fetching administrators' + error })
    }
    res.json(data)
}

export const deleteAdministrator = async (req, res) => {
    const { admin_code } = req.params

    // Delete administrator
    const { data, error } = await supabase
        .from('administrators')
        .delete()
        .eq('admin_code', admin_code)

    if (error) {
        res.status(500).json({ error: 'Error deleting administrator' + error })
    }
    res.json({ message: 'Administrator deleted successfully'})
}

export const loginAdmin = async (req, res) => {
    const { account_name, account_password } = req.body;

    try {
        const { data: admin, error } = await supabase
            .from('administrators')
            .select("*")
            .eq("account_name", account_name)
            .maybeSingle();

        if (error || !admin) {
            return res.status(401).json({ error: "Invalid account name or password" });
        }

        const now = new Date();

        // check if account is blocked
        if (admin.blocked_until && new Date(admin.blocked_until) > now) {
            const remaining = Math.ceil(((new Date(admin.blocked_until) - now) / 60000) - 1);
            return res.status(403).json({
                error: `Too many failed attempts. Try again in ${remaining} minutes`
            })
        }

        // validate password
        const isValidPassword = await bcrypt.compare(account_password, admin.account_password);

        if (!isValidPassword) {
            const attempts = admin.login_attempts + 1;
            let blocked_until = null;

            if (attempts >= 5) {
                const minutes = (attempts - 4) * 5;
                blocked_until = new Date(Date.now() + minutes * 60000);
            }

            // update login attempts
            await supabase
                .from("administrators")
                .update({ 
                    login_attempts: attempts, 
                    last_attempt: now,
                    blocked_until: blocked_until })
                .eq("admin_code", admin.admin_code);
            
            return res.status(401).json({
                error: blocked_until
                    ? `Too many failed attempts. Try again in ${(Math.ceil((blocked_until - now) / 60000)) - 1} minutes`
                    : "Invalid account name or password"
            })
        } else {
            await supabase
                .from('administrators')
                .update({
                    login_attempts: 0,
                    blocked_until: null,
                    last_attempt: now
                })
                .eq('admin_code', admin.admin_code)

            // Create JWT
            const token = jwt.sign(
                { admin_code: admin.admin_code },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.json({ token, message: 'Login successful' })
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error logging in administrator: ' + error })
    }
};

export const logOutAdmin = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Decode token
    const decoded = jwt.decode(token);

    if (!decoded.admin_code) {
        return res.status(400).json({ error: 'Invalid token' });
    }

    const exp = decoded.exp * 1000;

    // Register in the database
    await supabase.from('revoked_tokens').insert({
        token,
        expires_at: new Date(exp)
    });

    return res.json({ message: 'Logout successful' });
}