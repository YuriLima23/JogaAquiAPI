import Redis from "./Redis"

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
        return false
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
        return ""
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
        return ""
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
        return ""
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

//fazer tratamento erro prisma
export const getErrorPrisma = (error) => {

    switch (error.code) {
        case "P2002":

            return ""

    }

}