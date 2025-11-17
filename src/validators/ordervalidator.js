import { body } from "express-validator";

export const orderValidatorADD = [
    body("order_msg")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("El mensaje de la orden no puede estar vacío"),
];

export const orderValidatorEDIT = [
    body("order_state")
        .notEmpty()
        .isBoolean()
        .withMessage("El estado de la orden debe ser un booleano")
];