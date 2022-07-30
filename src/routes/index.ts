import express from 'express'
import SupportController from '../controller/SupportController'
import TypeRecicleController from '../controller/TypeRecicleController'
import SolicitationController from '../controller/SolicitationController'
import UserController from '../controller/UserController'
import verifyToken from '../middlerwars/authentication';
import { generateCode } from '../model/Util'
import GeolocationController from '../controller/GeolocationController'
import { lookForAddress } from '../model/Places'
require('dotenv').config();

const routes = express.Router()
routes.post("/", verifyToken, (req, res) => {

    return UserController.getDataWallet(req, res)
})
// ------------------- Public Routes ------------------- 
routes.post("/login", UserController.login)
routes.post("/login/code", UserController.loginWithCode)
routes.post("/logout", verifyToken, UserController.logout)
routes.post("/checkAuth", verifyToken, UserController.checkAuth)

// ------------------- Routes Users ------------------- 
routes.post("/users", UserController.create)
routes.post("/cache/users", UserController.saveUserCache)
routes.get("/users/wallet", verifyToken, UserController.getDataWallet)
routes.get("/users",verifyToken, UserController.list)
routes.get("/user/", verifyToken, UserController.getOne)
routes.delete("/users/:id", UserController.remove)
routes.get("/users/wallet", UserController.getDataWallet)

// routes.post("/users/capture", UserController.getAuth)
routes.post("/user/profile",verifyToken, UserController.update)
routes.get("/deleteRedis", UserController.removeALl)

// ------------------- Routes Support ------------------- 

routes.post("/supports/",verifyToken, SupportController.create)
routes.get("/supports/", SupportController.list)
routes.delete("/supports/:id", SupportController.remove)
routes.get("/supports/:id", SupportController.getOne)
routes.post("/supports/:id", SupportController.update)


// ------------------- Routes Type_recicle ------------------- 

routes.post("/types_recicles/", TypeRecicleController.create)
routes.get("/types_recicles/", TypeRecicleController.list)
routes.delete("/types_recicles/:id", TypeRecicleController.remove)



// ------------------- Routes Solicitation ------------------- 

routes.post("/solicitations/", verifyToken, SolicitationController.create)
routes.get("/solicitations/user/", verifyToken, SolicitationController.listByUser)
routes.put("/solicitations/:id", verifyToken, SolicitationController.update)
routes.put("/solicitations/status/:id", verifyToken, SolicitationController.changeStatusSolicitation)
routes.delete("/solicitations/:id", verifyToken, SolicitationController.remove)


// ------------------- Geolocation ------------------- 

routes.post("/find/address/", GeolocationController.findLocation)
routes.post("/find/", (req, res) => lookForAddress(req.body.address, req.body.number))



export default routes