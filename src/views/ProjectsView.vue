<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
const router = useRouter();

const projects = ref([]);

const newTitle = ref("");
const newDescription = ref("");

const editingId = ref(null);
const editTitle = ref("");
const editDescription = ref("");
const editStatus = ref("pendiente");

const search = ref("");
const statusFilter = ref("todos");

const loading = ref(false);
const errorMessage = ref("");

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(search.value.toLowerCase());

    const matchesStatus =
      statusFilter.value === "todos" || project.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

async function fetchProjects() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/projects");
    projects.value = response.data;
  } catch (error) {
    errorMessage.value = "No se pudieron cargar los proyectos";
    console.log("Error al cargar proyectos", error);
  } finally {
    loading.value = false;
  }
}

async function addProject() {
  if (!newTitle.value || !newDescription.value) return;

  try {
    await api.post("/projects", {
      title: newTitle.value,
      description: newDescription.value
    });

    newTitle.value = "";
    newDescription.value = "";

    fetchProjects();
  } catch (error) {
    console.log("Error al crear proyecto", error);
  }
}

function startEdit(project) {
  editingId.value = project._id;
  editTitle.value = project.title;
  editDescription.value = project.description;
  editStatus.value = project.status;
}

function cancelEdit() {
  editingId.value = null;
  editTitle.value = "";
  editDescription.value = "";
  editStatus.value = "pendiente";
}

async function updateProject(id) {
  try {
    await api.put(`/projects/${id}`, {
      title: editTitle.value,
      description: editDescription.value,
      status: editStatus.value
    });

    cancelEdit();
    fetchProjects();
  } catch (error) {
    console.log("Error al actualizar proyecto", error);
  }
}

async function deleteProject(id) {
  const confirmDelete = confirm("¿Seguro que querés eliminar este proyecto?");

  if (!confirmDelete) return;

  try {
    await api.delete(`/projects/${id}`);
    fetchProjects();
  } catch (error) {
    console.log("Error al eliminar", error);
  }
}

onMounted(() => {
  fetchProjects();
});
</script>

<template>
  <main class="layout">
    <Sidebar />

    <section class="content">
      <header class="header">
        <h1>Proyectos</h1>
        <p>Gestioná tus proyectos</p>
      </header>

      <section class="card">
        <div class="form">
          <input v-model="newTitle" placeholder="Título" />
          <input v-model="newDescription" placeholder="Descripción" />
          <button @click="addProject">Agregar</button>
        </div>

        <div class="filters">
          <input v-model="search" placeholder="Buscar proyecto..." />

          <select v-model="statusFilter">
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="en progreso">En progreso</option>
            <option value="finalizado">Finalizados</option>
          </select>
        </div>

        <p v-if="loading" class="info-message">Cargando proyectos...</p>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <p v-if="!loading && filteredProjects.length === 0" class="empty-message">
          No hay proyectos para mostrar.
        </p>

        <ul v-if="!loading && filteredProjects.length > 0">
          <li v-for="project in filteredProjects" :key="project._id">
            <div v-if="editingId !== project._id" class="project-info">
              <strong @click="router.push(`/projects/${project._id}`)" style="cursor:pointer;">
  {{ project.title }}
</strong>
              <p>{{ project.description }}</p>
              <span>{{ project.status }}</span>
            </div>

            <div v-else class="edit-form">
              <input v-model="editTitle" />
              <input v-model="editDescription" />

              <select v-model="editStatus">
                <option value="pendiente">Pendiente</option>
                <option value="en progreso">En progreso</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>

            <div class="actions" v-if="editingId !== project._id">
              <button @click="startEdit(project)">Editar</button>
              <button class="danger" @click="deleteProject(project._id)">
                Eliminar
              </button>
            </div>

            <div class="actions" v-else>
              <button class="success" @click="updateProject(project._id)">
                Guardar
              </button>
              <button class="danger" @click="cancelEdit">
                Cancelar
              </button>
            </div>
          </li>
        </ul>
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
  margin-bottom: 20px;
}

.header h1 {
  font-size: 30px;
  color: #0f172a;
}

.header p {
  color: #64748b;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 18px;
}

.form,
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input,
select {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.danger {
  background: #ef4444;
}

.success {
  background: #16a34a;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 10px;
  padding: 14px;
  border: 1px solid #eee;
  border-radius: 14px;
  transition: 0.2s;
}

li:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
}

.project-info {
  flex: 1;
}

.project-info p {
  color: #475569;
  margin: 6px 0;
}

.project-info span {
  display: inline-block;
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: bold;
}

.edit-form {
  flex: 1;
  display: flex;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 8px;
}

.info-message,
.empty-message,
.error-message {
  text-align: center;
  font-weight: bold;
  margin: 20px 0;
}

.info-message {
  color: #2563eb;
}

.empty-message {
  color: #64748b;
}

.error-message {
  color: #ef4444;
}

@media (max-width: 760px) {
  .layout {
    flex-direction: column;
  }

  .content {
    padding: 24px;
  }

  .form,
  .filters,
  li,
  .edit-form,
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>