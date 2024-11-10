import express from 'express';

const pool = require('../database/db.config');


const router = express.Router();
const jwt = require('jsonwebtoken');


//GET DATA USER

router.post('/getUser', async(req,res)=>{
    const { user_id } = req.body;
    // validacion del token 

    try {
        const result = await pool.query('SELECT * FROM empresa WHERE id = $1', [user_id]);
        if(result.rows.length > 0) {
            console.log(result);
            res.status(200).json({ msg: 'Cliente con empresa registrada', result });
        }else{
            res.status(404).json({ msg: 'Cliente sin empresa registrada, registre una para funciones avanzadas', code: 4});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en la peticion');
    }





})


export default router;