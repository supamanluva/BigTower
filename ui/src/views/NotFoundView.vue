<template>
  <div class="d-flex flex-column align-center justify-center" style="min-height: 60vh;">
    <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-map-marker-question-outline</v-icon>
    <div class="text-h4 font-weight-bold mb-2">Page not found</div>
    <div class="text-body-1 text-medium-emphasis mb-6">
      The page you're looking for doesn't exist.
    </div>
    <v-btn color="secondary" to="/" variant="flat">
      <v-icon start>mdi-home-outline</v-icon>
      Back to Dashboard
    </v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>
