import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';

const app = express();

app.use(express.json());

app.use(cors());

app.get('/hello', (req, res) => {
  res.json('Hello World!');
});

// Rotas de autenticação
app.use('/auth', authRoutes);

// Rotas de usuários
app.use('/usuarios', usuarioRoutes);

app.use(errorHandler);

export { app };