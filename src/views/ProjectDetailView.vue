<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";
import Sidebar from "../components/Sidebar.vue";

const route = useRoute();
const router = useRouter();

const project = ref(null);
const loading = ref(true);
const error = ref("");

const projectId = route.params.id;

async function fetchProject() {
  try {
    const response = await api.get("/projects");
    const found = response.data.find(p => p._id === projectId);

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

    <section class="content">
      <button class="back" @click="goBack">← Volver</button>

      <p v-if="loading">Cargando proyecto...</p>

      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="project" class="card">
        <h1>{{ project.title }}</h1>

        <p class="description">
          {{ project.description }}
        </p>

        <span class="status">{{ project.status }}</span>
      </div>
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

.back {
  margin-bottom: 20px;
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
  color: #2563eb;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 18px;
}

h1 {
  font-size: 32px;
  margin-bottom: 14px;
}

.description {
  color: #475569;
  margin-bottom: 14px;
}

.status {
  display: inline-block;
  background: #e0f2fe;
  color: #0369a1;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: bold;
}

.error {
  color: #ef4444;
  font-weight: bold;
}
</style>