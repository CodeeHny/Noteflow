import express from 'express';
import userRouter from './routes/user.route.js';
import blogRouter from './routes/blog.route.js';
import notesRouter from './routes/notes.route.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

app.use('/api/v1/user', userRouter)
app.use('/api/v1/blog', blogRouter)
app.use('/api/v1/notes', notesRouter)

export default app