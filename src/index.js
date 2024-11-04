import express from 'express';
import { Server as webSocketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import routes from './routes/routes';

// Create server
const app = express();

// Configura el middleware para parsear JSON
app.use(express.json());

app.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true
}));
// create server with http service and express configuration
const httpServer = http.createServer(app);

const io = new webSocketServer(httpServer,{
    cors:{
        origin: "http://localhost:4200", // Habilita el dominio del frontend
        methods: ["GET", "POST"], // Métodos permitidos
        allowedHeaders: ["my-custom-header"], // Personaliza si tienes headers específicos
        credentials: true // Permite el uso de cookies en las solicitudes
    }
});


var port = 2020;


app.use('/api', routes);


httpServer.listen(port, ()=>{
    console.log('Servidor WebSocket escuchando en puerto:' + port);
})

io.on('connect',(socket)=>{
    console.log("Nueva conexión");
    socket.emit('Nueva conexion', { msg: 'Bienvenido al servidor WebSocket!' });

    socket.on('ab', (data) => {
        console.log('Mensaje recibido:' + JSON.stringify(data));
    });


})

