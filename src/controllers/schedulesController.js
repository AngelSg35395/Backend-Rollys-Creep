import supabase from '../config/supabase.js'

/**
 * Crear o actualizar horarios de la semana
 * POST /schedules
 */
export const createOrUpdateSchedules = async (req, res) => {
    try {
        const { schedules } = req.body;

        if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
            return res.status(400).json({
                error: 'Debe proporcionar al menos un horario',
            });
        }

        const results = [];
        const errors = [];

        for (const schedule of schedules) {
            const { day, enabled, start_time, end_time } = schedule;

            // Preparar datos para insertar/actualizar
            const scheduleData = {
                day,
                enabled,
                start_time: enabled ? start_time : null,
                end_time: enabled ? end_time : null,
            };

            try {
                // Verificar si el horario ya existe
                const { data: existingSchedule, error: fetchError } = await supabase
                    .from('schedules')
                    .select('*')
                    .eq('day', day)
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
                    throw fetchError;
                }

                if (existingSchedule) {
                    // Actualizar horario existente
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
                    // Crear nuevo horario
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
                error: 'Error al procesar los horarios',
                details: errors,
            });
        }

        if (errors.length > 0) {
            return res.status(207).json({ // 207 Multi-Status
                message: 'Algunos horarios se procesaron correctamente',
                success: results,
                errors: errors,
            });
        }

        return res.status(200).json({
            message: 'Horarios creados/actualizados exitosamente',
            schedules: results,
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Error al procesar los horarios',
            description: err.message,
        });
    }
};

/**
 * Obtener todos los horarios configurados
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
                error: 'Error al obtener los horarios',
                description: error.message,
            });
        }

        return res.json(data);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener los horarios',
            description: err.message,
        });
    }
};

/**
 * Obtener el horario de un día específico
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
                    error: `No se encontró horario para el día ${day}`,
                });
            }
            return res.status(500).json({
                error: 'Error al obtener el horario',
                description: error.message,
            });
        }

        return res.json(data);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener el horario',
            description: err.message,
        });
    }
};

/**
 * Actualizar el horario de un día específico
 * PUT /schedules/:day
 */
export const updateScheduleByDay = async (req, res) => {
    try {
        const { day } = req.params;
        const { enabled, start_time, end_time } = req.body;

        // Verificar si el horario existe
        const { data: existingSchedule, error: fetchError } = await supabase
            .from('schedules')
            .select('*')
            .eq('day', day)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return res.status(404).json({
                    error: `No se encontró horario para el día ${day}`,
                });
            }
            return res.status(500).json({
                error: 'Error al buscar el horario',
                description: fetchError.message,
            });
        }

        // Preparar datos para actualizar
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
                error: 'Error al actualizar el horario',
                description: error.message,
            });
        }

        return res.json({
            message: 'Horario actualizado exitosamente',
            schedule: data,
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Error al actualizar el horario',
            description: err.message,
        });
    }
};

/**
 * Deshabilitar o eliminar el horario de un día
 * DELETE /schedules/:day
 */
export const deleteScheduleByDay = async (req, res) => {
    try {
        const { day } = req.params;

        // Verificar si el horario existe
        const { data: existingSchedule, error: fetchError } = await supabase
            .from('schedules')
            .select('*')
            .eq('day', day)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return res.status(404).json({
                    error: `No se encontró horario para el día ${day}`,
                });
            }
            return res.status(500).json({
                error: 'Error al buscar el horario',
                description: fetchError.message,
            });
        }

        // Eliminar el horario
        const { error } = await supabase
            .from('schedules')
            .delete()
            .eq('day', day);

        if (error) {
            return res.status(500).json({
                error: 'Error al eliminar el horario',
                description: error.message,
            });
        }

        return res.json({
            message: `Horario del día ${day} eliminado exitosamente`,
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Error al eliminar el horario',
            description: err.message,
        });
    }
};

