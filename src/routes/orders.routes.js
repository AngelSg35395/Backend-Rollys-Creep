import express from 'express'
import { validationResultHandler } from '../middlewares/validationResult.js'
import { orderValidatorADD, orderValidatorEDIT } from '../validators/ordervalidator.js'
import { 
    getOrders,
    editOrder,
    addOrder
} from '../controllers/ordersController.js'

const router = express.Router()

// Get Orders
router.get('/:typePath', getOrders)

// Edit Order
router.put('/edit/:id', orderValidatorEDIT, validationResultHandler, editOrder)

// Add Order
router.post('/add', orderValidatorADD, validationResultHandler, addOrder)

export default router