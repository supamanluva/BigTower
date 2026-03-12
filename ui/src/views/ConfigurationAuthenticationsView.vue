<template>
  <div>
    <div v-if="authentications.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-shield-lock-outline</v-icon>
      <div class="text-h6 text-medium-emphasis">No authentication configured</div>
    </div>
    <div v-else class="d-flex flex-column" style="gap: 8px;">
      <configuration-item
        v-for="auth in authentications"
        :key="auth.id"
        :item="auth"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ConfigurationAuthenticationsView.ts"></script>
