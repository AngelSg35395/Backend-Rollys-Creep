import { body, param } from "express-validator";

// Días permitidos
const VALID_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Validar formato de hora HH:MM (24 horas)
const isValidTimeFormat = (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

// Validar que start_time < end_time
const validateTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return true; // Si no hay horas, la validación se hace en otro lugar
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    
    return startTotal < endTotal;
};

// Validador para crear/actualizar horarios de la semana
export const scheduleValidatorPOST = [
    body("schedules")
        .isArray({ min: 1 })
        .withMessage("Debe proporcionar al menos un horario")
        .custom((schedules) => {
            // Validar que todos los horarios tengan la estructura correcta
            if (!Array.isArray(schedules)) {
                throw new Error("schedules debe ser un array");
            }

            // Validar cada horario del array
            for (let i = 0; i < schedules.length; i++) {
                const schedule = schedules[i];
                
                // Validar día
                if (!schedule.day || !VALID_DAYS.includes(schedule.day)) {
                    throw new Error(`El día en el índice ${i} debe ser uno de: ${VALID_DAYS.join(', ')}`);
                }

                // Validar enabled
                if (typeof schedule.enabled !== 'boolean') {
                    throw new Error(`El campo enabled en el índice ${i} debe ser un booleano`);
                }

                // Si enabled es true, validar horas
                if (schedule.enabled === true) {
                    // Validar start_time
                    if (!schedule.start_time) {
                        throw new Error(`start_time es requerido cuando enabled es true (índice ${i})`);
                    }
                    if (!isValidTimeFormat(schedule.start_time)) {
                        throw new Error(`start_time en el índice ${i} debe tener formato HH:MM (24 horas)`);
                    }

                    // Validar end_time
                    if (!schedule.end_time) {
                        throw new Error(`end_time es requerido cuando enabled es true (índice ${i})`);
                    }
                    if (!isValidTimeFormat(schedule.end_time)) {
                        throw new Error(`end_time en el índice ${i} debe tener formato HH:MM (24 horas)`);
                    }

                    // Validar que start_time < end_time
                    if (!validateTimeRange(schedule.start_time, schedule.end_time)) {
                        throw new Error(`start_time debe ser menor que end_time (índice ${i})`);
                    }
                }
            }

            return true;
        }),
    body("schedules.*.day")
        .isString()
        .trim()
        .notEmpty()
        .isIn(VALID_DAYS)
        .withMessage(`El día debe ser uno de: ${VALID_DAYS.join(', ')}`),
    body("schedules.*.enabled")
        .isBoolean()
        .withMessage("El campo enabled debe ser un booleano"),
];

// Validador para actualizar un día específico
export const scheduleValidatorPUT = [
    param("day")
        .isString()
        .trim()
        .isIn(VALID_DAYS)
        .withMessage(`El día debe ser uno de: ${VALID_DAYS.join(', ')}`),
    body("enabled")
        .isBoolean()
        .withMessage("El campo enabled debe ser un booleano"),
    body("start_time")
        .optional({ nullable: true })
        .custom((value, { req }) => {
            // Si enabled es false, no se requiere start_time
            if (req.body.enabled === false) {
                return true;
            }
            
            // Si enabled es true, start_time es requerido
            if (!value) {
                throw new Error("start_time es requerido cuando enabled es true");
            }
            
            // Validar formato
            if (!isValidTimeFormat(value)) {
                throw new Error("start_time debe tener formato HH:MM (24 horas)");
            }
            
            return true;
        }),
    body("end_time")
        .optional({ nullable: true })
        .custom((value, { req }) => {
            // Si enabled es false, no se requiere end_time
            if (req.body.enabled === false) {
                return true;
            }
            
            // Si enabled es true, end_time es requerido
            if (!value) {
                throw new Error("end_time es requerido cuando enabled es true");
            }
            
            // Validar formato
            if (!isValidTimeFormat(value)) {
                throw new Error("end_time debe tener formato HH:MM (24 horas)");
            }
            
            // Validar que start_time < end_time
            if (req.body.start_time && value) {
                if (!validateTimeRange(req.body.start_time, value)) {
                    throw new Error("start_time debe ser menor que end_time");
                }
            }
            
            return true;
        }),
];

// Validador para obtener/eliminar un día específico
export const scheduleValidatorDay = [
    param("day")
        .isString()
        .trim()
        .isIn(VALID_DAYS)
        .withMessage(`El día debe ser uno de: ${VALID_DAYS.join(', ')}`),
];

