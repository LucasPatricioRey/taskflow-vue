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
  projects.value.filter(project => project.status === "pendiente").length
);
const progressProjects = computed(() =>
  projects.value.filter(project => project.status === "en progreso").length
);
const finishedProjects = computed(() =>
  projects.value.filter(project => project.status === "finalizado").length
);

const completionRate = computed(() => {
  if (!projects.value.length) return "0%";
  return `${Math.round((finishedProjects.value / projects.value.length) * 100)}%`;
});

const latestProjects = computed(() => projects.value.slice(0, 3));

onMounted(() => {
  fetchProjects();
});
</script>

<template>
  <main class="layout">
    <Sidebar />

    <section class="content app-fade">
      <header class="page-hero">
        <div>
          <span class="eyebrow">Dashboard</span>
          <h1>Vista general de tu espacio de trabajo.</h1>
          <p>
            {{ name }} · {{ email || "Workspace activo" }}
          </p>
        </div>

        <article class="hero-note">
          <span>Ritmo actual</span>
          <strong>{{ completionRate }}</strong>
          <p>de los proyectos ya están marcados como finalizados.</p>
        </article>
      </header>

      <p v-if="loading" class="loading">Cargando datos...</p>

      <section v-if="!loading" class="stats-grid">
        <StatCard
          title="Total de proyectos"
          :value="totalProjects"
          detail="Base actual de trabajo"
          tone="primary"
        />

        <StatCard
          title="Pendientes"
          :value="pendingProjects"
          detail="Tareas todavía sin iniciar"
          tone="warning"
        />

        <StatCard
          title="En progreso"
          :value="progressProjects"
          detail="Frentes activos en este momento"
          tone="accent"
        />

        <StatCard
          title="Finalizados"
          :value="finishedProjects"
          detail="Entregas completadas"
          tone="success"
        />
      </section>

      <section v-if="!loading" class="overview-grid">
        <article class="overview-card">
          <div class="card-head">
            <div>
              <span class="card-kicker">Resumen</span>
              <h2>Estado del workspace</h2>
            </div>
          </div>

          <div class="progress-rail">
            <div class="progress-fill" :style="{ width: completionRate }"></div>
          </div>

          <p class="overview-text">
            TaskFlow te está mostrando una visión rápida del trabajo actual:
            qué está pendiente, qué sigue en progreso y cuánto ya quedó terminado.
          </p>
        </article>

        <article class="overview-card">
          <div class="card-head">
            <div>
              <span class="card-kicker">Actividad reciente</span>
              <h2>Últimos proyectos</h2>
            </div>
          </div>

          <div v-if="latestProjects.length" class="mini-list">
            <div v-for="project in latestProjects" :key="project._id" class="mini-item">
              <div>
                <strong>{{ project.title }}</strong>
                <p>{{ project.description }}</p>
              </div>
              <span class="status-pill">{{ project.status }}</span>
            </div>
          </div>

          <p v-else class="empty-message">
            Todavía no hay proyectos cargados para mostrar actividad reciente.
          </p>
        </article>
      </section>
    </section>
  </main>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
}

.content {
  flex: 1;
  padding: 34px;
}

.page-hero {
  display: grid;
  grid-template-columns: 1.3fr 0.8fr;
  gap: 18px;
  margin-bottom: 24px;
}

.eyebrow,
.card-kicker {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.76rem;
  font-weight: 800;
}

.page-hero h1 {
  margin-bottom: 10px;
  font-size: clamp(2.2rem, 3vw, 3.7rem);
  line-height: 1.02;
}

.page-hero p {
  color: var(--muted);
  line-height: 1.8;
}

.hero-note,
.overview-card {
  border-radius: 28px;
  border: 1px solid rgba(22, 33, 29, 0.08);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: var(--shadow-md);
}

.hero-note {
  padding: 26px;
  background:
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.16), transparent 38%),
    rgba(255, 255, 255, 0.78);
}

.hero-note span {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.hero-note strong {
  display: block;
  margin-bottom: 8px;
  font-size: clamp(2.5rem, 2rem + 2vw, 4rem);
}

.loading {
  text-align: center;
  font-weight: 800;
  color: var(--primary);
  margin: 24px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.overview-card {
  padding: 24px;
}

.card-head {
  margin-bottom: 18px;
}

.card-head h2 {
  font-size: 1.55rem;
}

.progress-rail {
  height: 12px;
  border-radius: 999px;
  background: #dbe4dc;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--primary), #2dd4bf);
}

.overview-text,
.mini-item p,
.empty-message {
  color: var(--muted);
  line-height: 1.8;
}

.mini-list {
  display: grid;
  gap: 12px;
}

.mini-item {
  padding: 16px;
  border-radius: 18px;
  background: rgba(243, 245, 239, 0.95);
  border: 1px solid rgba(22, 33, 29, 0.08);
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.mini-item strong {
  display: block;
  margin-bottom: 6px;
}

.status-pill {
  align-self: start;
  padding: 8px 10px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary-strong);
  font-size: 0.82rem;
  font-weight: 800;
  white-space: nowrap;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .page-hero,
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .content {
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .mini-item {
    flex-direction: column;
  }
}
</style>
