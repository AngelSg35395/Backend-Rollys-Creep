import express from 'express'
import { validationResultHandler } from '../middlewares/validationResult.js'
import { companionValidatorADD, companionValidatorEDIT } from '../validators/companionvalidator.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { 
    getCompanions,
    editCompanion,
    deleteCompanion,
    addCompanion
} from '../controllers/companionsController.js'

const router = express.Router()

// Get Companions
router.get('/', getCompanions)

// Edit Companion
router.put('/edit/:id', verifyToken, companionValidatorEDIT, validationResultHandler, editCompanion)

// Delete Companion
router.delete('/delete/:id', verifyToken, deleteCompanion)

// Add Companion
router.post('/add', verifyToken, companionValidatorADD, validationResultHandler, addCompanion)

export default router