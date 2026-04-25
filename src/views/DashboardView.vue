<script setup>
import { ref, onMounted, computed } from "vue";
import Sidebar from "../components/Sidebar.vue";
import StatCard from "../components/StatCard.vue";
import api from "../services/api";

const projects = ref([]);
const loading = ref(true);

const name = localStorage.getItem("userName") || "Usuario";
const email = localStorage.getItem("userEmail") || "";

async function fetchProjects() {
  try {
    const response = await api.get("/projects");
    projects.value = response.data;
  } catch (error) {
    console.log("Error al cargar estadísticas", error);
  } finally {
    loading.value = false;
  }
}

const totalProjects = computed(() => projects.value.length);

const pendingProjects = computed(() =>
  projects.value.filter(p => p.status === "pendiente").length
);

const progressProjects = computed(() =>
  projects.value.filter(p => p.status === "en progreso").length
);

const finishedProjects = computed(() =>
  projects.value.filter(p => p.status === "finalizado").length
);

onMounted(() => {
  fetchProjects();
});
</script>

<template>
  <main class="layout">
    <Sidebar />

    <section class="content">
      <header class="header">
        <h1>Dashboard</h1>
        <p>Bienvenido, {{ name }} — {{ email }}</p>
      </header>

      <p v-if="loading" class="loading">Cargando datos...</p>

      <section v-if="!loading" class="stats-grid">
        <StatCard
          title="Total de proyectos"
          :value="totalProjects"
          detail="Proyectos creados"
        />

        <StatCard
          title="Pendientes"
          :value="pendingProjects"
          detail="Todavía sin iniciar"
        />

        <StatCard
          title="En progreso"
          :value="progressProjects"
          detail="Proyectos activos"
        />

        <StatCard
          title="Finalizados"
          :value="finishedProjects"
          detail="Proyectos completados"
        />
      </section>
    </section>
  </main>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: #f1f5f9;
}

.content {
  flex: 1;
  padding: 36px;
}

.header {
  margin-bottom: 28px;
}

.header h1 {
  font-size: 34px;
  color: #0f172a;
}

.header p {
  color: #64748b;
}

.loading {
  text-align: center;
  font-weight: bold;
  color: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

@media (max-width: 1000px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .layout {
    flex-direction: column;
  }

  .content {
    padding: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>