import express from 'express'
import { validationResultHandler } from '../middlewares/validationResult.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import {
    scheduleValidatorPOST,
    scheduleValidatorPUT,
    scheduleValidatorDay
} from '../validators/scheduleValidator.js'
import {
    createOrUpdateSchedules,
    getAllSchedules,
    getScheduleByDay,
    updateScheduleByDay,
    deleteScheduleByDay
} from '../controllers/schedulesController.js'

const router = express.Router()

// Crear o actualizar horarios de la semana
router.post('/', verifyToken, scheduleValidatorPOST, validationResultHandler, createOrUpdateSchedules)

// Obtener todos los horarios configurados
router.get('/', getAllSchedules)

// Obtener el horario de un día específico
router.get('/:day', scheduleValidatorDay, validationResultHandler, getScheduleByDay)

// Actualizar el horario de un día específico
router.put('/:day', verifyToken, scheduleValidatorPUT, validationResultHandler, updateScheduleByDay)

// Eliminar el horario de un día específico
router.delete('/:day', verifyToken, scheduleValidatorDay, validationResultHandler, deleteScheduleByDay)

export default router

