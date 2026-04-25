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

const summary = computed(() => ({
  total: projects.value.length,
  active: projects.value.filter(project => project.status === "en progreso").length,
  done: projects.value.filter(project => project.status === "finalizado").length
}));

function statusLabel(status) {
  if (status === "pendiente") return "Pendiente";
  if (status === "en progreso") return "En progreso";
  return "Finalizado";
}

function statusClass(status) {
  return status.replaceAll(" ", "-");
}

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

    <section class="content app-fade">
      <header class="page-header">
        <div>
          <span class="eyebrow">Proyectos</span>
          <h1>Seguimiento, edición y control del estado de cada entrega.</h1>
          <p>Gestioná tus proyectos desde un tablero más limpio y accionable.</p>
        </div>

        <div class="summary-card">
          <strong>{{ summary.total }}</strong>
          <p>proyectos registrados · {{ summary.active }} activos · {{ summary.done }} cerrados</p>
        </div>
      </header>

      <section class="workspace-grid">
        <article class="panel composer-panel">
          <div class="panel-head">
            <div>
              <span class="panel-kicker">Nuevo proyecto</span>
              <h2>Agregar proyecto</h2>
            </div>
          </div>

          <div class="field-grid">
            <label class="field">
              <span>Título</span>
              <input v-model="newTitle" placeholder="Ej. Landing para producto SaaS" />
            </label>

            <label class="field">
              <span>Descripción</span>
              <textarea
                v-model="newDescription"
                rows="5"
                placeholder="Describí qué resuelve o qué objetivo tiene el proyecto"
              />
            </label>
          </div>

          <button @click="addProject" class="primary-btn">Agregar proyecto</button>
        </article>

        <article class="panel board-panel">
          <div class="panel-head">
            <div>
              <span class="panel-kicker">Tablero</span>
              <h2>Listado de proyectos</h2>
            </div>
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

          <ul v-if="!loading && filteredProjects.length > 0" class="projects-list">
            <li v-for="project in filteredProjects" :key="project._id" class="project-card">
              <div v-if="editingId !== project._id" class="project-info">
                <div class="project-header">
                  <div>
                    <strong @click="router.push(`/projects/${project._id}`)" class="project-link">
                      {{ project.title }}
                    </strong>
                    <p>{{ project.description }}</p>
                  </div>
                  <span class="status-pill" :class="statusClass(project.status)">
                    {{ statusLabel(project.status) }}
                  </span>
                </div>
              </div>

              <div v-else class="edit-form">
                <input v-model="editTitle" />
                <textarea v-model="editDescription" rows="4" />

                <select v-model="editStatus">
                  <option value="pendiente">Pendiente</option>
                  <option value="en progreso">En progreso</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

              <div class="actions" v-if="editingId !== project._id">
                <button @click="startEdit(project)" class="secondary-btn">Editar</button>
                <button class="danger-btn" @click="deleteProject(project._id)">
                  Eliminar
                </button>
              </div>

              <div class="actions" v-else>
                <button class="success-btn" @click="updateProject(project._id)">
                  Guardar
                </button>
                <button class="secondary-btn" @click="cancelEdit">
                  Cancelar
                </button>
              </div>
            </li>
          </ul>
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

.page-header {
  display: grid;
  grid-template-columns: 1.2fr 0.65fr;
  gap: 18px;
  margin-bottom: 24px;
}

.eyebrow,
.panel-kicker {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.76rem;
  font-weight: 800;
}

.page-header h1 {
  max-width: 18ch;
  margin-bottom: 10px;
  font-size: clamp(2.1rem, 2.8vw, 3.6rem);
  line-height: 1.04;
}

.page-header p {
  color: var(--muted);
  line-height: 1.8;
}

.summary-card,
.panel {
  border-radius: 28px;
  border: 1px solid rgba(22, 33, 29, 0.08);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: var(--shadow-md);
}

.summary-card {
  padding: 24px;
  display: grid;
  align-content: center;
  background:
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.14), transparent 42%),
    rgba(255, 255, 255, 0.78);
}

.summary-card strong {
  margin-bottom: 8px;
  font-size: clamp(2.4rem, 1.9rem + 2vw, 4rem);
}

.workspace-grid {
  display: grid;
  grid-template-columns: 0.82fr 1.18fr;
  gap: 18px;
}

.panel {
  padding: 24px;
}

.panel-head {
  margin-bottom: 18px;
}

.panel-head h2 {
  font-size: 1.55rem;
}

.field-grid {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 8px;
}

.field span {
  color: var(--muted);
  font-size: 0.95rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(22, 33, 29, 0.12);
  background: rgba(255, 255, 255, 0.92);
}

textarea {
  resize: vertical;
}

.primary-btn,
.secondary-btn,
.danger-btn,
.success-btn {
  padding: 12px 16px;
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.primary-btn {
  width: 100%;
  margin-top: 16px;
  background: linear-gradient(135deg, var(--primary), #14b8a6);
}

.secondary-btn {
  background: linear-gradient(135deg, #475569, #64748b);
}

.danger-btn {
  background: linear-gradient(135deg, #dc2626, #ef4444);
}

.success-btn {
  background: linear-gradient(135deg, #15803d, #22c55e);
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.projects-list {
  list-style: none;
  display: grid;
  gap: 12px;
}

.project-card {
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(22, 33, 29, 0.08);
  background: rgba(243, 245, 239, 0.98);
}

.project-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.project-link {
  display: inline-block;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 1.06rem;
}

.project-info p,
.info-message,
.empty-message {
  color: var(--muted);
  line-height: 1.8;
}

.status-pill {
  align-self: start;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  white-space: nowrap;
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

.edit-form {
  display: grid;
  gap: 10px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.info-message,
.empty-message,
.error-message {
  text-align: center;
  font-weight: 800;
  margin: 20px 0;
}

.info-message {
  color: var(--primary);
}

.error-message {
  color: var(--danger);
}

@media (max-width: 1150px) {
  .page-header,
  .workspace-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    max-width: 100%;
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

  .filters,
  .project-header,
  .actions {
    flex-direction: column;
  }

  .status-pill {
    white-space: normal;
  }
}
</style>
