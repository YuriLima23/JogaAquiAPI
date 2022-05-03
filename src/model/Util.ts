import Redis from "./Redis"
import bcrypt from 'bcrypt';

export const generateCode = async (user_id) => {
    try {
        let redis = await Redis()
        const code = Math.floor(1000 + Math.random() * 9000);
        redis.set(`code:${user_id}`, code)
        return true
    } catch (error) {
        console.log("Erro ao salvar no redis", error)
        return false
    }

}

export const setRedis = async (key, value, options, expire = null) => {
    try {
        let redis = await Redis()
        console.log("REDIS OPEN : ", redis.isOpen)
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }
        redis.set(key, value, options, expire)
        if (expire) {
            redis.expire(key, expire)
        }
        redis.quit()
        return true
    } catch (error) {
        console.log("Erro ao salvar no redis", error)
        throw error
    }
}

export const getRedis = async (key, bool = false) => {
    try {
        let redis = await Redis()
        let result = null

        if (bool) {
            result = JSON.parse(await redis.get(key))
        }
        else {
            result = await redis.get(key)
        }
        redis.quit()
        return result
    } catch (error) {
        console.log("Erro ao dar get no redis", error)
        throw error
    }
}

export const getAllRedis = async () => {
    try {
        let redis = await Redis()
        let result = await redis.KEYS("*")
        // redis.quit()
        return result
    } catch (error) {
        console.log("Erro ao salvar no redis", error)
        throw error
    }
}
export const deleteAllRedis = async () => {
    try {
        let redis = await Redis()
        let result = await redis.flushAll()
        // redis.quit()
        return result
    } catch (error) {
        console.log("Erro ao salvar no redis", error)
        throw error
    }
}



export const verifyCode = (user_id) => {
    try {
        const code = Math.floor(1000 + Math.random() * 9000);
        return redis.get(`code:${user_id}`)
    } catch (error) {
        console.log("Erro ao salvar no redis")
        return null
    }
}

export const BcryptPromiseHashPassword = async (password) => {
    try {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        reject(err)
                    }
                    resolve(hash)
                });
            });
        })


    } catch (error) {
        console.log("Erro ao encriptar a senha ")
    }
}
export const BcryptPromiseComparePassword = async (password, hash) => {
    try {
        return new Promise((resolve, reject) => {

            bcrypt.compare(password, hash, function (err, hash) {
                if (err) {
                    console.log('Error comaprar senhas : ', err)
                    reject(false)
                }
                console.log('comparou com sucesso', hash)
                resolve(hash)
            });

        })


    } catch (error) {
        console.log("Erro ao encriptar a senha ")
    }
}

//fazer tratamento erro prisma
export const getErrorPrisma = (error) => {

    switch (error.code) {
        case "P2002":

            return ""

    }

}