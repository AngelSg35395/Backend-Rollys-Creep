import express from 'express'
import { validationResultHandler } from '../middlewares/validationResult.js'
import { adminLoginValidators } from '../validators/adminValidators.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import {
    getAdministrators,
    deleteAdministrator,
    loginAdmin
} from '../controllers/administratorsController.js'


const router = express.Router()

// Get Administrators
router.get('/', verifyToken, getAdministrators)

// Delete Administrator
router.delete('/delete/:admin_code', verifyToken, deleteAdministrator)

// Login Administrator
router.post('/login', adminLoginValidators, validationResultHandler, loginAdmin)

export default router