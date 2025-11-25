import supabase from '../config/supabase.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getAdministrators = async (req, res) => {
    const { data, error } = await supabase
        .from('administrators')
        .select('admin_code, account_name, created_at')
        .order('created_at')

    if (error) {
        console.log(error)
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
        console.log(error)
        res.status(500).json({ error: 'Error deleting administrator' + error })
    }
    res.json({ message: 'Administrator deleted successfully'})
}

export const loginAdmin = async (req, res) => {
    const { account_name, account_password } = req.body

    try {
        // Search for account_name in the database
        const { data, error } = await supabase
            .from('administrators')
            .select('*')
            .eq('account_name', account_name)
            .single()

        if (error || !data) {
            console.log(error)
            return res.status(401).json({ error: 'Invalid account name or password' })
        }

        // Check if password is correct
        const isValidPassword = await bcrypt.compare(account_password, data.account_password)
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid account name or password' })
        }

        // Create JWT
        const token = jwt.sign(
            { admin_code: data.admin_code },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res.json({ token, message: 'Login successful' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Error logging in administrator: ' + err })
    }
}