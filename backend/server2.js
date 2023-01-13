const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserSchema = require('./models/userSchema')

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/codeCollab',()=>{console.log("Database connected")});


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = new UserSchema;


app.get("/",(req,res)=>{
    res.send("CodeCollab API");
})

app.post("/login",(req,res)=>{
    const {email,password} = req.body;
    User.findOne({email:email},(err,user)=>{
        if(user) {
            if(password === user.password) {
                res.send({message:"Login successful", user: {name:user.name, email:email}, status:"success"})
            }else {
                res.send({message:"Invalid Login", status:"fail"});
            }
        }else {
            res.send({message:"No user found with this email.",status:"fail"});
        }
    })
})

app.post("/register",(req,res)=>{
    const {name,email,password} = req.body;

    User.findOne({email:email},(err,user)=>{
        if(user) {
            res.send({message:"User already registered with this email.", status:"fail"})
        }else {
            const user = new User({
                name:name,
                email:email,
                password:password,
            })
            user.save((err)=>{
                if(err) {
                    res.send(err);
                }else {
                    res.send({message:"User registered", user:{name:name,email:email}, status:"success"});
                }
            })
        }
    })
})

const http = require('http');
const {Server: Server2} = require('socket.io');
const ACTIONS = require('./Actions')

const server = http.createServer(app);

const userSocketMap = {};

const io = new Server2(server);
io.on('connection', (socket) => {
    console.log('Socket.connected', socket.id);
    // socket.on(ACTIONS.JOIN, ({roomId,name}) => {
    //     socket.join(roomId);
    // })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))