import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import ProjectDetailView from "../views/ProjectDetailView.vue";

const routes = [
  { path: "/", redirect: "/login" },

  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },

  { path: "/dashboard", component: DashboardView, meta: { requiresAuth: true } },
  { path: "/projects", component: ProjectsView, meta: { requiresAuth: true } },
  { path: "/projects/:id", component: ProjectDetailView, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🔥 PROTECCIÓN DE RUTAS
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;