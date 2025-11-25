import { body } from "express-validator";

export const orderValidatorADD = [
    body("client_name")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 20 })
        .withMessage("El nombre del cliente no puede estar vacío"),
    body("client_email")
        .isEmail()
        .trim()
        .notEmpty()
        .isLength({ min: 5, max: 50 })
        .withMessage("El email del cliente debe tener entre 5 y 50 caracteres"),
    body("client_phone")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 20 })
        .withMessage("El teléfono del cliente no puede estar vacío"),
    body("delivery_date")
        .isDate()
        .trim()
        .notEmpty()
        .withMessage("La fecha de entrega no puede estar vacía"),
    body("delivery_time")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 20 })
        .withMessage("La hora de entrega no puede estar vacía"),
    body("payment_method")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 20 })
        .withMessage("El método de pago no puede estar vacío"),
    body("cart_items")
        .isArray()
        .notEmpty()
        .withMessage("El carrito de compras no puede estar vacío"),
];

export const orderValidatorEDIT = [
    body("order_state")
        .notEmpty()
        .isBoolean()
        .withMessage("El estado de la orden debe ser un booleano")
];