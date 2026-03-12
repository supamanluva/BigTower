<template>
  <div>
    <div v-if="watchers.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-update</v-icon>
      <div class="text-h6 text-medium-emphasis">No watchers configured</div>
    </div>
    <div v-else class="d-flex flex-column" style="gap: 8px;">
      <configuration-item
        v-for="watcher in watchers"
        :key="watcher.name"
        :item="watcher"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ConfigurationWatchersView.ts"></script>
