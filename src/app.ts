import'express-serve-console.error'

import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';


const app = express();

app.use(express.json());
app.use(cors());

app.get('/hello', (req, res) => {
    res.json('Hello World!');
});

app.use(errorHandler)
export { app };