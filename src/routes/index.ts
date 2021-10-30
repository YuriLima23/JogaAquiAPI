import express from 'express'
import SupportController from '../controller/SupportController'
import UserController from '../controller/UserController'
const routes = express.Router()
routes.get("/", (req, res) =>{
    res.send("OLA MUNDO")
})

routes.post("/users", UserController.create)
routes.get("/users", UserController.list)
routes.delete("/users/:id", UserController.remove)
routes.post("/users/:id", UserController.update)


routes.post("/supports/:user_id", SupportController.create)




export default routes