import { Request, Response } from 'express'
import prisma from '../database/index'
import { cpf as CPF } from 'cpf-cnpj-validator';
import { User } from '.prisma/client';
import { checkValue } from '../util/validation';
import { EInitialStatus } from '../util/enums';
import client from '../model/Google';


const findLocation = async (req: Request, res: Response) => {
    const { address, number, complement } = req.body
    let addresses = []
    try {


        const response = await client.geocode({
            params: {
                address: address,
                region: "br",
                language: "pt-br",
                components: {
                    country: "br",
                }


            }
        })
        if (response.data && response.data.results.length > 0) {
             addresses = response.data.results.map((item) =>   {
                 return { address: item.formatted_address , place_id : item.place_id}
             })
        }

        
        return res.status(200).json(addresses)

    } catch (error) {
        console.log("Error create solicitation: ", error)
        return res.status(400).json("solicitation/error-create")
    }
}

const list = async (req: Request, res: Response) => {
    try {

        return res.status(200).json({ msg: "Dados inseridos com sucesso", })
    } catch (error) {

        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}

const listByUser = async (req: Request, res: Response) => {
    try {
        const id_user = req.user?.id
        const response = await prisma.solicitation.findMany({ where: { user: { id: id_user } }, include: { types_recicles: true } })
        console.log('response', response)
        return res.status(200).json(response)
    } catch (error) {
        console.log('error', error)
        return res.status(400).json({ msg: "Erro ao listar solicitacaoes" })
    }
}

const remove = async (req: Request, res: Response) => {
    try {

        return res.status(200).json({ msg: "Dados inseridos com sucesso", })
    } catch (error) {

        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}



const update = async (req: Request, res: Response) => {
    const {
        type_recicle = [],
        total = 0.00,
        status = EInitialStatus.Proccessing,
        weight,
        date_of_collect } = req.body
    const solicitation_id = req.params.id
    const user = req.user


    try {
        if (!checkValue(user)) {
            return res.status(400).json({ msg: "Campos invalidos" })
        }

        const types = await prisma.type_Recicle.findMany({ where: { id: { in: type_recicle } } })

        if (types.length > 0) {

            let types_recicles_change = types.map((item) => {
                return { id: item.id }
            })

            const response = await prisma.solicitation.update({
                where: { id: parseInt(solicitation_id) },
                data: {
                    total: total,
                    status: status,
                    weight: parseFloat(weight),
                    date_of_collect: date_of_collect,
                    user: {
                        connect: {
                            id: user?.id
                        }
                    },
                    types_recicles: {
                        set: []
                    }
                },
                include: { types_recicles: true },

            })

            const many = await prisma.solicitation.update({
                where: { id: response.id }, data: {
                    types_recicles: { set: types_recicles_change }
                }
            })

            return res.status(200).json({ msg: "Dados Alterados com sucesso", })
        }

        return res.status(400).json("solicitation/types-recicles-invalid")

    } catch (error) {
        console.log("Error update solicitation: ", error)
        return res.status(400).json("solicitation/error-update")
    }
}


export default { findLocation, list, remove, listByUser, update }