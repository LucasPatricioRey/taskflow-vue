<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const userName = localStorage.getItem("userName") || "Usuario";
const userEmail = localStorage.getItem("userEmail") || "workspace@taskflow.app";

const navItems = computed(() => [
  {
    label: "Dashboard",
    to: "/dashboard",
    helper: "Resumen y métricas"
  },
  {
    label: "Proyectos",
    to: "/projects",
    helper: "Seguimiento y edición"
  }
]);

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  router.push("/login");
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <div class="brand-card">
        <span class="brand-kicker">Workspace</span>
        <h2>TaskFlow</h2>
        <p>Gestión de proyectos con foco en claridad, estado y progreso real.</p>
      </div>

      <div class="user-card">
        <span class="avatar">{{ userName.charAt(0).toUpperCase() }}</span>
        <div>
          <strong>{{ userName }}</strong>
          <p>{{ userEmail }}</p>
        </div>
      </div>

      <nav>
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
        >
          <div>
            <strong>{{ item.label }}</strong>
            <span>{{ item.helper }}</span>
          </div>
          <small>{{ route.path === item.to ? "Activo" : "Ir" }}</small>
        </RouterLink>
      </nav>
    </div>

    <button @click="logout" class="logout-btn">Cerrar sesión</button>
  </aside>
</template>

<style scoped>
.sidebar {
  min-height: 100vh;
  width: 300px;
  position: sticky;
  top: 0;
  background: linear-gradient(180deg, #15211d 0%, #101916 100%);
  color: white;
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-top {
  display: grid;
  gap: 18px;
}

.brand-card,
.user-card,
.nav-link {
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
}

.brand-card {
  padding: 20px;
}

.brand-kicker {
  display: inline-block;
  margin-bottom: 10px;
  color: #84f1df;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.74rem;
  font-weight: 800;
}

.brand-card h2 {
  margin-bottom: 6px;
  font-size: 1.9rem;
}

.brand-card p {
  color: rgba(232, 241, 237, 0.76);
  line-height: 1.7;
  font-size: 0.96rem;
}

.user-card {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #0f766e, #2dd4bf);
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
}

.user-card strong {
  display: block;
  margin-bottom: 4px;
}

.user-card p {
  color: rgba(232, 241, 237, 0.68);
  font-size: 0.9rem;
  word-break: break-word;
}

nav {
  display: grid;
  gap: 10px;
}

.nav-link {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: rgba(232, 241, 237, 0.84);
}

.nav-link strong {
  display: block;
  margin-bottom: 4px;
}

.nav-link span,
.nav-link small {
  color: rgba(232, 241, 237, 0.62);
  font-size: 0.86rem;
}

.nav-link.router-link-active {
  border-color: rgba(132, 241, 223, 0.25);
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.36), rgba(255, 255, 255, 0.06));
}

.nav-link.router-link-active small {
  color: #84f1df;
}

.logout-btn {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 16px;
  font-weight: 800;
  cursor: pointer;
}

@media (max-width: 900px) {
  .sidebar {
    width: 100%;
    min-height: auto;
    position: static;
    padding: 18px;
  }
}
</style>
