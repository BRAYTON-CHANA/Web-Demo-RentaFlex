# 🧭 Guía Técnica para Desarrollador – Web Demo RentaFlex

Accede a la aplicación aquí: [https://web-demo-renta-flex.vercel.app](https://web-demo-renta-flex.vercel.app)

✅ **Objetivo General**  
Desarrollar una aplicación web tipo **Airbnb**, funcional pero simulada, centrada en el uso de **MongoDB** como base de datos NoSQL, con funcionalidades clave como búsqueda, reservas, favoritos y publicación de propiedades.

💡 **Importante**: La app **NO requiere pagos reales**. Todo pago es una **simulación**.

---

## 🌐 **Características Generales**

| **Aspecto**                | **Detalle**                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| **Acceso inicial**          | Cualquier visitante puede explorar propiedades sin iniciar sesión.          |
| **Autenticación obligatoria**| Solo es necesaria para:                                                     |
|                            | • Reservar propiedades                                                       |
|                            | • Publicar alquileres                                                       |
| **Tipo de cuenta**          | Una sola cuenta de usuario. Cualquier usuario puede arrendar o alquilar. No hay distinción de roles. |
| **Simulación de pago**      | No se realiza un pago real. Al presionar "Reservar", se simula el proceso. |
| **Interfaz tipo Airbnb**    | Página principal con tarjetas de propiedades disponibles sin login previo. |

---

## 🧱 **Stack Tecnológico**

| **Capa**          | **Tecnología**               | **Plan Gratuito** | **Motivo**                                      |
|-------------------|------------------------------|-------------------|-------------------------------------------------|
| **Frontend**      | React + Vite + Tailwind       | ✅                | Moderno, rápido y gratuito.                    |
| **Backend**       | Node.js + Express            | ✅                | Flexible y ampliamente soportado.              |
| **Base de Datos** | MongoDB Atlas (Free Tier)    | ✅                | NoSQL, ideal para propiedades y usuarios.      |
| **Hosting Front** | Vercel (Free)                | ✅                | Excelente para apps React.                     |
| **Hosting Back**  | Render (Free Web Service)    | ✅                | Corre servidores Express.                      |
| **Imágenes**      | Cloudinary (Free Plan)       | ✅                | Alojamiento gratuito de imágenes y acceso vía URL. |

---

## 🔐 **Variables de Entorno (archivo .env en backend)**

```env
MONGODB_URI=tu_uri_mongodb
   JWT_SECRET=tu_secreto_jwt
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=tu_nombre_de_nube_cloudinary
   CLOUDINARY_API_KEY=tu_clave_api_cloudinary
   CLOUDINARY_API_SECRET=tu_secreto_api_cloudinary
   FRONTEND_URL=tu_url_frontend
```

## 🗂️ **Colecciones MongoDB**

### **Propiedades**
```json
{
  "titulo": "Casa moderna con jardín",
  "tipo": "casa",
  "precio_noche": 100,
  "descripcion": "Ideal para vacaciones",
  "habitaciones": 3,
  "banos": 2,
  "area_m2": 120,
  "imagenes": [
    "https://res.cloudinary.com/dyr7ghtnu/image/upload/v1234567890/casa1.jpg"
  ],
  "ubicacion": {
    "distrito": "Ilo",
    "provincia": "Moquegua"
  },
  "disponibilidad": [
    { "inicio": "2025-06-01", "fin": "2025-06-10" }
  ],
  "estado": "disponible"
}
```
### **Usuarios***

```json
{
  "nombre": "Carlos Pérez",
  "email": "carlos@mail.com",
  "telefono": "+511234567890",
  "rol": "usuario",
  "favoritos": ["id_prop_1", "id_prop_2"]
}
```
### **Reservas***

```json
{
  "usuario_id": "id_usuario",
  "propiedad_id": "id_propiedad",
  "desde": "2025-06-01",
  "hasta": "2025-06-05",
  "estado": "confirmada"
}

```
## 🔧 **Estructura del Proyecto**

### **Backend (Node.js + Express)**
```bash
/backend
│ .env
│ app.js
│ package.json
│
├── /controllers
│   ├── authController.js
│   ├── propiedadController.js
│   ├── reservaController.js
│   └── usuarioController.js
│
├── /routes
│   ├── authRoutes.js
│   ├── propiedadRoutes.js
│   ├── reservaRoutes.js
│   └── usuarioRoutes.js
│
├── /models
│   ├── Usuario.js
│   ├── Propiedad.js
│   └── Reserva.js
│
├── /middleware
│   ├── auth.js
│   └── errorHandler.js
│
└── /utils
    └── cloudinary.js
```

### **Frontend (React + Vite + Tailwind)**
```bash

/frontend
│ index.html
│ main.jsx
│ tailwind.config.js
│
├── /pages
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Publicar.jsx
│   ├── DetallePropiedad.jsx
│   ├── MisReservas.jsx
│   └── MisPropiedades.jsx
│
├── /components
│   ├── Navbar.jsx
│   ├── CardPropiedad.jsx
│   ├── FiltroBusqueda.jsx
│   └── GaleriaImagenes.jsx
│
├── /context
│   └── AuthContext.jsx
│
├── /services
│   ├── api.js
│   └── propiedadService.js
│
└── /assets
    └── logo.png
```
## 🔄 **Flujo de Navegación del Usuario**

```mermaid
graph TD
     A[Inicio ] --> B[Ver propiedades]
    B --> C[Filtrar por tipo, lugar, fechas]
    C --> D[Ver detalles de propiedad]
    D --> E[Iniciar sesión para reservar o publicar]
    E --> F[Formulario de reserva simulada]
    E --> G[Formulario de publicación]
    G --> H[Propiedad publicada]
    F --> I[Reserva registrada]
    I --> J[Mis reservas]
    H --> K[Mis propiedades]
    D --> L[Agregar a favoritos ]

```

# Plan de Desarrollo

## 🧑‍💻 **Fase 1: Preparación y Configuración Inicial** (1 semana)

**Objetivo:** Configurar el entorno de trabajo, asegurando que todas las herramientas necesarias estén listas para comenzar el desarrollo del proyecto.

#### Actividades:

1. **Configuración del Backend:**
   - Inicializar el proyecto Backend con **Node.js** y **Express**.
   - Configurar las dependencias básicas (`express`, `mongoose`, `dotenv`, `jsonwebtoken`).
   - Crear el archivo `.env` para almacenar las variables de entorno (MongoDB URI, JWT_SECRET, etc.).
   - Establecer la estructura inicial del proyecto (`controllers`, `models`, `routes`, `middleware`, `utils`).

2. **Configuración del Frontend:**
   - Inicializar el proyecto Frontend con **React** usando **Vite**.
   - Configurar **Tailwind CSS** en el proyecto.
   - Asegurar que la estructura de carpetas del frontend esté lista (`components`, `pages`, `services`, etc.).

3. **Configuración de MongoDB Atlas:**
   - Crear la cuenta en **MongoDB Atlas**.
   - Configurar el cluster y obtener el URI de conexión.
   - Crear las colecciones iniciales en MongoDB (`usuarios`, `propiedades`, `reservas`) según los requerimientos.

4. **Configuración de Cloudinary:**
   - Crear cuenta en **Cloudinary** para el manejo de imágenes.
   - Obtener las credenciales necesarias y agregarlas en el archivo `.env`.

5. **Despliegue Inicial:**
   - Configurar las cuentas en **Vercel** (para el frontend) y **Render** (para el backend) con las configuraciones iniciales.
   - Verificar que ambas plataformas están correctamente conectadas al repositorio y listas para despliegues automáticos.

---

## 🧑‍💻 **Fase 2: Desarrollo Backend - Estructura Básica** (2 semanas)

**Objetivo:** Establecer la estructura básica del backend con las rutas y modelos esenciales para la gestión de propiedades, usuarios y reservas.

#### Actividades:

1. **Estructura de Rutas y Controladores:**
   - Crear las rutas y controladores para **usuarios** (registro, login).
   - Crear las rutas y controladores para **propiedades** (listar, filtrar, publicar).
   - Crear las rutas y controladores para **reservas** (crear, eliminar, listar).

2. **Modelado de Base de Datos:**
   - Implementar los modelos de MongoDB para **Propiedad**, **Usuario** y **Reserva** según los requisitos del proyecto.
   - Definir validaciones necesarias en los modelos (por ejemplo, precios, fechas de disponibilidad).

3. **Autenticación y Autorización:**
   - Implementar el sistema de autenticación usando **JWT** para las rutas sensibles.
   - Añadir middleware de protección de rutas para asegurarse de que ciertas acciones solo se realicen si el usuario está autenticado (por ejemplo, para reservar propiedades o publicarlas).

4. **Simulación de Pago:**
   - Implementar la simulación de pago en la funcionalidad de reservas.
     - **Nota**: La simulación de pago no involucra transacciones reales; simplemente se simula el proceso de reserva sin procesar pagos reales.

---

## 🌐 **Fase 3: Desarrollo Frontend - Interfaz de Usuario** (3 semanas)

**Objetivo:** Crear las páginas y componentes principales del frontend, asegurando que sean responsivos y funcionales.

#### Actividades:

1. **Página Principal (Home):**
   - Crear la página principal que muestre las propiedades disponibles.
   - Implementar los filtros de búsqueda (tipo, ubicación, precio, fechas) con React.
   - Mostrar las propiedades en tarjetas, con imagen, título y resumen.

2. **Detalle de Propiedad:**
   - Implementar la vista de detalles de cada propiedad.
   - Incluir una galería de imágenes obtenidas de **Cloudinary**.
   - Mostrar el botón de "Reservar" solo si el usuario está autenticado.

3. **Formulario de Reserva Simulada:**
   - Crear el formulario de reserva para simular el proceso de pago.
   - Validar las fechas y comprobar disponibilidad antes de la reserva.
     - **Nota**: Este formulario solo simula el proceso de pago; no se realizarán pagos reales.

4. **Registro y Login:**
   - Crear las páginas de **Registro** y **Login** para gestionar la autenticación del usuario.
   - Implementar el flujo de inicio de sesión con **JWT** para proteger rutas sensibles.

5. **Página de Publicar Propiedad:**
   - Crear el formulario para publicar nuevas propiedades.
   - Integrar la subida de imágenes con **Cloudinary**.
   - Implementar la edición y eliminación de propiedades por el autor.

6. **Favoritos:**
   - Implementar la funcionalidad para que los usuarios puedan agregar propiedades a sus favoritos, con la restricción de que el usuario debe estar autenticado.

7. **Responsividad:**
   - Asegurar que todas las páginas sean responsivas y se adapten a diferentes dispositivos usando **Tailwind CSS**.

---

## 🧑‍💻 **Fase 4: Integración y Conexión del Frontend con Backend** (2 semanas)

**Objetivo:** Integrar el frontend con el backend, asegurando que las operaciones como reservas, publicación de propiedades y favoritos funcionen correctamente.

#### Actividades:

1. **Conexión del Frontend con el Backend:**
   - Conectar las páginas del frontend con las rutas del backend usando **Axios** o **Fetch** para realizar las solicitudes.
   - Implementar las funcionalidades de reserva, publicación y gestión de favoritos, asegurándose de que todo funcione correctamente con el backend.

2. **Manejo de Sesiones y JWT:**
   - Asegurar que el JWT se maneje correctamente en el frontend (almacenamiento, validación de tokens).

3. **Simulación de Pago:**
   - Implementar la simulación del proceso de pago cuando se realiza una reserva.
     - **Nota**: Asegúrate de que la simulación sea clara para el usuario y no genere confusión sobre si se trata de un pago real.

4. **Verificación de Datos:**
   - Validar que los datos enviados desde el frontend al backend sean correctos y se manejen adecuadamente.

---

## 🚀 **Fase 5: Pruebas y Correcciones** (2 semanas)

**Objetivo:** Asegurar que todo funcione correctamente antes del despliegue final.

#### Actividades:

1. **Pruebas Unitarias y Funcionales:**
   - Realizar pruebas de integración entre el frontend y el backend.
   - Verificar que todas las funcionalidades (búsqueda, reservas, favoritos, publicación) funcionen como se espera.

2. **Pruebas de Usabilidad:**
   - Realizar pruebas de usabilidad para asegurarse de que la interfaz sea fácil de usar.

3. **Corrección de Errores:**
   - Corregir cualquier error o inconsistencia encontrada durante las pruebas.

4. **Optimización:**
   - Optimizar el rendimiento de la aplicación, incluyendo tiempos de carga y manejo de imágenes.

---

## 🌐 **Fase 6: Despliegue y Mantenimiento** (1 semana)

**Objetivo:** Desplegar la aplicación en producción y realizar tareas de mantenimiento.

#### Actividades:

1. **Despliegue en Producción:**
   - Desplegar el backend en **Render**.
   - Desplegar el frontend en **Vercel**.
   - Asegurar que ambos entornos estén correctamente configurados y accesibles.

2. **Monitoreo:**
   - Configurar herramientas de monitoreo para la aplicación en producción.

3. **Mantenimiento:**
   - Realizar actualizaciones y correcciones de bugs post-despliegue.

---

### **Notas Finales**
- **Simulación de pago**: la funcionalidad de pago no involucra transacciones reales y que todo es una simulación, tanto en el backend como en el frontend.
- **Autenticación**: El sistema de autenticación basado en **JWT** debe proteger adecuadamente las rutas para la creación de reservas y publicación de propiedades, con una clara validación de sesión en todo momento.
- **Favoritos**: La acción de agregar propiedades a favoritos está restringida solo a usuarios autenticados, lo cual se debe dejar claro en el flujo de navegación y la interfaz.
