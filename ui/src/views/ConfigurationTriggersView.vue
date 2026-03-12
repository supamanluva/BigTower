<template>
  <div>
    <div v-if="triggers.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-bell-ring-outline</v-icon>
      <div class="text-h6 text-medium-emphasis">No triggers configured</div>
    </div>
    <div v-else class="d-flex flex-column" style="gap: 8px;">
      <trigger-detail
        v-for="trigger in triggers"
        :key="trigger.id"
        :trigger="trigger"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ConfigurationTriggersView.ts"></script>
