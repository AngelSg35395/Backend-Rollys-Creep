import express from 'express'
import { validationResultHandler } from '../middlewares/validationResult.js'
import { productValidatorADD, productValidatorEDIT, productValidatorHIGHLIGHT } from '../validators/productvalidator.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { 
    getProductsType,
    editProduct,
    deleteProduct,
    addProduct,
    HighlightProduct
} from '../controllers/productsController.js'

const router = express.Router()

// Get Products
router.get('/:typePath', getProductsType)

// Edit Product
router.put('/edit/:id', verifyToken, productValidatorEDIT, validationResultHandler, editProduct)

// Delete Product
router.delete('/delete/:id', verifyToken, deleteProduct)

// Add Product
router.post('/add', verifyToken, productValidatorADD, validationResultHandler, addProduct)

// Edit Highlight Product
router.put('/highlight/:id', verifyToken, productValidatorHIGHLIGHT, validationResultHandler, HighlightProduct)

export default router