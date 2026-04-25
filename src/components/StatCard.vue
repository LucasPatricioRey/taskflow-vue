<script setup>
defineProps({
  title: String,
  value: [String, Number],
  detail: String
});
</script>

<template>
  <article class="stat-card">
    <p>{{ title }}</p>
    <h3>{{ value }}</h3>
    <span>{{ detail }}</span>
  </article>
</template>

<style scoped>
.stat-card {
  background: white;
  padding: 22px;
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
}

p {
  color: #64748b;
  font-weight: 700;
  margin-bottom: 8px;
}

h3 {
  font-size: 32px;
  color: #0f172a;
  margin-bottom: 6px;
}

span {
  color: #94a3b8;
}
</style>