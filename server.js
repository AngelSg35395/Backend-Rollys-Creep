/**
 * Imports
 * @description Imports all the required modules
 */
import rateLimit from 'express-rate-limit'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { securityOrigin } from './src/middlewares/securityOrigin.js'

/**
 * Config
 * @description Config for the server
 */
dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors({
    origin: '*', //process.env.ALLOWED_ORIGIN
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-order-key'],
}))
// app.use(securityOrigin)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

/**
 * Rate Limit
 * @description Rate limit for the server
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(apiLimiter)

/**
 * Routes
 * @description Routes for the server
 */

import rootRoutes from './src/routes/root.routes.js'
import productsRoutes from './src/routes/products.routes.js'
import companionsRoutes from './src/routes/companions.routes.js'
import ordersRoutes from './src/routes/orders.routes.js'
import administratorsRoutes from './src/routes/administrators.routes.js'


app.use('/', rootRoutes)
app.use('/products', productsRoutes)
app.use('/companions', companionsRoutes)
app.use('/orders', ordersRoutes)
app.use('/administrators', administratorsRoutes)

/**
 * Start Server
 * @description Starts the server
 */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})