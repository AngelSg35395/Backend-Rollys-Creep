import { body } from "express-validator";

export const productValidatorADD = [
    body("name")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 20 })
        .withMessage("El nombre del producto no puede estar vacío"),
    body("description")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 150 })
        .withMessage("La descripción del producto no puede estar vacía"),
    body("price")
        .notEmpty()
        .isNumeric()
        .isFloat({ min: 0, max: 1000 })
        .withMessage("El precio del producto debe ser un número entre 0 y 1000"),
    body("product_type")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("El tipo de producto no puede estar vacío"),
];

export const productValidatorEDIT = [
    body("name")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("El nombre del producto debe tener al menos 3 caracteres"),
    body("description")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage("La descripción del producto debe tener al menos 3 caracteres"),
    body("price")
        .optional()
        .isNumeric()
        .isFloat({ min: 0, max: 1000 })
        .withMessage("El precio del producto debe ser un número entre 0 y 1000"),
    body("product_type")
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage("El tipo de producto no puede estar vacío"),
];

export const productValidatorHIGHLIGHT = [
    body("highlight")
        .notEmpty()
        .isBoolean()
        .withMessage("El valor de highlight debe ser un booleano")
];