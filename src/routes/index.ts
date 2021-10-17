import express from 'express'
import UserController from '../controller/UserController'
const routes = express.Router()
routes.get("/", (req, res) =>{
    res.send("OLA MUNDO")
})

routes.post("/users", UserController.create)
routes.get("/users", UserController.list)



export default routes