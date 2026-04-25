<script setup>
defineProps({
  title: String,
  value: [String, Number],
  detail: String,
  tone: {
    type: String,
    default: "primary"
  }
});
</script>

<template>
  <article class="stat-card" :data-tone="tone">
    <p>{{ title }}</p>
    <h3>{{ value }}</h3>
    <span>{{ detail }}</span>
  </article>
</template>

<style scoped>
.stat-card {
  background: rgba(255, 255, 255, 0.78);
  padding: 24px;
  border-radius: 24px;
  border: 1px solid rgba(22, 33, 29, 0.08);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: var(--card-accent, var(--primary));
}

p {
  color: var(--muted);
  font-weight: 700;
  margin-bottom: 8px;
}

h3 {
  font-size: clamp(2rem, 1.7rem + 1vw, 2.8rem);
  color: var(--text);
  margin-bottom: 6px;
}

span {
  color: var(--muted);
}

[data-tone="primary"] {
  --card-accent: var(--primary);
}

[data-tone="warning"] {
  --card-accent: var(--warning);
}

[data-tone="accent"] {
  --card-accent: var(--accent);
}

[data-tone="success"] {
  --card-accent: var(--success);
}
</style>
