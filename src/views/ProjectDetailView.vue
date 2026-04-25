<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";
import Sidebar from "../components/Sidebar.vue";

const route = useRoute();
const router = useRouter();

const project = ref(null);
const loading = ref(true);
const error = ref("");

const projectId = route.params.id;

const statusLabel = computed(() => {
  if (!project.value) return "";
  if (project.value.status === "pendiente") return "Pendiente";
  if (project.value.status === "en progreso") return "En progreso";
  return "Finalizado";
});

const statusClass = computed(() => project.value?.status?.replaceAll(" ", "-") || "");

async function fetchProject() {
  try {
    const response = await api.get("/projects");
    const found = response.data.find(projectItem => projectItem._id === projectId);

    if (!found) {
      error.value = "Proyecto no encontrado";
      return;
    }

    project.value = found;
  } catch (err) {
    error.value = "Error al cargar el proyecto";
    console.log(err);
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push("/projects");
}

onMounted(() => {
  fetchProject();
});
</script>

<template>
  <main class="layout">
    <Sidebar />

    <section class="content app-fade">
      <button class="back" @click="goBack">Volver a proyectos</button>

      <p v-if="loading" class="loading">Cargando proyecto...</p>

      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="project" class="detail-shell">
        <article class="detail-card">
          <span class="eyebrow">Detalle</span>
          <h1>{{ project.title }}</h1>

          <p class="description">
            {{ project.description }}
          </p>

          <span class="status" :class="statusClass">{{ statusLabel }}</span>
        </article>

        <aside class="side-card">
          <span class="card-kicker">Resumen</span>
          <h2>Estado del proyecto</h2>
          <p>
            Revisá la información principal del proyecto y usá el tablero para editarlo,
            cambiar su estado o continuar el seguimiento.
          </p>
        </aside>
      </div>
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

.back {
  margin-bottom: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.7);
  color: var(--primary);
  padding: 12px 14px;
  border-radius: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: var(--shadow-md);
}

.loading {
  color: var(--primary);
  font-weight: 800;
}

.detail-shell {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
}

.detail-card,
.side-card {
  border-radius: 28px;
  border: 1px solid rgba(22, 33, 29, 0.08);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: var(--shadow-md);
}

.detail-card {
  padding: 30px;
}

.eyebrow,
.card-kicker {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.76rem;
  font-weight: 800;
}

h1 {
  margin-bottom: 14px;
  font-size: clamp(2.2rem, 3vw, 3.5rem);
  line-height: 1.03;
}

.description,
.side-card p {
  color: var(--muted);
  line-height: 1.85;
}

.status {
  display: inline-block;
  margin-top: 18px;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 800;
}

.pendiente {
  background: #fff3d6;
  color: #b45309;
}

.en-progreso {
  background: #dff5ff;
  color: #0369a1;
}

.finalizado {
  background: #dcfce7;
  color: #166534;
}

.side-card {
  padding: 26px;
}

.side-card h2 {
  margin-bottom: 10px;
  font-size: 1.6rem;
}

.error {
  color: var(--danger);
  font-weight: 800;
}

@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }

  .detail-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .content {
    padding: 20px;
  }
}
</style>
