import express from 'express'
import SupportController from '../controller/SupportController'
import UserController from '../controller/UserController'
import { generateCode } from '../model/Util'
const routes = express.Router()
routes.get("/", (req, res) =>{
    generateCode("aksdaksdçasldkçaskdç")
    res.send("OLA MUNDO")
})

routes.post("/users", UserController.create)
routes.get("/users", UserController.list)
routes.delete("/users/:id", UserController.remove)
routes.post("/users/:id", UserController.update)


routes.post("/supports/:user_id", SupportController.create)
routes.get("/supports/", SupportController.list)
routes.delete("/supports/:id", SupportController.remove)
routes.get("/supports/:id", SupportController.getOne)
routes.post("/supports/:id", SupportController.update)




export default routes