import React,{useEffect,useState} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import './Chat.css'
import Input from '../Input/Input'
import InfoBar from '../InfoBar/InfoBar'
import Messages from '../Messages/Messages'

let socket

function Chat({location}) {
    const [name, setName] = useState("")
    const [room, setRoom] = useState("")
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const END_POINT = "https://nodechatss.herokuapp.com/"
    useEffect(() => {
        const {name, room} = queryString.parse(location.search)
        
        socket = io(END_POINT)
        setName(name)
        setRoom(room)
        // console.log(socket)
        console.log(name, room)
        socket.emit('join', {name, room},(data)=>{
            if (data) alert(data)
        })

        return ()=>{
           socket.emit('disconnect')
           socket.off() 
        }
    },[END_POINT,location.search])

    useEffect(() => {
        socket.on('message',(message)=>{
            setMessages([...messages, message])
        })
    }, [messages])

    const sendMessage = (e) =>{
        console.log('enter pressed')
        e.preventDefault()
        console.log(message)
        if(message){
            socket.emit('userMessage', message, ()=>{setMessage('')})
        }
    }

    console.log(messages, message)

    return (
        <div className="outerContainer">
            {/* <h1>Chxzcat</h1> */}
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default Chat
