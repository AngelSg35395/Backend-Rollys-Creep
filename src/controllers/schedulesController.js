import supabase from '../config/supabase.js'

/**
 * Create or update schedules
 * POST /schedules
 */
export const createOrUpdateSchedules = async (req, res) => {
    try {
        const { schedules } = req.body;

        if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
            return res.status(400).json({
                error: 'Must provide at least one schedule',
            });
        }

        const results = [];
        const errors = [];

        for (const schedule of schedules) {
            const { day, enabled, start_time, end_time } = schedule;

            // Prepare data to insert/update
            const scheduleData = {
                day,
                enabled,
                start_time: enabled ? start_time : null,
                end_time: enabled ? end_time : null,
            };

            try {
                // Check if the schedule already exists
                const { data: existingSchedule, error: fetchError } = await supabase
                    .from('schedules')
                    .select('*')
                    .eq('day', day)
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned (No rows were returned)
                    throw fetchError;
                }

                if (existingSchedule) {
                    // Update existing schedule
                    const { data, error } = await supabase
                        .from('schedules')
                        .update(scheduleData)
                        .eq('day', day)
                        .select()
                        .single();

                    if (error) {
                        errors.push({ day, error: error.message });
                    } else {
                        results.push(data);
                    }
                } else {
                    // Create new schedule
                    const { data, error } = await supabase
                        .from('schedules')
                        .insert([scheduleData])
                        .select()
                        .single();

                    if (error) {
                        errors.push({ day, error: error.message });
                    } else {
                        results.push(data);
                    }
                }
            } catch (err) {
                errors.push({ day, error: err.message });
            }
        }

        if (errors.length > 0 && results.length === 0) {
            return res.status(500).json({
                error: 'Error processing schedules',
                details: errors,
            });
        }

        if (errors.length > 0) {
            return res.status(207).json({ // 207 Multi-Status
                message: 'Some schedules were processed correctly',
                success: results,
                errors: errors,
            });
        }

        return res.status(200).json({
            message: 'Schedules created/updated successfully',
            schedules: results,
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Error processing schedules',
            description: err.message,
        });
    }
};

/**
 * Get all schedules
 * GET /schedules
 */
export const getAllSchedules = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .order('id');

        if (error) {
            return res.status(500).json({
                error: 'Error getting all schedules',
                description: error.message,
            });
        }

        return res.json(data);
    } catch (err) {
        return res.status(500).json({
            error: 'Error getting all schedules',
            description: err.message,
        });
    }
};

/**
 * Get schedule by day
 * GET /schedules/:day
 */
export const getScheduleByDay = async (req, res) => {
    try {
        const { day } = req.params;

        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .eq('day', day)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    error: `No schedule found for the day ${day}`,
                });
            }
            return res.status(500).json({
                error: 'Error getting schedule by day',
                description: error.message,
            });
        }

        return res.json(data);
    } catch (err) {
        return res.status(500).json({
            error: 'Error getting schedule by day',
            description: err.message,
        });
    }
};

/**
 * Update schedule by day
 * PUT /schedules/:day
 */
export const updateScheduleByDay = async (req, res) => {
    try {
        const { day } = req.params;
        const { enabled, start_time, end_time } = req.body;

        // Check if the schedule exists
        const { data: existingSchedule, error: fetchError } = await supabase
            .from('schedules')
            .select('*')
            .eq('day', day)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return res.status(404).json({
                    error: `No schedule found for the day ${day}`,
                });
            }
            return res.status(500).json({
                error: 'Error getting schedule by day',
                description: fetchError.message,
            });
        }

        // Prepare data to update
        const scheduleData = {
            enabled,
            start_time: enabled ? start_time : null,
            end_time: enabled ? end_time : null,
        };

        const { data, error } = await supabase
            .from('schedules')
            .update(scheduleData)
            .eq('day', day)
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                error: 'Error updating schedule by day',
                description: error.message,
            });
        }

        return res.json({
            message: 'Schedule updated successfully',
            schedule: data,
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Error updating schedule by day',
            description: err.message,
        });
    }
};

/**
 * Disable or delete schedule by day
 * DELETE /schedules/:day
 */
export const deleteScheduleByDay = async (req, res) => {
    try {
        const { day } = req.params;

        // Check if the schedule exists
        const { data: existingSchedule, error: fetchError } = await supabase
            .from('schedules')
            .select('*')
            .eq('day', day)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return res.status(404).json({
                    error: `No schedule found for the day ${day}`,
                });
            }
            return res.status(500).json({
                error: 'Error getting schedule by day',
                description: fetchError.message,
            });
        }

        // Delete the schedule
        const { error } = await supabase
            .from('schedules')
            .delete()
            .eq('day', day);

        if (error) {
            return res.status(500).json({
                error: 'Error deleting schedule by day',
                description: error.message,
            });
        }

        return res.json({
            message: `Schedule for the day ${day} deleted successfully`,
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Error deleting schedule by day',
            description: err.message,
        });
    }
};

