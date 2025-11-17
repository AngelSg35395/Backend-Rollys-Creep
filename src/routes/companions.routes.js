import express from 'express'
import { validationResultHandler } from '../middlewares/validationResult.js'
import { companionValidatorADD, companionValidatorEDIT } from '../validators/companionvalidator.js'
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
router.put('/edit/:id', companionValidatorEDIT, validationResultHandler, editCompanion)

// Delete Companion
router.delete('/delete/:id', deleteCompanion)

// Add Companion
router.post('/add', companionValidatorADD, validationResultHandler, addCompanion)

export default router