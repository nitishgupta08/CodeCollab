const express = require('express')
const cors = require('cors')
const colors = require('colors')
const {Server} = require('socket.io');
const ACTIONS = require('./Actions')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')


const connectDB = require('./config/db')
const Spaces = require("./models/spaceSchema");
connectDB()

const port = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.options('*', cors())

app.use('/api/spaces', require('./routes/spaceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler)



const httpServer = app.listen(port, () => {console.log(`Server listening on port ${port}`)});
const io = new Server(httpServer);

const userSocketMap = {} //convert it to db

const getAllConnectedClients = (spaceId) => {
    return Array.from(io.sockets.adapter.rooms.get(spaceId) || []).map((socketId)=> {
        return {
            socketId,
            userData: userSocketMap[socketId]
        }
    })
}



io.on('connection', (socket) => {
    console.log('Socket.connected', socket.id);

    socket.on(ACTIONS.JOIN, async ( {spaceId,name,email}) => {
        userSocketMap[socket.id] = {name,email};
        socket.join(spaceId);
        const clients = getAllConnectedClients(spaceId);
        await Spaces.findOneAndUpdate({ spaceId: spaceId }, {activeUsers: clients}, { new: true })
        clients.forEach(({socketId})=> {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                name,
                email,
                socketId: socket.id
            })
        })
    })


    socket.on('disconnecting', async () => {
        const spaces = [...socket.rooms];
        spaces.forEach((spaceId)=> {
            socket.to(spaceId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                userData: userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })

    socket.on(ACTIONS.SPACEDATA_CHANGE, async ({spaceData, type, name, spaceId}) => {
        await Spaces.findOneAndUpdate({ spaceId: spaceId }, {spaceData: spaceData}, { new: true })
        const clients = getAllConnectedClients(spaceId);
        clients.forEach(({socketId})=> {
            if(type === 1) {
                io.to(socketId).emit(ACTIONS.SPACEDATA_CHANGE, {
                    message: `${name} has added a new file.`,
                    spaceData,
                    name,
                })
            } else if(type === 0) {
                io.to(socketId).emit(ACTIONS.SPACEDATA_CHANGE, {
                    message: `${name} has edited a file name`,
                    spaceData,
                    name,
                })
            } else {
                io.to(socketId).emit(ACTIONS.SPACEDATA_CHANGE, {
                    message: `${name} has deleted a file`,
                    spaceData,
                    name,
                })
            }

        })
    })

    socket.on(ACTIONS.CODE_CHANGE, ({spaceId, code, name}) => {
        socket.in(spaceId).emit(ACTIONS.CODE_CHANGE, {
            code
        })
    })
})






