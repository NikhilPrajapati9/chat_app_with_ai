import 'dotenv/config';
import app from './app.js'
import http from 'http'
import { Server } from "socket.io";
import jwt from "jsonwebtoken"
import projectModel from "./models/project.model.js"
import mongoose from 'mongoose';
import { generateResult } from './services/ai.service.js';
import { Result } from 'express-validator';


const PORT = process.env.PORT || 3000
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }

        socket.project = await projectModel.findById(projectId);


        if (!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error'))
        }


        socket.user = decoded;
        console.log("socket middleware");


        next();
    } catch (error) {
        next(error)
    }
})




io.on('connection', socket => {
    socket.roomId = socket.project._id.toString()
    console.log("a user connected");


    socket.join(socket.roomId);

    socket.on('project-message', async data => {
        const message = data.message

        const aiIsPresentInMessage = message.includes('@ai');

        socket.broadcast.to(socket.roomId).emit('project-message', data)

        if (aiIsPresentInMessage) {
            const prompt = message.replace('@ai', '')

            const result = await generateResult(prompt);

            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: 'ai',
                    email: "AI"
                }
            })
            return
        }
    })

    socket.on('disconnect', () => {
        console.log("user disconnect");
        socket.leave(socket.roomId)

    });
});


server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);

});