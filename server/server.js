const express = require("express")
const socket = require("socket.io")

const app = express()


PORT = 8000
const server = app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})

const io = socket(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (Client) => {
    console.log(`${Client.id} is Connected now`);

    Client.on("JOIN_GROUP", (GroupName) => {
        Client.join(GroupName.GroupName)
        console.log(GroupName.GroupName, GroupName.userName);
        io.to(GroupName.GroupName).emit("JOIN_MESSAGE", `${GroupName.userName} joined the Group`)

        Client.on("SENDINGROUP", (ClientMessage) => {
            console.log(ClientMessage.Message, ClientMessage.userName);
            if(ClientMessage.userName !== ""){
                Client.broadcast.to(GroupName.GroupName).emit("SENDINGROUP", ClientMessage)
            }
        })
    })
})