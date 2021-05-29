const express = require('express')
const morgan = require('morgan')
const socket = require('socket.io')
const cors = require('cors')
const http = require('http')
const router = require("./src/routers")
require("dotenv").config()
const PORT = process.env.PORT
const model = require("./src/models/user")

const app = express()
const httpServer = http.createServer(app)
const io = socket(httpServer, {
    cors: {
        origin: '*',
    }
})
io.on("connection", (socket) => {
    socket.on("initialself", ({ id }) => {
        socket.join(`${id}`)
        model.updateProfil("online", 1, id)
        model.getAllUser()
        .then(res =>{
            io.emit("friends", {friends:res.data})
        })
    })
    socket.on("story_chat", ({reciever, sender})=>{
        model.getChat(sender, reciever)
        .then(response=>{
            io.to(`${sender}`).emit(`recieve_history`, {chats:response.chats, friend:response.friend})
        })
    })
    socket.on("send_message", ({message, friend, self}, cb)=>{
        model.addChat(self.id, friend, message)
        .then(() => {
            model.getChat(self.id, friend)
            .then(res=>{
                io.to(`${friend}`).emit("recieve_message", {dataChats:res.chats, sender:self})
                cb(res.chats)
            })
        })
    })
    socket.on("logout", id_user=>{
        model.updateProfil("online", 0, id_user)
        model.getAllUser(id_user)
        .then(res =>{
            socket.broadcast.emit("status", {friends:res.data})
        })
    })
})

// res api
app
    .use(morgan('dev'))
    .use(cors())
    .use(express.urlencoded({ extended: false }))
    .use(express.json())
    .use("/v1", router)
    .use("/img", express.static(`${__dirname}/src/assets`))

httpServer.listen(PORT, () => {
    console.log('server is running on port ' + PORT);
})