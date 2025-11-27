import supabase from '../config/supabase.js'

export const getCompanions = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('companions')
            .select('*')
            .order('companion_id')

        if (error) {
            return res.status(500).json({
                error: 'Failed to fetch companions',
                description: error.message,
            })
        }
        return res.json(data)
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to fetch companions',
            description: err.message,
        })
    }
}

export const editCompanion = async (req, res) => {
    const { id } = req.params
    const changes = req.body

    try {
        const { error } = await supabase
            .from('companions')
            .update(changes)
            .eq('companion_id', id)

        if (error) {
            return res.status(500).json({
                error: 'Failed to update companion',
                description: error.message,
            })
        }
        return res.json({ message: 'Companion updated successfully'})
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to update companion',
            description: err.message,
        })
    }
}

export const deleteCompanion = async (req, res) => {
    const { id } = req.params

    try {
        const { error } = await supabase
            .from('companions')
            .delete()
            .eq('companion_id', id)

        if (error) {
            return res.status(500).json({
                error: 'Failed to delete companion',
                description: error.message,
            })
        }
        return res.json({ message: 'Companion deleted successfully'})
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to delete companion',
            description: err.message,
        })
    }
}

export const addCompanion = async (req, res) => {
    const companion = req.body

    try {
        const { error } = await supabase
            .from('companions')
            .insert([companion])

        if (error) {
            return res.status(500).json({
                error: 'Failed to add companion',
                description: error.message,
            })
        }
        return res.status(201).json({ message: 'Companion added successfully' })
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to add companion',
            description: err.message,
        })
    }
}