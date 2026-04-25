<script setup>
import { computed, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import api from "../services/api";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");

const loading = ref(false);
const message = ref("");
const success = ref(false);

const canSubmit = computed(() =>
  name.value.trim() && email.value.trim() && password.value.trim()
);

async function register() {
  if (!canSubmit.value) {
    message.value = "Completá todos los campos.";
    success.value = false;
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const response = await api.post("/register", {
      name: name.value,
      email: email.value,
      password: password.value
    });

    message.value = response.data.message;
    success.value = true;

    name.value = "";
    email.value = "";
    password.value = "";

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  } catch (error) {
    message.value = error.response?.data?.message || "Error al registrar usuario";
    success.value = false;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-shell app-fade">
      <article class="auth-brand">
        <span class="eyebrow">Nuevo workspace</span>
        <h1>Creá tu cuenta y empezá a seguir proyectos con una experiencia más clara.</h1>
        <p>
          TaskFlow te permite registrar proyectos, cambiar estados, revisar avances y tener una
          visión simple del trabajo activo desde un panel central.
        </p>

        <div class="feature-list">
          <span>Registro rápido</span>
          <span>Dashboard visual</span>
          <span>Control de estados</span>
        </div>
      </article>

      <section class="auth-card">
        <span class="card-kicker">Registro</span>
        <h2>Crear cuenta</h2>
        <p>Configurá tu acceso para empezar a gestionar proyectos.</p>

        <label class="field">
          <span>Nombre</span>
          <input v-model="name" type="text" placeholder="Tu nombre" />
        </label>

        <label class="field">
          <span>Email</span>
          <input v-model="email" type="email" placeholder="tuemail@mail.com" />
        </label>

        <label class="field">
          <span>Contraseña</span>
          <input v-model="password" type="password" placeholder="Elegí una contraseña" />
        </label>

        <button @click="register" :disabled="loading" class="primary-btn">
          {{ loading ? "Registrando..." : "Crear cuenta" }}
        </button>

        <p
          v-if="message"
          class="message"
          :class="{ success: success, error: !success }"
        >
          {{ message }}
        </p>

        <RouterLink to="/login" class="auth-link">
          Ya tengo cuenta, iniciar sesión
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
    radial-gradient(circle at top right, rgba(217, 119, 6, 0.18), transparent 30%),
    linear-gradient(180deg, #1f2f2a 0%, #14211d 100%);
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
  color: #f6c67f;
}

.auth-brand h1 {
  max-width: 13ch;
  margin-bottom: 18px;
  font-size: clamp(2.6rem, 5vw, 4.4rem);
  line-height: 1;
}

.auth-brand p {
  max-width: 54ch;
  color: rgba(232, 241, 237, 0.78);
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
  color: var(--accent);
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
  background: linear-gradient(135deg, var(--accent), #f59e0b);
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
  font-weight: 700;
}

.success {
  color: var(--success);
}

.error {
  color: var(--danger);
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
