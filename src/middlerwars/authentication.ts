
import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization

    try {
        if (!authorization) {
            return res.status(401).json({ message: "Token não encontrado" })
        }
        //jwt.sign({})


    } catch (error) {
        console.log('error', error)
    }
    next()

}

export default verifyToken