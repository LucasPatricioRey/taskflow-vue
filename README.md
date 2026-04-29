# TaskFlow Vue

Aplicacion full stack para gestionar proyectos con autenticacion, dashboard y CRUD completo.

## Demo

- Frontend: https://taskflow-vue-nine.vercel.app
- Backend: https://backend-portafolio-r87v.onrender.com

## Vista previa

![Vista previa principal](./public/vistaPrevia.jpeg)
![Vista previa secundaria](./public/vistaPrevia2.jpeg)
![Vista previa de acceso](./public/vistaPrevia3.jpeg)
![Vista previa de registro](./public/vistaPrevia4.jpeg)

## Funcionalidades

- Registro e inicio de sesion
- Rutas protegidas
- Dashboard con estadisticas
- CRUD de proyectos
- Vista de detalle
- Manejo de sesion con token
- Soporte multiusuario

## Stack

### Frontend

- Vue 3
- Vue Router
- Axios
- CSS responsive

### Backend relacionado

- Node.js
- Express
- MongoDB Atlas
- JWT
- bcrypt

## Ejecutar en local

```bash
npm install
npm run dev
```

## Variables de entorno

Crear un archivo `.env` usando como base `.env.example`:

```env
VITE_API_URL=https://backend-portafolio-r87v.onrender.com
```

## Notas

- El frontend consume el backend desplegado en Render.
- Si el backend esta en cold start, la primera respuesta puede tardar. La app muestra un mensaje y reintenta una vez automaticamente.
- Para deploy en Vercel o Netlify se incluye configuracion SPA.

## Licencia

MIT
