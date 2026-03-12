<template>
  <v-app-bar app flat :elevation="1" color="surface">
    <div class="d-flex align-center pl-4" style="gap: 8px;">
      <div>
        <div class="text-subtitle-1 font-weight-bold text-high-emphasis">
          {{ pageTitle }}
        </div>
        <v-breadcrumbs
          v-if="breadcrumbs.length > 1"
          :items="breadcrumbs"
          density="compact"
          class="pa-0 text-caption"
        >
          <template v-slot:divider>
            <v-icon size="x-small">mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </div>
    </div>

    <v-spacer />

    <v-btn
      icon
      variant="text"
      size="small"
      class="mr-1"
      @click="refreshCurrentPage"
    >
      <v-icon size="small">mdi-refresh</v-icon>
      <v-tooltip activator="parent" location="bottom">Refresh</v-tooltip>
    </v-btn>

    <v-menu v-if="user && user.username !== 'anonymous'">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          size="small"
          class="text-none mr-2"
        >
          <v-avatar size="28" color="secondary" class="mr-2">
            <span class="text-white text-caption font-weight-bold">
              {{ userInitial }}
            </span>
          </v-avatar>
          {{ user.username }}
          <v-icon size="small" class="ml-1">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list density="compact" min-width="180">
        <v-list-item @click="showPasswordDialog = true" prepend-icon="mdi-key-variant">
          <v-list-item-title class="text-body-2">Change Password</v-list-item-title>
        </v-list-item>
        <v-divider class="my-1" />
        <v-list-item @click="logout" prepend-icon="mdi-logout">
          <v-list-item-title class="text-body-2">Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Change Password Dialog -->
    <v-dialog v-model="showPasswordDialog" max-width="400" persistent>
      <v-card rounded="lg">
        <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2 d-flex align-center">
          <v-icon size="small" class="mr-2" color="secondary">mdi-key-variant</v-icon>
          Change Password
        </v-card-title>
        <v-card-text class="pa-4 pt-2">
          <v-text-field
            v-model="currentPassword"
            label="Current Password"
            type="password"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="mb-3"
            :error-messages="passwordError"
          />
          <v-text-field
            v-model="newPassword"
            label="New Password"
            type="password"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="mb-3"
          />
          <v-text-field
            v-model="confirmPassword"
            label="Confirm New Password"
            type="password"
            variant="outlined"
            density="compact"
            hide-details="auto"
            :error-messages="confirmError"
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" size="small" @click="closePasswordDialog">Cancel</v-btn>
          <v-btn
            color="secondary"
            variant="tonal"
            size="small"
            :loading="changingPassword"
            :disabled="!canChangePassword"
            @click="changePassword"
          >
            Change Password
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>
<script lang="ts" src="./AppBar.ts"></script>
