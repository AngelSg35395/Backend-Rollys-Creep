/**
 * Controllers
 * @description Controllers for the server
 */

export const homeMessage = (req, res) => {
    res.json({ message: '¡Hello World!' })
}