<template>
  <div>
    <!-- MOTD: Update notification banner -->
    <v-banner
      v-if="!motdDismissed && !loading && containersToUpdateCount > 0"
      color="warning"
      icon="mdi-package-up"
      rounded="lg"
      class="mb-4 motd-banner"
      lines="two"
    >
      <v-banner-text>
        <strong>{{ containersToUpdateCount }} container update{{ containersToUpdateCount !== 1 ? 's' : '' }} available</strong>
        <div class="text-body-2 mt-1">
          <span v-for="(c, i) in updatableContainers" :key="c.name">
            <strong>{{ c.displayName || c.name }}</strong>
            {{ c.image.tag.value }} &rarr; {{ c.result.tag }}<span v-if="i < updatableContainers.length - 1">,&nbsp;</span>
          </span>
        </div>
      </v-banner-text>
      <template v-slot:actions>
        <v-btn
          variant="tonal"
          color="warning"
          size="small"
          to="/update-management"
        >
          Review Updates
        </v-btn>
        <v-btn variant="text" size="small" @click="dismissMotd">
          Dismiss
        </v-btn>
      </template>
    </v-banner>

    <!-- Stats row -->
    <v-row class="mb-2">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" rounded="lg">
          <v-card-text class="d-flex align-center pa-4">
            <div class="stat-icon-wrap bg-blue-lighten-5 mr-4">
              <v-icon color="secondary" size="28">{{ containerIcon }}</v-icon>
            </div>
            <div class="flex-grow-1">
              <div class="text-overline text-medium-emphasis mb-1" style="line-height: 1.2;">Containers</div>
              <div class="text-h5 font-weight-bold">{{ containersCount }}</div>
            </div>
            <v-btn
              icon
              variant="text"
              size="small"
              to="/containers"
              color="secondary"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" rounded="lg">
          <v-card-text class="d-flex align-center pa-4">
            <div class="stat-icon-wrap bg-orange-lighten-5 mr-4">
              <v-icon :color="containersToUpdateCount > 0 ? 'warning' : 'success'" size="28">
                mdi-package-up
              </v-icon>
            </div>
            <div class="flex-grow-1">
              <div class="text-overline text-medium-emphasis mb-1" style="line-height: 1.2;">Updates</div>
              <div class="text-h5 font-weight-bold">{{ containersToUpdateCount }}</div>
            </div>
            <v-btn
              icon
              variant="text"
              size="small"
              to="/containers?update-available=true"
              :color="containersToUpdateCount > 0 ? 'warning' : 'success'"
              :disabled="containersToUpdateCount === 0"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" rounded="lg">
          <v-card-text class="d-flex align-center pa-4">
            <div class="stat-icon-wrap bg-green-lighten-5 mr-4">
              <v-icon color="accent" size="28">{{ watcherIcon }}</v-icon>
            </div>
            <div class="flex-grow-1">
              <div class="text-overline text-medium-emphasis mb-1" style="line-height: 1.2;">Watchers</div>
              <div class="text-h5 font-weight-bold">{{ watchersCount }}</div>
            </div>
            <v-btn
              icon
              variant="text"
              size="small"
              to="/configuration/watchers"
              color="accent"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" rounded="lg">
          <v-card-text class="d-flex align-center pa-4">
            <div class="stat-icon-wrap bg-purple-lighten-5 mr-4">
              <v-icon color="info" size="28">{{ triggerIcon }}</v-icon>
            </div>
            <div class="flex-grow-1">
              <div class="text-overline text-medium-emphasis mb-1" style="line-height: 1.2;">Triggers</div>
              <div class="text-h5 font-weight-bold">{{ triggersCount }}</div>
            </div>
            <v-btn
              icon
              variant="text"
              size="small"
              to="/settings"
              color="info"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Update summary row -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card rounded="lg">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2">
            <v-icon size="small" class="mr-2">mdi-shield-check-outline</v-icon>
            Update Status
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <div v-if="loading" class="d-flex justify-center py-8">
              <v-progress-circular indeterminate color="secondary" />
            </div>
            <div v-else-if="containersToUpdateCount === 0" class="text-center py-6">
              <v-icon size="64" color="success" class="mb-3">mdi-check-circle-outline</v-icon>
              <div class="text-h6 font-weight-medium mb-1">All up to date</div>
              <div class="text-body-2 text-medium-emphasis">
                All {{ containersCount }} containers are running the latest versions.
              </div>
            </div>
            <div v-else>
              <v-alert
                type="warning"
                variant="tonal"
                class="mb-4"
                density="compact"
              >
                {{ containersToUpdateCount }} container{{ containersToUpdateCount !== 1 ? 's' : '' }} 
                {{ containersToUpdateCount !== 1 ? 'have' : 'has' }} updates available.
              </v-alert>
              <div v-if="updatesByKind.major > 0" class="d-flex align-center mb-2">
                <v-chip size="small" color="error" variant="tonal" class="mr-3" label>Major</v-chip>
                <span class="text-body-2">{{ updatesByKind.major }} major update{{ updatesByKind.major !== 1 ? 's' : '' }}</span>
              </div>
              <div v-if="updatesByKind.minor > 0" class="d-flex align-center mb-2">
                <v-chip size="small" color="warning" variant="tonal" class="mr-3" label>Minor</v-chip>
                <span class="text-body-2">{{ updatesByKind.minor }} minor update{{ updatesByKind.minor !== 1 ? 's' : '' }}</span>
              </div>
              <div v-if="updatesByKind.patch > 0" class="d-flex align-center mb-2">
                <v-chip size="small" color="success" variant="tonal" class="mr-3" label>Patch</v-chip>
                <span class="text-body-2">{{ updatesByKind.patch }} patch update{{ updatesByKind.patch !== 1 ? 's' : '' }}</span>
              </div>
              <div v-if="updatesByKind.other > 0" class="d-flex align-center mb-2">
                <v-chip size="small" color="info" variant="tonal" class="mr-3" label>Other</v-chip>
                <span class="text-body-2">{{ updatesByKind.other }} other update{{ updatesByKind.other !== 1 ? 's' : '' }}</span>
              </div>
              <v-btn
                color="secondary"
                variant="tonal"
                size="small"
                class="mt-3"
                to="/containers?update-available=true"
              >
                View updates
                <v-icon end size="small">mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card rounded="lg">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2">
            <v-icon size="small" class="mr-2">mdi-lightning-bolt-outline</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <v-list density="compact" class="pa-0">
              <v-list-item
                to="/containers"
                prepend-icon="mdi-docker"
                rounded="lg"
                class="mb-1"
              >
                <v-list-item-title class="text-body-2">View all containers</v-list-item-title>
              </v-list-item>
              <v-list-item
                to="/update-management"
                prepend-icon="mdi-update"
                rounded="lg"
                class="mb-1"
              >
                <v-list-item-title class="text-body-2">Update management</v-list-item-title>
              </v-list-item>
              <v-list-item
                to="/settings"
                prepend-icon="mdi-cog-outline"
                rounded="lg"
              >
                <v-list-item-title class="text-body-2">Settings</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card rounded="lg" class="mt-4">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2">
            <v-icon size="small" class="mr-2">mdi-chart-pie-outline</v-icon>
            Registries
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <div class="text-center">
              <div class="text-h4 font-weight-bold secondary--text">{{ registriesCount }}</div>
              <div class="text-body-2 text-medium-emphasis">configured registries</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" src="./HomeView.ts"></script>

<style scoped>
.stat-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}
.stat-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.motd-banner {
  border: 1px solid rgb(var(--v-theme-warning), 0.3);
}
</style>
