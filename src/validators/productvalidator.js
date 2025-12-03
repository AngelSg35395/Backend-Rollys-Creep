import { body } from "express-validator";

const productTypes = ["Bananas", "Eskimos", "StrawberriesFruit", "Frappes", "Rolls"];

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
    body("product_type")
        .isIn(productTypes)
        .withMessage(`El tipo de producto debe ser uno de: ${productTypes.join(', ')}`),
    body("product_sizes")
        .isArray()
        .notEmpty()
        .withMessage("El tamaño del producto no puede estar vacío"),
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
    body("product_type")
        .optional()
        .isIn(productTypes)
        .withMessage(`El tipo de producto debe ser uno de: ${productTypes.join(', ')}`),
    body("product_sizes")
        .optional()
        .isArray()
        .notEmpty()
        .withMessage("El tamaño del producto no puede estar vacío"),
];

export const productValidatorHIGHLIGHT = [
    body("highlight")
        .notEmpty()
        .isBoolean()
        .withMessage("El valor de highlight debe ser un booleano")
];