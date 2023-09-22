import React, { useEffect, useState } from 'react'
import "./css/chat.css"
import profile from "./profile.svg"
import { io } from "socket.io-client"

// const socket = io("http://localhost:8000")
const name = prompt("Enter your name");

const socket = io("https://groupchat-i706.onrender.com")
const App = () => {
  const [message, setMessage] = useState("")

  useEffect(() => {
    alert("You have Joined the Group EA23")
    socket.emit("JOIN_GROUP", { GroupName: "EA23", userName: name })

    const ReceiveMessage = (message, sender, checkName) => {
      if(sender !== checkName){
      const messageCont = document.createElement("div")
      const messageDiv = document.createElement("div")
      messageCont.className = "flex-l"
      messageDiv.className = "msgDivLeft"

      const senderName = document.createElement("p")
      senderName.textContent = sender

      const messageText = document.createElement("p");
      messageText.textContent = message;

      messageDiv.appendChild(senderName)
      messageDiv.appendChild(messageText)
      messageCont.appendChild(messageDiv)

      const chatBox = document.getElementsByClassName("chatBox")[0]
      chatBox.insertBefore(messageCont, chatBox.firstChild)
      chatBox.scrollTop = 0
      socket.emit("SENDINGROUP", { Message: message, userName: sender })
      }
    }

    socket.on("JOIN_MESSAGE", (GroupMessage) => {
      joinMEssage(GroupMessage)
    })

    socket.on("SENDINGROUP", (GroupMessage) => {
      // setServerMessages([...serverMessages, { message: GroupMessage.Message, sender: GroupMessage.userName }])
      ReceiveMessage(GroupMessage.Message, GroupMessage.userName, name)
    })
  }, [])

  const sendMessage = (message) => {
    const messageCont = document.createElement("div")
    const messageDiv = document.createElement("div")
    messageCont.className = "flex-r"
    messageDiv.className = "msgDivRight"

    const senderName = document.createElement("p")
    senderName.textContent = name

    const messageText = document.createElement("p");
    messageText.textContent = message;

    messageDiv.appendChild(senderName)
    messageDiv.appendChild(messageText)
    messageCont.appendChild(messageDiv)

    const chatBox = document.getElementsByClassName("chatBox")[0]
    chatBox.insertBefore(messageCont, chatBox.firstChild)
    chatBox.scrollTop = 0
    socket.emit("SENDINGROUP", { Message: message, userName: name })

  }

  const joinMEssage = (message) => {
    const messageDiv = document.createElement("div")

    messageDiv.className = "msgDivmid"
    messageDiv.innerHTML = message
    const chatBox = document.getElementsByClassName("chatBox")[0]
    chatBox.insertBefore(messageDiv, chatBox.firstChild)
    chatBox.scrollTop = 0
  }



  const handleSubmit = (e) => {
    e.preventDefault()

    sendMessage(message)
    setMessage("")
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div className='main-container'>
      <div className="header">
        <img src={profile} alt="icon" width={"32px"} />
        <h2>EA23</h2>
      </div>
      <hr />
      <div className="chatBox">
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="text" name="message" id="message" placeholder="Write Your Message" onChange={handleChange} value={message} />
          <button type='submit'>Send</button>
        </div>
      </form>
    </div>
  )
}

export default App