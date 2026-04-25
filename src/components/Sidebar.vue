<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const userName = localStorage.getItem("userName") || "Usuario";

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  router.push("/login");
}
</script>

<template>
  <aside class="sidebar">
    <div>
      <h2>TaskFlow</h2>
      <p>Panel de gestión</p>

      <p class="user">
        {{ userName }}
      </p>

      <nav>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/projects">Proyectos</RouterLink>
      </nav>
    </div>

    <button @click="logout">Cerrar sesión</button>
  </aside>
</template>

<style scoped>
.sidebar {
  min-height: 100vh;
  width: 260px;
  background: #020617;
  color: white;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h2 {
  margin-bottom: 4px;
}

p {
  color: #94a3b8;
  margin-bottom: 16px;
}

.user {
  font-size: 14px;
  color: #cbd5e1;
  background: #0f172a;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 24px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

a {
  color: #cbd5e1;
  text-decoration: none;
  padding: 12px;
  border-radius: 12px;
}

a.router-link-active {
  background: #2563eb;
  color: white;
}

button {
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
}
</style>