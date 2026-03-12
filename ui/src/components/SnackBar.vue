<template>
  <v-snackbar
    v-model="showLocal"
    :timeout="timeout"
    :color="snackbarColor"
    location="bottom right"
    rounded="lg"
  >
    <div class="d-flex align-center" style="gap: 8px;">
      <v-icon v-if="level === 'error'" size="small">mdi-alert-circle-outline</v-icon>
      <v-icon v-else-if="level === 'warning'" size="small">mdi-alert-outline</v-icon>
      <v-icon v-else size="small">mdi-check-circle-outline</v-icon>
      {{ message }}
    </div>
    <template v-slot:actions>
      <v-btn variant="text" size="small" @click="closeSnackbar">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" src="./SnackBar.ts"></script>
