const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { cloudinary } = require('./utils/cloudinary');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

// Configuración de variables de entorno
dotenv.config();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Crear la aplicación Express
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB con opciones mejoradas
const MONGODB_URI = process.env.MONGODB_URI;
console.log('Intentando conectar a MongoDB...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Conectado a MongoDB Atlas');
  console.log('Base de datos:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
})
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/reservas', reservaRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de RentaFlex funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en la aplicación:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
}); 