/**
 * TWILIO
 * @description Twilio client configuration to send WhatsApp messages
 */

import dotenv from 'dotenv'
import twilio from 'twilio'

dotenv.config()

// Env vars
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE
const companyPhone = process.env.COMPANY_PHONE

// Twilio client
const client = twilio(accountSid, authToken)

/**
 * Send WhatsApp message
 * @param {string} message - Text to send
 * @returns Promise
 */
export async function sendMessageToWhatsapp(message) {
    try {
        if (!message || message.trim() === "") {
            throw new Error("Message is empty")
        }

        const response = await client.messages.create({
            body: message,
            from: twilioPhone,
            to: companyPhone
        })

        return response

    } catch (error) {
        const reason = error?.message || String(error)
        throw new Error(`Failed to send WhatsApp message: ${reason}`)
    }
}
