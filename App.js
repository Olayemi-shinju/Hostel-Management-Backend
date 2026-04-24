import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import  {Db_connect}  from './Db_Connect/Db_connect.js';
import userRoute from  './routes/userRoute.js';
import { generalLimiter } from './middlewares/authLimiter.js';
dotenv.config();

const app = express()
app.use(helmet())
const PORT = process.env.PORT || 7000

app.use(express.json())
app.use(cookieParser())
Db_connect()

const corsOptions = {
    origin: process.env.CLIENT_URI,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));
app.use('/api/v1', generalLimiter)
app.use('/api/v1', userRoute)


app.listen(PORT, () => console.log(` Server running on port ${PORT}`))
