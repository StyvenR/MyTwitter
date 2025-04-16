const { Server } = require("socket.io");


const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = 8080;
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("message", (message) => {
        const completeMessage = {
            userId: socket.id, // Changed from id to userId
            text: message,
            timestamp: new Date().toISOString()
        };
        console.log("Message received: ", completeMessage);
        io.emit("message", completeMessage);
    });
});


server.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
}
);

