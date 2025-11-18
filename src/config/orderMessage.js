/**
 * ORDER MESSAGE
 * @description Function to prepare order message for WhatsApp and database
 */

export function prepareOrderMessage({ client_name, client_email, client_phone, delivery_date, payment_method, cart_items }) {
    // Create items summary
    const itemsSummary = cart_items.map((item) => {
        const complementsText = item.complements ? ` (Complementos: ${item.complements})` : '';
        const lineTotal = item.price * item.quantity;
        return `- ${item.quantity} x ${item.name}${complementsText} - $${item.price.toFixed(2)} c/u, Subtotal: $${lineTotal.toFixed(2)}`;
    }).join('\n');

    // Calculate total
    const total = cart_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Build order message
    const orderMessage = `Nuevo pedido\n\nDatos del cliente:\n- Nombre: ${client_name}\n- Email: ${client_email}\n- Teléfono: ${client_phone}\n- Fecha de recogida: ${delivery_date}\n- Método de pago: ${payment_method}\n\nCarrito:\n${itemsSummary || '- (vacío)'}\n\nTotal: $${total.toFixed(2)}`;

    return orderMessage;
}

