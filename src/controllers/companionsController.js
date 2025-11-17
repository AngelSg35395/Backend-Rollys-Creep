import supabase from '../config/supabase.js'

export const getCompanions = async (req, res) => {
    const { data, error } = await supabase
        .from('companions')
        .select('*')
        .order('companion_id')

    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching companions' + error })
    }
    res.json(data)
}

export const editCompanion = async (req, res) => {
    const { id } = req.params
    const changes = req.body

    // Update companion
    const { data, error } = await supabase
        .from('companions')
        .update(changes)
        .eq('companion_id', id)

    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error updating companion' + error })
    }
    res.json({ message: 'Company updated successfully'})
}

export const deleteCompanion = async (req, res) => {
    const { id } = req.params

    // Delete companion
    const { data, error } = await supabase
        .from('companions')
        .delete()
        .eq('companion_id', id)

    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error deleting companion' + error })
    }
    res.json({ message: 'Company deleted successfully'})
}

export const addCompanion = async (req, res) => {
    const companion = req.body

    // Add companion to the database
    const { data, error } = await supabase
        .from('companions')
        .insert([companion])

    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error adding companion' + error.message })
    }
    res.json({ message: 'Company added successfully' })
}