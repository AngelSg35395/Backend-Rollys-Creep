/**
 * ORDER MESSAGE
 * @description Function to prepare order message for WhatsApp and database
 */

export function prepareOrderMessage({ client_name, client_email, client_phone, delivery_date, payment_method, cart_items }) {
    // Create items summary
    const itemsSummary = cart_items.map((item) => {
        const complementsText = item.complements ? ` (${item.complements})` : '';
        const lineTotal = item.price * item.quantity;
        return `• ${item.quantity} x ${item.name} (${item.product_size}${complementsText})\n    Precio unitario: $${item.price.toFixed(2)}\n    Subtotal: $${lineTotal.toFixed(2)}`;
    }).join('\n\n');

    // Calculate total
    const total = cart_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Build improved order message
    const orderMessage =`
    🧾 *Nuevo pedido* 🧾
    👤 *Datos del cliente*
— Nombre: ${client_name}
— Email: ${client_email}
— Teléfono: ${client_phone}
— Fecha de recogida: ${delivery_date}
— Método de pago: ${payment_method}

    🛒 *Productos solicitados*
${itemsSummary || '— (ningún producto en el carrito)'}

💰 *Total a pagar:* $${total.toFixed(2)}
`;

    return orderMessage;
}
