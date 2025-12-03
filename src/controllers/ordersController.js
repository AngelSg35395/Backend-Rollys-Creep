import supabase from '../config/supabase.js'
import { sendMessageToWhatsapp } from '../config/twilio.js'
import { prepareOrderMessage } from '../config/orderMessage.js'

export const getOrders = async (req, res) => {
    try {
        const type = req.params.typePath

        let query = supabase.from('orders').select('*').order('created_at', { ascending: false })

        if (type === 'completed') {
            query = query.is('order_state', true)
        }

        if (type === 'incomplete') {
            query = query.is('order_state', false)
        }

        const { data, error } = await query

        if (error) {
            return res.status(500).json({
                error: 'Failed to fetch orders',
                description: error.message,
            })
        }

        return res.json(data)
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to fetch orders',
            description: err.message,
        })
    }
}

export const editOrder = async (req, res) => {
    const { id } = req.params
    const { order_state } = req.body

    try {
        const { error } = await supabase
            .from('orders')
            .update({ order_state })
            .eq('order_id', id)

        if (error) {
            return res.status(500).json({
                error: 'Failed to update order',
                description: error.message,
            })
        }
        return res.json({ message: 'Order updated successfully'})
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to update order',
            description: err.message,
        })
    }
}

export const addOrder = async (req, res) => {
    try {
        const { client_name, client_email, client_phone, delivery_date, delivery_time, payment_method, cart_items } = req.body

        const orderMessage = prepareOrderMessage({
            client_name,
            client_email,
            client_phone,
            delivery_date,
            delivery_time,
            payment_method,
            cart_items
        })

        const order = { order_msg: orderMessage }

        const { error } = await supabase
            .from('orders')
            .insert([order])

        if (error) {
            return res.status(500).json({
                error: 'Failed to add order',
                description: error.message,
            })
        }

        try {
            await sendMessageToWhatsapp(order.order_msg);
        } catch (err) {
            return res.status(502).json({
                error: 'WhatsApp dispatch failed',
                description: err.message,
            })
        }

        return res.status(201).json({ message: 'Order added successfully' })
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to add order',
            description: err.message,
        })
    }
}