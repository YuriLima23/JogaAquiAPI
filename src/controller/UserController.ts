import { Request, Response } from 'express'
import prisma from '../database/index'
import { cpf as CPF } from 'cpf-cnpj-validator';
import { User } from '.prisma/client';
import { BcryptPromiseComparePassword, BcryptPromiseHashPassword, deleteAllRedis, generateCode, getAllRedis, getRedis, setRedis } from '../model/Util';
import admin from '../model/Firebase';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

let TABLE = "Usuario"


// const getAuth = async (req: Request, res: Response, next) => {
//     let { uid, fcm } = req.body
//     try {
//         setRedis(`user:initial:fcm:${uid}`, fcm, null , 1)
//         return resultSuccess(res, null, ` ${TABLE} usuario capturado com sucesso`)
//     } catch (error) {
//         console.log('error', error)
//         error.table = TABLE
//         //next(error)
//         return res.status(400).json({ msg: "error " })

//     }
// }

const saveUserCache = async (req: Request, res: Response, next) => {
    try {
        let { name = null, password = null, phone = null } = req.body


        if (!name || !password || !phone) {
            throw { code: "E001", msg: "Alguns campos estão invalidos, verifique e tente novamente!" }
        }
        phone = phone.replace(/\D/g, "")
        const existUser = await prisma.user.findFirst({ where: { phone } })
        if (existUser) {
            throw "auth/user-already-exist"
        }

        //        let user = await getRedis(`cache:user:${phone}`, true)

        setRedis(`cache:user:${phone}`, { name, password, phone }, null, 15 * 60)

        return res.status(200).json({ msg: "Usuario cacheado com sucesso" })
    } catch (error) {
        console.log("Error save user cache", error)
        return res.status(400).json(error)
    }

}

const getUserCache = async (phone, bool) => {
    try {
        phone = phone.replace(/\D/g, "")
        return await getRedis(`cache:user:${phone}`, bool)
    } catch (error) {
        console.log("Error recover user ", error)
    }
}

const checkAuth = async (req: Request, res: Response) => {

    let user_id = req.user?.id

    try {
        if (user_id) {
            const user = await prisma.user.findFirst({ where: { id: user_id } })
            delete user?.password
            if (user) {
                return res.status(200).json({ user })
            }
        }
        throw "auth/session-expired"
    } catch (error) {
        return res.status(400).json(error)
    }

}

const logout = async (req: Request, res: Response) => {
    let user_id = req.user?.id

    console.log("LOGOUT", user_id)

    try {
        const user = await prisma.user.update({ where: { id: user_id }, data: { token_auth: null } })
        return res.status(200).json({ user })

    } catch (error) {
        console.log('Erro logout : ', error)
        return res.status(400).json(error)
    }

}

