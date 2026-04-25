<script setup>
import { computed, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import api from "../services/api";

const router = useRouter();

const email = ref("");
const password = ref("");
const message = ref("");
const loading = ref(false);

const canSubmit = computed(() => email.value.trim() && password.value.trim());

async function login() {
  if (!canSubmit.value) {
    message.value = "Completá email y contraseña.";
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const response = await api.post("/login", {
      email: email.value,
      password: password.value
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userName", response.data.user.name);
    localStorage.setItem("userEmail", response.data.user.email);

    router.push("/dashboard");
  } catch (error) {
    message.value = error.response?.data?.message || "Error al iniciar sesión";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-shell app-fade">
      <article class="auth-brand">
        <span class="eyebrow">TaskFlow</span>
        <h1>Organizá proyectos, visualizá avances y trabajá con foco.</h1>
        <p>
          Una interfaz pensada para que el seguimiento de tareas y estados se sienta claro,
          rápido y profesional desde el primer vistazo.
        </p>

        <div class="feature-list">
          <span>Dashboard con métricas</span>
          <span>Estados de proyecto</span>
          <span>Edición rápida</span>
        </div>
      </article>

      <section class="auth-card">
        <span class="card-kicker">Acceso</span>
        <h2>Iniciar sesión</h2>
        <p>Entrá a tu espacio de trabajo y retomá tus proyectos.</p>

        <label class="field">
          <span>Email</span>
          <input v-model="email" type="email" placeholder="tuemail@mail.com" />
        </label>

        <label class="field">
          <span>Contraseña</span>
          <input v-model="password" type="password" placeholder="Tu contraseña" />
        </label>

        <button @click="login" :disabled="loading" class="primary-btn">
          {{ loading ? "Entrando..." : "Entrar a TaskFlow" }}
        </button>

        <p v-if="message" class="message">
          {{ message }}
        </p>

        <RouterLink to="/register" class="auth-link">
          No tengo cuenta, crear una ahora
        </RouterLink>
      </section>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 28px;
}

.auth-shell {
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: 1.05fr 0.85fr;
  gap: 22px;
}

.auth-brand,
.auth-card {
  border-radius: 30px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(18px);
}

.auth-brand {
  padding: 42px;
  background:
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.16), transparent 30%),
    linear-gradient(180deg, #17312b 0%, #10231f 100%);
  color: white;
}

.eyebrow,
.card-kicker {
  display: inline-block;
  margin-bottom: 18px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.76rem;
  font-weight: 800;
}

.eyebrow {
  color: #84f1df;
}

.auth-brand h1 {
  max-width: 12ch;
  margin-bottom: 18px;
  font-size: clamp(2.7rem, 5vw, 4.6rem);
  line-height: 0.98;
}

.auth-brand p {
  max-width: 52ch;
  color: rgba(232, 241, 237, 0.76);
  line-height: 1.9;
}

.feature-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.feature-list span {
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f6faf8;
  font-weight: 700;
}

.auth-card {
  padding: 34px;
  background: rgba(255, 255, 255, 0.82);
}

.card-kicker {
  color: var(--primary);
}

.auth-card h2 {
  margin-bottom: 8px;
  font-size: 2rem;
}

.auth-card > p {
  color: var(--muted);
  margin-bottom: 20px;
  line-height: 1.7;
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}

.field span {
  color: var(--muted);
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(22, 33, 29, 0.12);
  background: rgba(255, 255, 255, 0.84);
}

.primary-btn {
  width: 100%;
  margin-top: 10px;
  padding: 14px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), #14b8a6);
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.primary-btn:disabled {
  opacity: 0.68;
  cursor: not-allowed;
}

.message {
  margin-top: 14px;
  color: var(--danger);
  font-weight: 700;
}

.auth-link {
  display: inline-block;
  margin-top: 18px;
  color: var(--primary);
  font-weight: 800;
}

@media (max-width: 900px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }

  .auth-brand h1 {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .auth-page {
    padding: 16px;
  }

  .auth-brand,
  .auth-card {
    padding: 24px;
  }
}
</style>
