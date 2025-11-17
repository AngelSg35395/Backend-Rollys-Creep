import { body } from "express-validator";

export const productValidatorADD = [
    body("name")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("El nombre del producto no puede estar vacío"),
    body("description")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("La descripción del producto no puede estar vacía"),
    body("price")
        .notEmpty()
        .isNumeric()
        .withMessage("El precio del producto no puede estar vacío"),
    body("product_type")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("El tipo de producto no puede estar vacío"),
    body("image_url")
        .isString()
        .matches(/^data:image\/(png|jpg|jpeg);base64,/)
        .withMessage("La URL de la imagen debe ser un string válido")
];

export const productValidatorEDIT = [
    body("name")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage("El nombre del producto debe tener al menos 3 caracteres"),
    body("description")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage("La descripción del producto debe tener al menos 3 caracteres"),
    body("price")
        .optional()
        .isNumeric()
        .withMessage("El precio del producto debe ser un número"),
    body("product_type")
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage("El tipo de producto no puede estar vacío"),
    body("image_url")
        .optional()
        .isString()
        .matches(/^data:image\/(png|jpg|jpeg);base64,/)
        .withMessage("La URL de la imagen debe ser un string válido")
];

export const productValidatorHIGHLIGHT = [
    body("highlight")
        .notEmpty()
        .isBoolean()
        .withMessage("El valor de highlight debe ser un booleano")
];