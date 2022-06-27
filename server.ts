import express from 'express'
import routes from './src/routes'
import error from './src/middlerwars/errors' 
import authentication from './src/middlerwars/authentication' 
import cors from "cors"
var morgan = require('morgan')

import "dotenv-safe"
const app = express()

const PORT  = 3334
app.use(morgan('tiny'))


app.use(cors());
app.use(express.json())
app.use(routes)
app.listen(process.env.PORT || PORT)