import { Request, Response } from 'express'
import prisma from '../database/index'
import { cpf as CPF } from 'cpf-cnpj-validator';
import { User } from '.prisma/client';
import { checkValue } from '../util/validation';
import { EInitialStatus } from '../util/enums';

const create = async (req: Request, res: Response, next) => {
    const { lat, lng, type_recicle = [] } = req.body
    const user = req.user
    let now = new Date()
    let initial_status = EInitialStatus.Proccessing
    let weight = 0.0
    try {
        console.log('user', lat, type_recicle,)
        if (!checkValue(lat) || !checkValue(lng) || type_recicle.length <= 0 || !checkValue(user)) {
            return res.status(400).json({ msg: "Campos invalidos" })
        }


        const response = await prisma.solicitation.create({
            data: {
                status: initial_status,
                weight: weight,
                date_of_collect: now,
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),
                user: {
                    connect: {
                        id: user?.id
                    }
                }
            },
            include: { types_recicles: true }
        })
        const types = await prisma.type_Recicle.findMany({ where: { id: { in: type_recicle } } })

        console.log("Types", types)
        let types_recicles_change = types.map((item) =>{
            return {id : item.id}
        })
        const many = await prisma.solicitation.update({
            where: { id: response.id }, data: {
                types_recicles: { set: types_recicles_change }
            }
        })


        return res.status(200).json({ msg: "Dados inseridos com sucesso", })
    } catch (error) {
        console.log("Error create solicitation: ", error)
        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}

const list = async (req: Request, res: Response, next) => {
    try {

        return res.status(200).json({ msg: "Dados inseridos com sucesso", })
    } catch (error) {

        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}

const remove = async (req: Request, res: Response, next) => {
    try {

        return res.status(200).json({ msg: "Dados inseridos com sucesso", })
    } catch (error) {

        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}





export default { create, list, remove }