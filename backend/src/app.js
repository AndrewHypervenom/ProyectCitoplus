const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const statsRoutes = require('./routes/statsRoutes');
require('dotenv').config();

const bcrypt = require('bcrypt');

// Código temporal para generar hash
// const generarHash = async () => {
//   const hash = await bcrypt.hash('admin123', 10);
//   console.log('Nuevo hash generado:', hash);
// };
// generarHash();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/visitors', visitorRoutes);
app.use('/stats', statsRoutes);

// Inicia servidor
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
