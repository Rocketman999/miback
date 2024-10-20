require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Nueva ruta
const app = express();
const port = process.env.PORT || 3000; // Usar el puerto de las variables de entorno si está definido

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/user', userRoutes); // Nueva ruta

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});