const login = async (req: Request, res: Response, next) => {
    const { phone = "", password = "" } = req.body
    try {

        if (phone && phone != "" && password && password != "") {
            let phoneWithoutMask = phone.replace(/\D/g, "")
            const response = await prisma.user.findFirst({ where: { phone: phoneWithoutMask } })
            if (response && response.id) {
                const pass = await BcryptPromiseComparePassword(password, response.password)
                if (pass) {
                    let token = jwt.sign({
                        user: {
                            email: response.email,
                            name: response.name,
                            phone: response.phone,
                            cpf: response.cpf,
                            id: response.id
                        }
                    }, process.env.SECRET_JWT)
                    let user = await prisma.user.update({ where: { id: response.id }, data: { token_auth: token } })

                    return res.status(200).json(user)
                }
                throw "auth/invalid-login"
            }
        }
        throw "auth/invalid-login"
    } catch (error) {
        console.log("Error", error);
        if (error != "auth/invalid-login") {
            return res.status(400).json("auth/invalid-login-server")
        }
        return res.status(400).json(error)
    }

}
const create = async (req: Request, res: Response, next) => {
    try {
        let { phone = null } = req.body
        let password = null, token = null

        if (!phone || phone == "") {
            throw { code: "E001", msg: "Alguns campos estão invalidos, verifique e tente novamente!" }
        }
        phone = phone.replace(/\D/g, "")
        let user = await getUserCache(phone, true)
        if (!user) {
            throw "User not exist "
        }
        console.log("CHAMOU ", user);

        password = await BcryptPromiseHashPassword(user.password)


        const response = await prisma.user.create({
            data: {
                id: uuidv4(),
                name: user.name,
                password: password,
                phone: user.phone,
                wallet: {
                    create: {
                        balance: 0.0,
                        previous_balance: 0.0,
                    }
                }
            }
        })


        token = jwt.sign({
            user: {
                email: response.email,
                name: response.name,
                phone: response.phone,
                id: response.id,
            }
        }, process.env.SECRET_JWT)


        const updateUser = await prisma.user.update({
            data: { token_auth: token },
            where: {
                id: response.id
            }
        })
        //  return resultSuccess(res, null, ` ${TABLE} criado com sucesso`)
        return res.status(200).json({
            msg: "Dados inseridos com sucesso", token,
            user: {
                email: response.email,
                name: response.name,
                phone: response.phone,
                cpf: response.cpf,
                id: response.id
            }
        })
    } catch (error) {
        console.log('error', error)
        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}





const list = async (req: Request, res: Response, next) => {
    try {
        const response = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                phone: true,
                photo: true,
                cpf: true,
                email: true,
            }
        })

        return resultSuccess(res, response, '')
    } catch (error) {
        console.log(error)
        error.table = TABLE
        next(error)
    }

}


const remove = async (req: Request, res: Response, next) => {
    const { id } = req.params
    try {
        const response = await prisma.user.delete({ where: { id: id } })
        return resultSuccess(res, null, `${TABLE} deletado com sucesso`)
    } catch (error) {
        console.log(error)
        error.table = TABLE
        next(error)
        //return generateExeption(res, error)
    }
}
const teste = async (req: Request, res: Response, next) => {

    try {
        console.log("Dados :", await getAllRedis())
        return resultSuccess(res, await getAllRedis(), `${TABLE} deletado com sucesso`)
    } catch (error) {
        console.log(error)
        error.table = TABLE
        next(error)
        //return generateExeption(res, error)
    }
}

const removeALl = async (req: Request, res: Response, next) => {

    try {
        console.log("Dados :", await deleteAllRedis())
        return resultSuccess(res, null, `${TABLE} deletado com sucesso`)
    } catch (error) {
        console.log(error)
        error.table = TABLE
        next(error)
        //return generateExeption(res, error)
    }
}

const update = async (req: Request, res: Response, next) => {
    const { id } = req.params
    const { name, email, photo, type_user = 1, phone } = req.body

    try {
        const response = await prisma.user.update({
            where: { id: id },
            data: {
                email,
                name,
                photo,
                phone

            }
        })
        return resultSuccess(res, null, `${TABLE} atualizado com sucesso`)
    } catch (error) {
        console.log(error)
        error.table = TABLE
        next(error)
    }
}

const resultSuccess = (res: Response, data: any, msg: string) => {
    return res.json({ status: 200, data, msg })
}

const generateExeption = (res, error) => {
    console.log(error)
    let msg = ""
    switch (error.code) {
        case 'P2002':
            let errors = []
            let field = error.meta.target
            msg = `Campo ${field} já esta sendo usado`
            return res.status(400).send({ msg: msg })
        case 'P2025':
            msg = `${TABLE} não existe`
            return res.status(400).send({ msg: msg })
        case 'P2003':
            msg = `Não foi possivel deletar ${TABLE}, existe referencia`
            return res.status(400).send({ msg: msg })
        // erros da aplicação --------------------------------------------------
        case 'E002':
            return res.status(400).send({ msg: error.msg })

        default:
            return res.status(400).json({ msg: "Erro ao realizar a ação" })


    }
}

const removeDotCpf = (cpf) => {
    cpf = cpf.split('.').join("")
    cpf = cpf.split('-').join("")
    return cpf
}



export default {
    create, list, remove, update,
    saveUserCache, teste, removeALl, checkAuth, login, logout
}