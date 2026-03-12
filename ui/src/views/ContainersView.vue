<template>
  <div>
    <!-- Header with search and actions -->
    <v-card rounded="lg" class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search containers..."
              hide-details
              clearable
              density="compact"
              variant="outlined"
            />
          </v-col>
          <v-col cols="auto">
            <v-chip-group>
              <v-chip
                :color="updateAvailableSelected ? 'warning' : undefined"
                :variant="updateAvailableSelected ? 'flat' : 'outlined'"
                size="small"
                @click="onUpdateAvailableChanged"
                prepend-icon="mdi-package-up"
              >
                Updates only
              </v-chip>
              <v-chip
                :color="oldestFirst ? 'secondary' : undefined"
                :variant="oldestFirst ? 'flat' : 'outlined'"
                size="small"
                @click="onOldestFirstChanged"
                prepend-icon="mdi-sort-calendar-ascending"
              >
                Oldest first
              </v-chip>
            </v-chip-group>
          </v-col>
          <v-spacer />
          <v-col cols="auto" class="d-flex align-center" style="gap: 8px;">
            <span class="text-caption text-medium-emphasis text-no-wrap">
              {{ containersFiltered.length }} of {{ containers.length }}
            </span>
            <v-btn
              color="secondary"
              @click.stop="onRefreshAllContainersClick"
              :loading="isRefreshing"
              size="small"
            >
              <v-icon start size="small">mdi-refresh</v-icon>
              Check Updates
            </v-btn>
          </v-col>
        </v-row>

        <!-- Advanced filters (collapsible) -->
        <v-expand-transition>
          <v-row v-if="showAdvancedFilters" dense class="mt-3" align="center">
            <v-col cols="6" sm="3">
              <v-select
                v-model="watcherSelected"
                :items="watchers"
                @update:modelValue="onWatcherChanged"
                clearable
                label="Host"
                hide-details
                density="compact"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <v-select
                v-model="registrySelected"
                :items="registries"
                @update:modelValue="onRegistryChanged"
                clearable
                label="Source"
                hide-details
                density="compact"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <v-select
                v-model="updateKindSelected"
                :items="updateKinds"
                @update:modelValue="onUpdateKindChanged"
                clearable
                label="Update type"
                hide-details
                density="compact"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <v-autocomplete
                label="Group by label"
                :items="allContainerLabels"
                v-model="groupByLabel"
                @update:modelValue="onGroupByLabelChanged"
                clearable
                hide-details
                density="compact"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-expand-transition>
        <div class="d-flex justify-center mt-1">
          <v-btn
            variant="text"
            size="x-small"
            color="medium-emphasis"
            @click="showAdvancedFilters = !showAdvancedFilters"
          >
            {{ showAdvancedFilters ? 'Less filters' : 'More filters' }}
            <v-icon end size="x-small">{{ showAdvancedFilters ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Loading state -->
    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="secondary" size="48" />
    </div>

    <!-- Container list -->
    <template v-else>
      <div v-if="containersFiltered.length === 0" class="text-center py-12">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-docker</v-icon>
        <div class="text-h6 text-medium-emphasis mb-2">No containers found</div>
        <div class="text-body-2 text-medium-emphasis">
          Try adjusting your filters or search query.
        </div>
      </div>

      <div v-else class="container-list">
        <div
          v-for="(container, index) in containersFiltered"
          :key="container.id"
          class="mb-2"
        >
          <container-item
            :groupingLabel="groupByLabel"
            :previousContainer="containersFiltered[index - 1]"
            :container="container"
            :oldest-first="oldestFirst"
            @delete-container="deleteContainer(container)"
            @container-deleted="removeContainerFromList(container)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" src="./ContainersView.ts"></script>
