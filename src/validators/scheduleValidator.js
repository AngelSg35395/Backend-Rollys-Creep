import { body, param } from "express-validator";

// Valid days
const VALID_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Validate time format HH:MM (24 hours)
const isValidTimeFormat = (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

// Validate that start_time < end_time
const validateTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return true; // If there are no hours, the validation is done in another place
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    
    return startTotal < endTotal;
};

// Validator to create/update schedules
export const scheduleValidatorPOST = [
    body("schedules")
        .isArray({ min: 1 })
        .withMessage("Debe proporcionar al menos un horario")
        .custom((schedules) => {
            if (!Array.isArray(schedules)) {
                throw new Error("schedules debe ser un array");
            }

            // Validate each schedule in the array
            for (let i = 0; i < schedules.length; i++) {
                const schedule = schedules[i];
                
                // Validate day
                if (!schedule.day || !VALID_DAYS.includes(schedule.day)) {
                    throw new Error(`El día en el índice ${i} debe ser uno de: ${VALID_DAYS.join(', ')}`);
                }

                // Validate enabled
                if (typeof schedule.enabled !== 'boolean') {
                    throw new Error(`El campo enabled en el índice ${i} debe ser un booleano`);
                }

                // If enabled is true, validate hours
                if (schedule.enabled === true) {
                    // Validate start_time
                    if (!schedule.start_time) {
                        throw new Error(`start_time es requerido cuando enabled es true (índice ${i})`);
                    }
                    if (!isValidTimeFormat(schedule.start_time)) {
                        throw new Error(`start_time en el índice ${i} debe tener formato HH:MM (24 horas)`);
                    }

                    // Validate end_time
                    if (!schedule.end_time) {
                        throw new Error(`end_time es requerido cuando enabled es true (índice ${i})`);
                    }
                    if (!isValidTimeFormat(schedule.end_time)) {
                        throw new Error(`end_time en el índice ${i} debe tener formato HH:MM (24 horas)`);
                    }

                    // Validate that start_time < end_time
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

// Validator to update a specific day
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
            // If enabled is false, start_time is not required
            if (req.body.enabled === false) {
                return true;
            }
            
            // If enabled is true, start_time is required
            if (!value) {
                throw new Error("start_time es requerido cuando enabled es true");
            }
            
            // Validate format
            if (!isValidTimeFormat(value)) {
                throw new Error("start_time debe tener formato HH:MM (24 horas)");
            }
            
            return true;
        }),
    body("end_time")
        .optional({ nullable: true })
        .custom((value, { req }) => {
            // If enabled is false, end_time is not required
            if (req.body.enabled === false) {
                return true;
            }
            
            // If enabled is true, end_time is required
            if (!value) {
                throw new Error("end_time es requerido cuando enabled es true");
            }
            
            // Validate format
            if (!isValidTimeFormat(value)) {
                throw new Error("end_time debe tener formato HH:MM (24 horas)");
            }
            
            // Validate that start_time < end_time
            if (req.body.start_time && value) {
                if (!validateTimeRange(req.body.start_time, value)) {
                    throw new Error("start_time debe ser menor que end_time");
                }
            }
            
            return true;
        }),
];

// Validator to get/delete a specific day
export const scheduleValidatorDay = [
    param("day")
        .isString()
        .trim()
        .isIn(VALID_DAYS)
        .withMessage(`El día debe ser uno de: ${VALID_DAYS.join(', ')}`),
];

