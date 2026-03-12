<template>
  <v-container fluid>
    <v-row v-if="triggers.length > 0">
      <v-col v-for="trigger in triggers" :key="trigger.id" lg="6" sm="12">
        <container-trigger
          :trigger="trigger"
          :update-available="container.updateAvailable"
          :container-id="container.id"
        />
      </v-col>
    </v-row>
    <v-card-text v-else class="text-center text-medium-emphasis py-6">
      <v-icon size="32" color="grey-lighten-1" class="mb-2">mdi-bell-off-outline</v-icon>
      <div>No actions configured for this container</div>
      <div class="text-caption text-disabled mt-1">Actions are set up via environment variables (BT_TRIGGER_*)</div>
    </v-card-text>
  </v-container>
</template>

<script lang="ts" src="./ContainerTriggers.ts"></script>
