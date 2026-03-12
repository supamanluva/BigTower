<template>
  <div style="max-width: 1400px; margin: 0 auto; padding: 24px;">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">Update Management</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Configure auto-update policies and schedules for your containers
        </p>
      </div>
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-refresh"
        @click="loadContainers"
        :loading="loading"
      >
        Refresh
      </v-btn>
    </div>

    <!-- Stats cards -->
    <div class="d-flex flex-wrap ga-4 mb-6">
      <v-card
        variant="tonal"
        color="primary"
        class="flex-grow-1"
        min-width="200"
        style="cursor: pointer"
        @click="filterMode = 'all'"
      >
        <v-card-text class="d-flex align-center ga-3">
          <v-icon size="32">mdi-docker</v-icon>
          <div>
            <div class="text-h5 font-weight-bold">{{ containers.length }}</div>
            <div class="text-caption text-medium-emphasis">Total Containers</div>
          </div>
        </v-card-text>
      </v-card>

      <v-card
        variant="tonal"
        color="success"
        class="flex-grow-1"
        min-width="200"
        style="cursor: pointer"
        @click="filterMode = 'auto-update'"
      >
        <v-card-text class="d-flex align-center ga-3">
          <v-icon size="32">mdi-update</v-icon>
          <div>
            <div class="text-h5 font-weight-bold">{{ autoUpdateCount }}</div>
            <div class="text-caption text-medium-emphasis">Auto-Update Enabled</div>
          </div>
        </v-card-text>
      </v-card>

      <v-card
        variant="tonal"
        color="info"
        class="flex-grow-1"
        min-width="200"
        style="cursor: pointer"
        @click="filterMode = 'custom-schedule'"
      >
        <v-card-text class="d-flex align-center ga-3">
          <v-icon size="32">mdi-clock-outline</v-icon>
          <div>
            <div class="text-h5 font-weight-bold">{{ customScheduleCount }}</div>
            <div class="text-caption text-medium-emphasis">Custom Schedules</div>
          </div>
        </v-card-text>
      </v-card>

      <v-card
        variant="tonal"
        color="warning"
        class="flex-grow-1"
        min-width="200"
        style="cursor: pointer"
        @click="filterMode = 'updates-available'"
      >
        <v-card-text class="d-flex align-center ga-3">
          <v-icon size="32">mdi-arrow-up-circle</v-icon>
          <div>
            <div class="text-h5 font-weight-bold">{{ updatesAvailableCount }}</div>
            <div class="text-caption text-medium-emphasis">Updates Available</div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Search & Filter bar -->
    <v-card class="mb-6" variant="flat">
      <v-card-text class="d-flex align-center ga-4 flex-wrap">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search containers..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
          style="max-width: 350px"
        />

        <v-btn-toggle v-model="filterMode" mandatory variant="outlined" density="compact" divided>
          <v-btn value="all" size="small">All</v-btn>
          <v-btn value="auto-update" size="small">
            <v-icon start size="16">mdi-update</v-icon>
            Auto-Update
          </v-btn>
          <v-btn value="custom-schedule" size="small">
            <v-icon start size="16">mdi-clock-outline</v-icon>
            Scheduled
          </v-btn>
          <v-btn value="updates-available" size="small">
            <v-icon start size="16">mdi-arrow-up-circle</v-icon>
            Has Updates
          </v-btn>
        </v-btn-toggle>

        <v-spacer />

        <span class="text-body-2 text-medium-emphasis">
          {{ filteredContainers.length }} of {{ containers.length }} containers
        </span>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Empty state -->
    <v-card v-else-if="filteredContainers.length === 0" variant="flat" class="text-center py-12">
      <v-icon size="64" color="medium-emphasis">mdi-docker</v-icon>
      <p class="text-h6 mt-4 text-medium-emphasis">No containers match your filter</p>
      <v-btn variant="text" color="primary" @click="filterMode = 'all'; searchQuery = ''">
        Clear Filters
      </v-btn>
    </v-card>

    <!-- Container table -->
    <v-card v-else variant="flat">
      <v-table hover>
        <thead>
          <tr>
            <th>Container</th>
            <th>Image</th>
            <th>Status</th>
            <th>Update</th>
            <th class="text-center">Auto-Update</th>
            <th>Schedule</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="container in filteredContainers" :key="container.id">
            <!-- Container name -->
            <td>
              <div class="d-flex align-center ga-2 py-2">
                <v-icon size="20" color="primary">mdi-docker</v-icon>
                <div>
                  <div class="font-weight-medium text-body-2">{{ container.displayName }}</div>
                  <div v-if="container.displayName !== container.name" class="text-caption text-medium-emphasis">
                    {{ container.name }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Image -->
            <td>
              <div class="text-body-2">{{ container.image.name }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ container.image.tag.value }}
                <span class="mx-1">&middot;</span>
                {{ container.image.registry.name }}
              </div>
            </td>

            <!-- Status -->
            <td>
              <v-chip
                :color="getStatusColor(container.status)"
                size="small"
                variant="tonal"
                label
              >
                {{ container.status }}
              </v-chip>
            </td>

            <!-- Update info -->
            <td>
              <template v-if="container.updateAvailable">
                <v-chip
                  :color="getSemverColor(container.updateKind.semverDiff)"
                  size="small"
                  variant="tonal"
                  label
                >
                  <v-icon start size="14">mdi-arrow-up</v-icon>
                  {{ container.result?.tag || container.updateKind.remoteValue || 'available' }}
                </v-chip>
                <div v-if="container.updateKind.semverDiff" class="text-caption text-medium-emphasis mt-1">
                  {{ container.updateKind.semverDiff }} update
                </div>
              </template>
              <span v-else class="text-caption text-medium-emphasis">Up to date</span>
            </td>

            <!-- Auto-update toggle -->
            <td class="text-center">
              <v-switch
                :model-value="container.autoUpdate"
                @update:model-value="toggleAutoUpdate(container)"
                color="success"
                density="compact"
                hide-details
                :loading="container.saving"
                :disabled="container.saving"
              />
            </td>

            <!-- Schedule -->
            <td>
              <template v-if="container.cron">
                <v-chip size="small" variant="tonal" color="info" label closable @click:close="removeCron(container)">
                  <v-icon start size="14">mdi-clock-outline</v-icon>
                  {{ getCronDescription(container.cron) }}
                </v-chip>
              </template>
              <span v-else class="text-caption text-medium-emphasis">Global default</span>
            </td>

            <!-- Actions -->
            <td class="text-center">
              <v-btn
                icon
                variant="text"
                size="small"
                @click="openSettings(container)"
                title="Configure"
              >
                <v-icon size="18">mdi-cog</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="triggerManualUpdate(container)"
                :loading="container.saving"
                title="Check for updates now"
              >
                <v-icon size="18">mdi-refresh</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Settings Dialog -->
    <v-dialog v-model="settingsDialog" max-width="600" persistent>
      <v-card v-if="selectedContainer">
        <v-card-title class="d-flex align-center ga-2 pt-5 px-6">
          <v-icon color="primary">mdi-cog</v-icon>
          <span>Container Settings</span>
        </v-card-title>

        <v-card-subtitle class="px-6 pb-4">
          {{ selectedContainer.displayName }}
          <span class="text-medium-emphasis">
            &mdash; {{ selectedContainer.image.name }}:{{ selectedContainer.image.tag.value }}
          </span>
        </v-card-subtitle>

        <v-divider />

        <v-card-text class="px-6 py-5">
          <!-- Auto-update section -->
          <div class="mb-6">
            <div class="text-subtitle-2 font-weight-bold mb-2">Auto-Update</div>
            <p class="text-body-2 text-medium-emphasis mb-3">
              When enabled, the Docker trigger will automatically pull the new image,
              stop the current container, and recreate it with the updated image.
            </p>
            <v-switch
              v-model="dialogAutoUpdate"
              color="success"
              label="Enable auto-update for this container"
              hide-details
              density="compact"
            />
          </div>

          <v-divider class="mb-6" />

          <!-- Schedule section -->
          <div class="mb-6">
            <div class="text-subtitle-2 font-weight-bold mb-2">Check Schedule</div>
            <p class="text-body-2 text-medium-emphasis mb-3">
              Override the global watcher schedule with a custom cron expression for this container.
              Leave empty to use the global schedule.
            </p>

            <v-select
              v-model="selectedPreset"
              :items="cronPresets"
              item-title="label"
              item-value="value"
              label="Schedule preset"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              class="mb-3"
              @update:model-value="onPresetChange"
            />

            <v-text-field
              v-model="customCronInput"
              label="Cron expression"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="*/30 * * * *"
              :hint="customCronInput ? '' : 'Format: minute hour day-of-month month day-of-week'"
              persistent-hint
            >
              <template v-slot:append-inner>
                <v-icon
                  v-if="customCronInput"
                  size="18"
                  @click="customCronInput = ''; selectedPreset = ''"
                  style="cursor: pointer"
                >
                  mdi-close
                </v-icon>
              </template>
            </v-text-field>
          </div>

          <v-divider class="mb-6" />

          <!-- Triggers section -->
          <div>
            <div class="text-subtitle-2 font-weight-bold mb-2">Associated Triggers</div>
            <p class="text-body-2 text-medium-emphasis mb-3">
              Triggers that will fire when updates are detected for this container.
              Configure trigger inclusion/exclusion via Docker labels.
            </p>

            <v-progress-linear v-if="loadingTriggers" indeterminate color="primary" class="mb-2" />

            <div v-else-if="dialogTriggers.length === 0" class="text-body-2 text-medium-emphasis">
              No triggers configured.
            </div>

            <v-list v-else density="compact" class="pa-0">
              <v-list-item
                v-for="trigger in dialogTriggers"
                :key="trigger.id"
                class="px-0"
              >
                <template v-slot:prepend>
                  <v-icon size="20" :color="trigger.type === 'docker' ? 'success' : 'info'">
                    {{ trigger.type === 'docker' ? 'mdi-update' : 'mdi-bell-ring' }}
                  </v-icon>
                </template>

                <v-list-item-title class="text-body-2">
                  {{ trigger.type }}.{{ trigger.name }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-caption">
                  Mode: {{ trigger.configuration?.mode || 'simple' }}
                  <span v-if="trigger.configuration?.threshold">
                    &middot; Threshold: {{ trigger.configuration.threshold }}
                  </span>
                  <span v-if="trigger.type === 'docker'">
                    &middot;
                    <v-chip size="x-small" color="success" variant="tonal" label>auto-update</v-chip>
                  </span>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    variant="text"
                    size="small"
                    color="primary"
                    :loading="triggerRunning === trigger.id"
                    @click="runContainerTrigger(trigger)"
                  >
                    Run
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="settingsDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="saveSettings"
            :loading="selectedContainer?.saving"
          >
            Save Settings
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" src="./UpdateManagementView.ts"></script>
