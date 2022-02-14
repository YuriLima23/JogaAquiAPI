import { Request , Response} from "express"

const errors =  (error, req: Request , res: Response, next) => {
    let msg = ""
    
    switch (error.code) {
        case 'P2002':
            let errors = []
            let field = error.meta.target
            msg = `Campo ${field} já esta sendo usado`
            return res.status(400).send({ msg: msg })
        case 'P2025':
            msg = `${error.table} não existe`
            return res.status(400).send({  msg: msg })
        case 'P2003':
            msg = `Não foi possivel deletar ${error.table}, existe referencia`
            return res.status(400).send({  msg: msg })
        // erros da aplicação --------------------------------------------------
        case 'E002':
            return res.status(400).send({  msg: error.msg })

        default:
            return res.status(400).json({msg: "Erro ao realizar a ação" })


    }
    next(err);

  
}

export default errors