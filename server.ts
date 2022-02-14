import express from 'express'
import routes from './src/routes'
import error from './src/middlerwars/errors' 
import authentication from './src/middlerwars/authentication' 


const app = express()

const PORT  = 3333


app.use(express.json())


app.use(routes)

//app.use(authentication)
app.use(error)



    
app.listen(process.env.PORT || PORT)