import 'express-async-errors'

import express from 'express'
import cors from 'cors'

import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger'

import { errorHandler } from './middlewares/error.middleware'

import authRoutes from './routes/auth.routes'
import usuarioRoutes from './routes/usuario.routes'
import clienteRoutes from './routes/cliente.routes'
import petRoutes from './routes/pet.routes'
import veterinarioRoutes from './routes/veterinario.routes'
import consultaRoutes from './routes/consulta.routes'
import prontuarioRoutes from './routes/prontuario.routes'

const app = express()

app.use(cors())

app.use(express.json())

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
)

app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec)
})

app.get('/hello', (_req, res) => {
  res.json('Hello World!')
})

app.use('/auth', authRoutes)

app.use('/usuarios', usuarioRoutes)

app.use('/clientes', clienteRoutes)

app.use('/pets', petRoutes)

app.use('/veterinarios', veterinarioRoutes)

app.use('/consultas', consultaRoutes)

app.use('/prontuarios', prontuarioRoutes)

app.use(errorHandler)

export { app }