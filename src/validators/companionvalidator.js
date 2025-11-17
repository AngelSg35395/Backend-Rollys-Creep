import { body } from "express-validator";

export const companionValidatorADD = [
    body("name")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("El nombre del acompañante no puede estar vacío"),
    body("extra_price")
        .isNumeric()
        .withMessage("El precio extra debe ser un número"),
];

export const companionValidatorEDIT = [
    body("name")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage("El nombre del acompañante debe tener al menos 3 caracteres"),
    body("extra_price")
        .optional()
        .isNumeric()
        .withMessage("El precio extra debe ser un número"),
];

