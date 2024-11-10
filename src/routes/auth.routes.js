import express from 'express';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const jwt = require('jsonwebtoken');


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

//Register USER

router.post('/register', async(req,res)=>{
    const { email, password } = req.body;
   

    // Verifica que los campos email y password existan y no estén vacíos
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos.' + email + password });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const result = await pool.query(
            'INSERT INTO users( email, password) VALUES($1, $2) RETURNING *',
            [ email, hashedPassword ]
        );
        res.status(201).json({ userId: result.rows[0].id, email: result.rows[0].email })
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al registrar el usuario');
    }


});

// Login route

router.post('/login', async(req, res)=>{

    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 ' , [email]);
        if(result.rows.length > 0 ){
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                // Generate JWT
                const token = jwt.sign({ id: user.id , email: user.email}, process.env.JWT_SECRET, { expiresIn: '1h'});
                console.log(user);
                const usr_id = user.id;
                res.json({ message: 'successful', token, usr_id});
            }else{
                res.status(401).send('Contraseña incorrecta');
            }
        }else{
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al iniciar sesión');
    }

});

export default router;