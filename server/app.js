import express from 'express';
import morgan from 'morgan';
import connect from "./db/db.js"
import userRoutes from "./routes/user.routes.js"
import projectRoutes from "./routes/project.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import cookieParser from 'cookie-parser';
import cors from 'cors'


connect();
const app = express();

app.use(cors())
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


//routes
app.use('/api/users', userRoutes)
app.use('/api/project', projectRoutes)
app.use('/api/ai', aiRoutes)

export default app