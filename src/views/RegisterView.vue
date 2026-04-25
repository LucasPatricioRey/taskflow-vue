<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import api from "../services/api";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");

const loading = ref(false);
const message = ref("");
const success = ref(false);

async function register() {
  if (!name.value || !email.value || !password.value) {
    message.value = "Completá todos los campos";
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
    <section class="auth-card">
      <h1>Crear cuenta</h1>
      <p>Registrate para gestionar tus proyectos.</p>

      <input v-model="name" type="text" placeholder="Nombre" />
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Contraseña" />

      <button @click="register" :disabled="loading">
        {{ loading ? "Registrando..." : "Registrarme" }}
      </button>

      <p
        v-if="message"
        class="message"
        :class="{ success: success, error: !success }"
      >
        {{ message }}
      </p>

      <RouterLink to="/login">Ya tengo cuenta, iniciar sesión</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0f172a;
  color: white;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: white;
  color: #0f172a;
  padding: 28px;
  border-radius: 20px;
}

.auth-card h1 {
  margin-bottom: 8px;
}

.auth-card p {
  color: #64748b;
  margin-bottom: 18px;
}

input {
  width: 100%;
  padding: 13px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
}

button {
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 14px;
}

button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.message {
  font-weight: bold;
  margin-bottom: 14px;
}

.success {
  color: #16a34a !important;
}

.error {
  color: #dc2626 !important;
}

a {
  color: #2563eb;
  font-weight: bold;
}
</style>