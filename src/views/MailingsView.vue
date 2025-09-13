<script setup>
import { RouterView, RouterLink } from 'vue-router';
</script>

<template>
  <h1>This is mailings page</h1>

  <ul>
    <li><RouterLink to="/mailings/create">Create</RouterLink></li>
    <li><RouterLink to="/mailings/1">Show</RouterLink></li>
  </ul>

  <RouterView />
</template>
