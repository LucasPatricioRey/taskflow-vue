# 🚀 TaskFlow - App de Gestión de Proyectos

Aplicación full stack desarrollada como proyecto de portfolio que permite gestionar proyectos de manera profesional. Incluye autenticación con JWT, base de datos en MongoDB y una interfaz moderna con Vue.js.

---

## 🌐 Demo en vivo

🔗 Frontend: https://taskflow-vue-lucas.netlify.app  
🔗 Backend: https://backend-portafolio-r87v.onrender.com  

---

## 👀 Vista previa

![Vista previa](/public/vistaPrevia.png)

![Vista previa](vistaPrevia2.png)

---

## 🧠 Funcionalidades

- Registro de usuarios
- Login con autenticación JWT
- Protección de rutas
- CRUD completo de proyectos
- Dashboard con estadísticas
- Filtros y búsqueda en tiempo real
- Edición y eliminación de proyectos
- Vista detallada de proyectos
- Manejo de sesión (login/logout)
- Multiusuario (cada usuario ve sus propios datos)
- Persistencia de datos en MongoDB

---

## 🛠️ Tecnologías utilizadas

### Frontend
- Vue 3
- Vue Router
- Axios
- CSS moderno (responsive UI)

### Backend
- Node.js
- Express
- MongoDB Atlas
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- cors

### Deploy
- Netlify (Frontend)
- Render (Backend)

---

## 🔐 Autenticación

Se implementa autenticación mediante JSON Web Tokens (JWT):

1. El usuario inicia sesión
2. El servidor genera un token
3. El frontend guarda el token en `localStorage`
4. Las rutas protegidas requieren ese token
5. Se implementa interceptor para manejo automático de sesión

---

## ⚡ Características destacadas

- Aplicación SPA (Single Page Application)
- Arquitectura cliente-servidor
- Manejo de estado reactivo
- Interfaz tipo dashboard profesional
- Sistema multiusuario real
- Comunicación API REST

