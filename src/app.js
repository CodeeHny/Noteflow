import express from 'express';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

app.use('/api/v1/user', userRouter)

export default app