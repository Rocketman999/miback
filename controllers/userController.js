const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const conn = await pool.getConnection();

        // Verificar si el usuario ya existe
        const [existingUser] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser) {
            conn.release();
            return res.status(409).json({ message: 'Username already exists' }); // 409 Conflict
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        conn.release();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const conn = await pool.getConnection();

        // Verificar si el usuario existe
        const [user] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) {
            conn.release();
            return res.status(401).json({ message: 'Invalid username or password' }); // 401 Unauthorized
        }

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            conn.release();
            return res.status(401).json({ message: 'Invalid username or password' }); // 401 Unauthorized
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        conn.release();

        res.status(200).json({ message: 'Login successful'});
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err.message });
    }
};