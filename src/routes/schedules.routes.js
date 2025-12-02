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

// Create or update schedules
router.post('/', verifyToken, scheduleValidatorPOST, validationResultHandler, createOrUpdateSchedules)

// Get all schedules
router.get('/', getAllSchedules)

// Get schedule by day
router.get('/:day', scheduleValidatorDay, validationResultHandler, getScheduleByDay)

// Update schedule by day
router.put('/:day', verifyToken, scheduleValidatorPUT, validationResultHandler, updateScheduleByDay)

// Delete schedule by day
router.delete('/:day', verifyToken, scheduleValidatorDay, validationResultHandler, deleteScheduleByDay)

export default router

