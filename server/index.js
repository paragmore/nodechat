const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

const {addUser,removeUser,getUser,getUsersInRoom} = require('./users')

const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(router)
app.use(cors())

io.on('connection',(socket)=>{
    console.log("New Connection")

    socket.on('join',({name, room},callback)=>{
        console.log(socket.id, name, room)
        const {error, user}= addUser({id:socket.id, name, room})
        if(error) return callback(error)
        const join = true
        socket.emit('message', {user: 'admin', text:`Welcome to ${user.room} @ ${user.name}`})
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text:`${user.name} has joined @ ${user.room} `})
        socket.join(user.room)

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

        callback()
    })

    socket.on('userMessage', (message, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message', {user: user.name, text:message})
        callback()
    })

    socket.on('disconnect',()=>{
        console.log("User Disconnected")
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', {user:'admin', text:`${user.name} has left the ${user.room}`})
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
        }
    })
})



server.listen(PORT, ()=>{
    console.log(`[CONNECTED] Server Initiated at http://localhost:${PORT}`)
})



