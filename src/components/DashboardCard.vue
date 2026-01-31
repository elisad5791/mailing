<script setup>
defineProps(['title', 'value', 'icon']);
</script>

<template>
  <v-card color="primary" variant="tonal" class="mx-auto" :prepend-icon="icon">
    <v-card-item>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text class="text-uppercase font-weight-black text-h6">
        {{ value }}
      </v-card-text>
    </v-card-item>
  </v-card>
</template>
