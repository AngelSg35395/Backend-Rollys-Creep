import { body } from 'express-validator'

export const adminLoginValidators = [
    body('account_name')
        .isString()
        .isLength({ min: 4, max: 15 })
        .withMessage('El nombre de usuario debe tener entre 4 y 15 caracteres'),
    body('account_password')
        .isLength({ min: 8, max: 25 })
        .withMessage('La contraseña debe tener entre 8 y 25 caracteres'),
]