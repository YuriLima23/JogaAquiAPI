import express from 'express'
import SupportController from '../controller/SupportController'
import UserController from '../controller/UserController'
import verifyToken from '../middlerwars/authentication';
import { generateCode } from '../model/Util'
require('dotenv').config();

const routes = express.Router()
routes.post("/", (req, res) => {
    return res.send("OLA MUNDO 2")
})
routes.post("/login", UserController.login)
routes.post("/logout", verifyToken,UserController.logout)
routes.post("/checkAuth", verifyToken, UserController.checkAuth)


routes.post("/users", UserController.create)
routes.post("/cache/users", UserController.saveUserCache)
routes.get("/users", UserController.list)
routes.delete("/users/:id", UserController.remove)

// routes.post("/users/capture", UserController.getAuth)
routes.put("/users/:id", UserController.update)
routes.get("/teste", UserController.teste)
routes.get("/deleteRedis", UserController.removeALl)


routes.post("/supports/:user_id", SupportController.create)
routes.get("/supports/", SupportController.list)
routes.delete("/supports/:id", SupportController.remove)
routes.get("/supports/:id", SupportController.getOne)
routes.post("/supports/:id", SupportController.update)




export default routes