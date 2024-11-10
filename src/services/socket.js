const axios = require('axios');
import dotenv from 'dotenv';


dotenv.config();


module.exports = (io) => {


    io.on('connection', (socket) => {
        console.log("Nueva conexión");
        socket.emit('Nueva conexion', { msg: 'Bienvenido al servidor WebSocket!' });

        socket.on('ab', async(data) => {
            console.log('Mensaje recibido:' + JSON.stringify(data));
            console.log(data.usr_id);
            const userData = typeof data === 'object' ? data : { usr_id: data };
            try {
                const url = process.env.APP_URL;
                const response = await fetch(`${url}/api/user/getUser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id:  userData.usr_id }),
                });
                const data = await response.json();
                console.log(data);
                socket.emit('data_user', data);
            } catch (error) {
                console.error('Error al realizar la petición HTTP:', error);
                socket.emit('data_user',{ error: 'No fue posible procesar la solicitud' });
            }


        });

       
    });
};