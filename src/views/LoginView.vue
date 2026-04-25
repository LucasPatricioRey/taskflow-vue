<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import api from "../services/api";

const router = useRouter();

const email = ref("");
const password = ref("");
const message = ref("");

async function login() {
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
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <h1>Iniciar sesión</h1>
      <p>Entrá a tu dashboard profesional.</p>

      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Contraseña" />

      <button @click="login">Entrar</button>

      <p class="message">{{ message }}</p>

      <RouterLink to="/register">No tengo cuenta, registrarme</RouterLink>
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
}

.message {
  margin-top: 14px;
  color: #dc2626;
}
</style>