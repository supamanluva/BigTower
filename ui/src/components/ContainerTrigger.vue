<template>
  <v-card variant="outlined" rounded="lg">
    <v-list-item class="py-2">
      <template v-slot:prepend>
        <v-icon color="secondary">mdi-bell-ring-outline</v-icon>
      </template>
      <v-list-item-title class="text-capitalize text-body-2 font-weight-medium">
        <router-link to="/settings" class="text-decoration-none">
          {{ trigger.type }} — {{ trigger.name }}
        </router-link>
      </v-list-item-title>
      <v-list-item-subtitle class="text-caption">
        Runs on {{ thresholdLabel }} updates
      </v-list-item-subtitle>
      <template v-slot:append>
        <v-btn
          variant="tonal"
          color="accent"
          size="small"
          :disabled="!updateAvailable"
          @click="runTrigger"
          :loading="isTriggering"
        >
          <v-icon start size="small">mdi-play</v-icon>
          Run
        </v-btn>
      </template>
    </v-list-item>
  </v-card>
</template>

<script lang="ts" src="./ContainerTrigger.ts"></script>
