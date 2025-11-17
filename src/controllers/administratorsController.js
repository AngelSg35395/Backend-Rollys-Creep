import supabase from '../config/supabase.js'

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