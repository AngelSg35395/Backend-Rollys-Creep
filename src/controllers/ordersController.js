import supabase from '../config/supabase.js'
import { sendMessageToWhatsapp } from '../config/twilio.js'

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

    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error updating order' + error })
    }
    res.json({ message: 'Order updated successfully'})
}

export const addOrder = async (req, res) => {
    const order = req.body

    // Add order to the database
    const { data, error } = await supabase
        .from('orders')
        .insert([order])

    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error adding order' + error.message })
    }

    // Send WhatsApp message
    try {
        await sendMessageToWhatsapp(order.order_msg);
    } catch (err) {
        console.log('WhatsApp message error:', err.message)
        res.status(500).json({ error: 'Order saved but WhatsApp message failed: ' + err.message })
    }

    res.json({ message: 'Order added successfully' })
}