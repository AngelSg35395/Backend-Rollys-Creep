import supabase from '../config/supabase.js'
import { sendMessageToWhatsapp } from '../config/twilio.js'
import { prepareOrderMessage } from '../config/orderMessage.js'

export const getOrders = async (req, res) => {
    // Get order type fetched from the URL
    const type = req.params.typePath

    // Prepare Query from Supabase
    let query = supabase.from('orders').select('*').order('order_id')

    // Show orders completed
    if (type === 'completed') {
        query = query.is('order_state', true)
    }

    // Show orders incomplete
    if (type === 'incomplete') {
        query = query.is('order_state', false)
    }

    // Get orders
    const { data, error } = await query

    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching orders' + error })
    }
    res.json(data)
}

export const editOrder = async (req, res) => {
    const { id } = req.params
    const { order_state } = req.body

    // Update order
    const { data, error } = await supabase
        .from('orders')
        .update({ order_state: order_state })
        .eq('order_id', id)
        .order('created_at', { ascending: true })

    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error updating order' + error })
    }
    res.json({ message: 'Order updated successfully'})
}

export const addOrder = async (req, res) => {
    const { client_name, client_email, client_phone, delivery_date, payment_method, cart_items } = req.body

    // Prepare order message
    const orderMessage = prepareOrderMessage({
        client_name,
        client_email,
        client_phone,
        delivery_date,
        payment_method,
        cart_items
    })

    // Create order object for database
    const order = {
        order_msg: orderMessage
    }

    // Add order to the database
    const { data, error } = await supabase
        .from('orders')
        .insert([order])

    if (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error adding order: ' + error.message })
    }

    // Send WhatsApp message
    try {
        await sendMessageToWhatsapp(order.order_msg);
    } catch (err) {
        console.log('WhatsApp message error:', err.message)
        return res.status(500).json({ error: 'Order saved but WhatsApp message failed: ' + err.message })
    }

    res.json({ message: 'Order added successfully' })
}