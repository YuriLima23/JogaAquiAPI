import express from 'express'
import routes from './src/routes'
import { errors } from './src/middlerwars/errors' 

const app = express()

const PORT  = 3333

app.use(express.json())
app.use(routes)


    
app.listen(process.env.PORT || PORT)