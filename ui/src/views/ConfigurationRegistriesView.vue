<template>
  <div>
    <div v-if="registries.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-database-outline</v-icon>
      <div class="text-h6 text-medium-emphasis">No registries configured</div>
    </div>
    <div v-else class="d-flex flex-column" style="gap: 8px;">
      <configuration-item
        v-for="registry in registries"
        :key="registry.id"
        :item="registry"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ConfigurationRegistriesView.ts"></script>
