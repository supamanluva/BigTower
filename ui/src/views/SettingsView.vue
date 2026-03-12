<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center mb-4">
      <div>
        <div class="text-h6 font-weight-bold">Settings</div>
        <div class="text-body-2 text-medium-emphasis">
          Manage your BigTower configuration. You can edit existing settings, add new components, or remove ones you no longer need.
          Changes are saved instantly and applied live.
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="secondary" size="40" />
      <div class="text-body-2 text-medium-emphasis mt-3">Loading configuration&hellip;</div>
    </div>

    <!-- Content -->
    <v-card v-else rounded="lg">
      <v-tabs v-model="tab" color="secondary" grow>
        <v-tab value="watchers">
          <v-icon start size="small">mdi-docker</v-icon>
          Watchers
          <v-chip v-if="watchers.length" size="x-small" class="ml-2" variant="tonal" color="secondary">
            {{ watchers.length }}
          </v-chip>
        </v-tab>
        <v-tab value="registries">
          <v-icon start size="small">mdi-database-outline</v-icon>
          Registries
          <v-chip v-if="registries.length" size="x-small" class="ml-2" variant="tonal" color="secondary">
            {{ registries.length }}
          </v-chip>
        </v-tab>
        <v-tab value="triggers">
          <v-icon start size="small">mdi-bell-ring-outline</v-icon>
          Actions
          <v-chip v-if="triggers.length" size="x-small" class="ml-2" variant="tonal" color="secondary">
            {{ triggers.length }}
          </v-chip>
        </v-tab>
        <v-tab value="auth">
          <v-icon start size="small">mdi-shield-lock-outline</v-icon>
          Authentication
          <v-chip v-if="authentications.length" size="x-small" class="ml-2" variant="tonal" color="secondary">
            {{ authentications.length }}
          </v-chip>
        </v-tab>
      </v-tabs>

      <v-divider />

      <v-window v-model="tab">
        <!-- Watchers tab -->
        <v-window-item value="watchers">
          <div class="pa-4">
            <v-alert type="info" variant="tonal" density="compact" class="mb-4" border="start">
              <div class="text-body-2">
                <strong>Watchers</strong> connect to your Docker hosts and periodically check containers for image updates.
                Click the <v-icon size="x-small">mdi-pencil-outline</v-icon> icon to edit or <v-icon size="x-small">mdi-delete-outline</v-icon> to remove.
              </div>
            </v-alert>
            <div v-if="errors.watchers" class="text-center py-6">
              <v-icon size="40" color="error" class="mb-2">mdi-alert-circle-outline</v-icon>
              <div class="text-body-2 text-error">Failed to load watchers</div>
              <div class="text-caption text-medium-emphasis mt-1">{{ errors.watchers }}</div>
            </div>
            <div v-else-if="watchers.length === 0" class="text-center py-6">
              <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-docker</v-icon>
              <div class="text-body-1 text-medium-emphasis">No watchers configured yet</div>
              <div class="text-caption text-disabled mt-1">Click "Add Watcher" below to get started.</div>
            </div>
            <div v-else class="d-flex flex-column" style="gap: 8px;">
              <configuration-item
                v-for="watcher in watchers"
                :key="watcher.id"
                :item="watcher"
                :editable="true"
                :on-update="handleUpdateWatcher"
                :on-delete="handleDeleteWatcher"
              />
            </div>
            <div class="mt-3">
              <v-btn variant="tonal" color="secondary" size="small" @click="openAddDialog('watcher')">
                <v-icon start size="small">mdi-plus</v-icon>
                Add Watcher
              </v-btn>
            </div>
          </div>
        </v-window-item>

        <!-- Registries tab -->
        <v-window-item value="registries">
          <div class="pa-4">
            <v-alert type="info" variant="tonal" density="compact" class="mb-4" border="start">
              <div class="text-body-2">
                <strong>Registries</strong> connect to Docker Hub, GHCR, and other image sources.
                Public registries work by default. Add private registries here with credentials.
              </div>
            </v-alert>
            <div v-if="errors.registries" class="text-center py-6">
              <v-icon size="40" color="error" class="mb-2">mdi-alert-circle-outline</v-icon>
              <div class="text-body-2 text-error">Failed to load registries</div>
              <div class="text-caption text-medium-emphasis mt-1">{{ errors.registries }}</div>
            </div>
            <div v-else-if="registries.length === 0" class="text-center py-6">
              <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-database-outline</v-icon>
              <div class="text-body-1 text-medium-emphasis">No registries configured</div>
            </div>
            <div v-else class="d-flex flex-column" style="gap: 8px;">
              <configuration-item
                v-for="registry in registries"
                :key="registry.id"
                :item="registry"
                :editable="true"
                :on-update="handleUpdateRegistry"
                :on-delete="handleDeleteRegistry"
              />
            </div>
            <div class="mt-3">
              <v-btn variant="tonal" color="secondary" size="small" @click="openAddDialog('registry')">
                <v-icon start size="small">mdi-plus</v-icon>
                Add Registry
              </v-btn>
            </div>
          </div>
        </v-window-item>

        <!-- Triggers tab -->
        <v-window-item value="triggers">
          <div class="pa-4">
            <v-alert type="info" variant="tonal" density="compact" class="mb-4" border="start">
              <div class="text-body-2">
                <strong>Actions</strong> define what happens when an update is found &mdash; send notifications, auto-update containers, call webhooks, etc.
              </div>
            </v-alert>
            <div v-if="errors.triggers" class="text-center py-6">
              <v-icon size="40" color="error" class="mb-2">mdi-alert-circle-outline</v-icon>
              <div class="text-body-2 text-error">Failed to load actions</div>
              <div class="text-caption text-medium-emphasis mt-1">{{ errors.triggers }}</div>
            </div>
            <div v-else-if="triggers.length === 0" class="text-center py-6">
              <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-bell-ring-outline</v-icon>
              <div class="text-body-1 text-medium-emphasis">No actions configured yet</div>
              <div class="text-caption text-disabled mt-1">Click "Add Action" to set up notifications or auto-updates.</div>
            </div>
            <div v-else class="d-flex flex-column" style="gap: 8px;">
              <trigger-detail
                v-for="trigger in triggers"
                :key="trigger.id"
                :trigger="trigger"
                :editable="true"
                :on-update="handleUpdateTrigger"
                :on-delete="handleDeleteTrigger"
              />
            </div>
            <div class="mt-3">
              <v-btn variant="tonal" color="secondary" size="small" @click="openAddDialog('trigger')">
                <v-icon start size="small">mdi-plus</v-icon>
                Add Action
              </v-btn>
            </div>
          </div>
        </v-window-item>

        <!-- Auth tab -->
        <v-window-item value="auth">
          <div class="pa-4">
            <v-alert type="info" variant="tonal" density="compact" class="mb-4" border="start">
              <div class="text-body-2">
                <strong>Authentication</strong> controls who can access this dashboard.
                Without authentication, anyone with network access can view and manage your containers.
              </div>
            </v-alert>
            <div v-if="errors.authentications" class="text-center py-6">
              <v-icon size="40" color="error" class="mb-2">mdi-alert-circle-outline</v-icon>
              <div class="text-body-2 text-error">Failed to load authentication</div>
              <div class="text-caption text-medium-emphasis mt-1">{{ errors.authentications }}</div>
            </div>
            <div v-else-if="authentications.length === 0" class="text-center py-6">
              <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-shield-lock-outline</v-icon>
              <div class="text-body-1 text-medium-emphasis">No authentication configured</div>
              <div class="text-caption text-disabled mt-1">Anyone can access this dashboard. Add authentication to restrict access.</div>
            </div>
            <div v-else class="d-flex flex-column" style="gap: 8px;">
              <configuration-item
                v-for="auth in authentications"
                :key="auth.id"
                :item="auth"
                :editable="true"
                :on-update="handleUpdateAuth"
                :on-delete="handleDeleteAuth"
              />
            </div>
            <div class="mt-3">
              <v-btn variant="tonal" color="secondary" size="small" @click="openAddDialog('authentication')">
                <v-icon start size="small">mdi-plus</v-icon>
                Add Authentication
              </v-btn>
            </div>
          </div>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- Add component dialog -->
    <add-component-dialog
      v-model="showAddDialog"
      :kind="addDialogKind"
      :on-create="handleCreate"
    />
  </div>
</template>

<script lang="ts" src="./SettingsView.ts"></script>
