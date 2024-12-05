## CitoPlus - Sistema de Gestión de Visitantes



https://github.com/user-attachments/assets/ef6de4d7-b9b5-475b-bc83-0d429388ada0



### 📋 Descripción
CitoPlus es una aplicación web fullstack para la gestión de visitantes y usuarios, desarrollada con Node.js y React. El sistema permite administrar el registro de visitantes, gestionar usuarios y visualizar estadísticas en tiempo real.

------------

### ✨ Características
- Autenticación y Autorización
- Sistema de login con JWT
- Roles diferenciados (admin/usuario)
- Protección de rutas por rol
- Gestión de sesiones

#### Panel de Administración

- Dashboard con estadísticas en tiempo real
- Gestión completa de usuarios (CRUD)
- Visualización de métricas con gráficos
- Control de estados de usuarios

#### Gestión de Visitantes

- Registro de nuevos visitantes
- Búsqueda avanzada por múltiples campos
- Sistema de estados para seguimiento
- Historial de visitas
- Filtrado por fecha, nombre e identificación

------------


### 🔧 Tecnologías


#### Backend
- Node.js
- Express
- PostgreSQL
- JWT
- Bcrypt
- CORS
- Dotenv

#### Frontend
- React
- React Router DOM
- Material-UI
- Chart.js
- React-Chartjs-2
- Vite

------------


### 📦 Instalación
#### Pre-requisitos

- Node.js (LTS)
- PostgreSQL
- pgAdmin 4
- NPM

------------


### Configuración de Base de Datos

1. Abrir pgAdmin y crear una nueva base de datos:
```sql
CREATE DATABASE dbsofcitusplus;
```

2. Ejecutar el script de inicialización que se encuentra en `/database/dbsofcitusplus.sql`

------------

`Nota: Ejecutar el backend y frontend en terminales separadas.`

### Backend

1. Navegar al directorio backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Revisar archivo .env en la raíz del backend:
```bash
DB_USER=devsofcitusplus
DB_HOST=localhost
DB_DATABASE=dbsofcitusplus
DB_PASSWORD=###### (SOLO para facilitar uso encontrar en archivo)
DB_PORT=5432
JWT_SECRET=###### (SOLO para facilitar uso encontrar en archivo)
PORT=5000
```

4. Iniciar servidor:
```bash
npm start
```

#### 🔐 Configuración Inicial del Usuario Admin

Después de iniciar el backend:
1.  En `backend/src/app.js`, descomentar el código temporal:
```javascript
const generarHash = async () => {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('Nuevo hash generado:', hash);
};
generarHash();
```
2.  El hash generado en consola debe reemplazarse en el script SQL de la base de datos:
```sql
INSERT INTO usuarios (nombre_usuario, password, estado, rol) 
VALUES ('admin', '[HASH_GENERADO]', true, 'admin');
```
3. Volver a comentar el código temporal y reiniciar el servidor.

> `Nota: Este paso es esencial para el acceso inicial al sistema con las credenciales de administrador.`

------------

### Frontend

1. Navegar al directorio frontend:
```bash
cd frontend-vite
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar aplicación:
```bash
npm run dev
```


------------

### 🚀 Uso

#### Acceso al Sistema
1. Acceder a http://localhost:5173
2. Credenciales por defecto:
	- Admin:
		- Usuario: admin
		- Contraseña: admin123

#### Funcionalidades Principales
##### Administradores:
- Gestión completa de usuarios
- Dashboard con estadísticas
- Control total de visitantes
- Reportes y métricas

##### Usuarios:
- Registro de visitantes
- Búsqueda y filtrado
- Actualización de estados
- Vista de calendario (próximamente)


------------

### 📊 Estructura de Base de Datos

#### Tabla `usuarios`

- `id`: Serial Primary Key
- `nombre_usuario`: VARCHAR(50) UNIQUE
- `password`: VARCHAR(255) (hash bcrypt)
- `fecha_creacion`: TIMESTAMP
- `ultimo_acceso`: TIMESTAMP
- `estado`: BOOLEAN
- `rol`: VARCHAR(20)

#### Tabla `visitantes`

- `id`: Serial Primary Key
- `nombre`: VARCHAR(100)
- `numero_identificacion`: VARCHAR(50)
- `fecha_visita`: TIMESTAMP
- `fecha_salida`: TIMESTAMP
- `motivo`: VARCHAR(255)
- `estado`: VARCHAR(20)
- `creado_por`: INTEGER (FK usuarios)

------------


### 💻 Desarrollo

#### Estructura del Proyecto

    PROYECTCITOPLUS/
    ├── backend/            # API REST Node.js
    ├── frontend-vite/     # Aplicación React
    └── database/          # Scripts SQL

#### Comandos Útiles
```bash
# Backend
npm start             # Inicia servidor

(Opcionales)
npm test              # Ejecuta tests

# Frontend
npm run dev           # Modo desarrollo

(Opcionales)
npm run build         # Construye para producción
npm run preview       # Vista previa de build
```

------------


### ✍️ Autor
**Desarrollado por:** *Andrés Felipe Fajardo Pachón*
- LinkedIn: https://www.linkedin.com/in/andresfelipefajardopachon/
- Email: andrew.fajardo@hotmail.com
