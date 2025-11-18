import { body } from "express-validator";

export const companionValidatorADD = [
    body("name")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 20 })
        .withMessage("El nombre del acompañante no puede estar vacío"),
    body("extra_price")
        .isNumeric()
        .isFloat({ min: 0, max: 1000 })
        .withMessage("El precio extra debe ser un número entre 0 y 1000"),
];

export const companionValidatorEDIT = [
    body("name")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("El nombre del acompañante debe tener al menos 3 caracteres"),
    body("extra_price")
        .optional()
        .isNumeric()
        .isFloat({ min: 0, max: 1000 })
        .withMessage("El precio extra debe ser un número entre 0 y 1000"),
];

