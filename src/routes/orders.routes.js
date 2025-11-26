import express from 'express'
import { validationResultHandler } from '../middlewares/validationResult.js'
import { orderValidatorADD, orderValidatorEDIT } from '../validators/ordervalidator.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { checkOrderToken } from '../middlewares/checkOrderToken.js'
import { generateOrderToken } from '../controllers/orderTokenController.js'
import { 
    getOrders,
    editOrder,
    addOrder
} from '../controllers/ordersController.js'

const router = express.Router()

// Get Orders
router.get('/:typePath', verifyToken, getOrders)

// Edit Order
router.put('/edit/:id', verifyToken, orderValidatorEDIT, validationResultHandler, editOrder)

// Add Order
router.post('/add', orderValidatorADD, validationResultHandler, checkOrderToken, addOrder)

// Generate Order Token
router.post('/generateToken', generateOrderToken)

export default router