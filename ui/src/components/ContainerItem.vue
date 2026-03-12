<template>
  <div>
    <!-- Group label separator -->
    <div
      v-if="
        groupingLabel &&
        previousContainer?.labels?.[groupingLabel] !==
          container.labels?.[groupingLabel]
      "
      class="mb-2 mt-4"
    >
      <div class="text-overline text-medium-emphasis d-flex align-center" style="gap: 6px;">
        <v-icon size="small">mdi-label-outline</v-icon>
        {{ groupingLabel }} = {{ container.labels?.[groupingLabel] ?? "(empty)" }}
      </div>
      <v-divider class="mt-1 mb-2" />
    </div>

    <v-card rounded="lg" class="container-card" :class="{ 'update-available': container.updateAvailable }">
      <!-- Header row -->
      <div
        @click="collapseDetail()"
        class="d-flex align-center pa-3 container-header"
        style="cursor: pointer; gap: 8px; min-height: 56px;"
      >
        <!-- Status indicator -->
        <div
          class="status-dot"
          :class="{
            'bg-success': !container.updateAvailable && !container.error,
            'bg-warning': container.updateAvailable && !container.error,
            'bg-error': container.error,
          }"
        />

        <!-- Icon -->
        <IconRenderer
          :icon="container.displayIcon"
          :size="22"
          :margin-right="4"
        />

        <!-- Container name -->
        <span class="text-body-2 font-weight-medium text-truncate" style="max-width: 300px;">
          {{ container.displayName }}
        </span>

        <!-- Current tag -->
        <v-chip size="x-small" variant="tonal" color="info" label>
          {{ container.image.tag.value }}
        </v-chip>

        <!-- Update arrow & new version -->
        <template v-if="container.updateAvailable">
          <v-icon size="small" class="text-medium-emphasis">mdi-arrow-right</v-icon>
          <v-chip
            size="x-small"
            variant="flat"
            :color="newVersionClass"
            label
          >
            {{ newVersion }}
          </v-chip>
          <v-chip
            v-if="container.updateKind && container.updateKind.semverDiff"
            size="x-small"
            variant="tonal"
            :color="newVersionClass"
            label
            class="text-uppercase"
          >
            {{ container.updateKind.semverDiff }}
          </v-chip>
        </template>

        <v-spacer />

        <!-- Status text for quick scanning -->
        <v-chip
          v-if="!container.updateAvailable && !container.error"
          size="x-small"
          variant="tonal"
          color="success"
          label
        >
          <v-icon start size="x-small">mdi-check-circle</v-icon>
          Up to date
        </v-chip>
        <v-chip
          v-else-if="container.error"
          size="x-small"
          variant="tonal"
          color="error"
          label
        >
          <v-icon start size="x-small">mdi-alert-circle</v-icon>
          Error
        </v-chip>

        <span v-if="smAndUp && oldestFirst" class="text-caption text-medium-emphasis">
          {{ $filters.date(container.image.created) }}
        </span>

        <!-- Expand/collapse icon -->
        <v-icon size="small" class="text-medium-emphasis">
          {{ showDetail ? "mdi-chevron-up" : "mdi-chevron-down" }}
        </v-icon>
      </div>

      <!-- Expandable detail section -->
      <v-expand-transition>
        <div v-show="showDetail">
          <v-divider />
          <v-tabs
            v-model="tab"
            ref="tabs"
            density="compact"
            color="secondary"
            class="border-b"
          >
            <v-tab v-if="container.result" size="small">
              <v-icon start size="small">mdi-package-down</v-icon>
              <span class="text-caption">What's New</span>
            </v-tab>
            <v-tab size="small">
              <v-icon start size="small">mdi-play-circle-outline</v-icon>
              <span class="text-caption">Actions</span>
            </v-tab>
            <v-tab size="small">
              <v-icon start size="small">mdi-information-outline</v-icon>
              <span class="text-caption">Info</span>
            </v-tab>
            <v-tab v-if="container.error" size="small">
              <v-icon start size="small" color="error">mdi-alert-circle-outline</v-icon>
              <span class="text-caption text-error">Error</span>
            </v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <!-- What's New tab -->
            <v-window-item v-if="container.result">
              <container-update
                :result="container.result"
                :semver="container.image.tag.semver"
                :update-kind="container.updateKind"
                :update-available="container.updateAvailable"
              />
            </v-window-item>
            <!-- Actions tab (triggers) -->
            <v-window-item>
              <container-triggers :container="container" />
            </v-window-item>
            <!-- Info tab (merged image + details) -->
            <v-window-item>
              <div class="pa-4">
                <div class="text-overline text-medium-emphasis mb-2">Container</div>
                <v-table density="compact" class="text-body-2 mb-4">
                  <tbody>
                    <tr>
                      <td class="text-medium-emphasis" style="width: 140px;">Name</td>
                      <td>{{ container.name }}</td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis">Status</td>
                      <td>
                        <v-chip size="x-small" :color="container.status === 'running' ? 'success' : 'warning'" variant="tonal" label>
                          {{ container.status }}
                        </v-chip>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis">Host</td>
                      <td>{{ container.watcher }}</td>
                    </tr>
                    <tr v-if="container.id">
                      <td class="text-medium-emphasis">ID</td>
                      <td class="d-flex align-center" style="gap: 4px;">
                        <span class="text-truncate" style="max-width: 300px;">{{ container.id.substring(0, 12) }}</span>
                        <v-btn icon size="x-small" variant="text" @click.stop="copyToClipboard('container ID', container.id)">
                          <v-icon size="small">mdi-content-copy</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <div class="text-overline text-medium-emphasis mb-2">Image</div>
                <v-table density="compact" class="text-body-2 mb-4">
                  <tbody>
                    <tr>
                      <td class="text-medium-emphasis" style="width: 140px;">Image</td>
                      <td>{{ container.image.name }}</td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis">Tag</td>
                      <td>
                        {{ container.image.tag.value }}
                        <v-chip v-if="container.image.tag.semver" size="x-small" variant="tonal" color="info" label class="ml-1">semver</v-chip>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis">Source</td>
                      <td>{{ container.image.registry.name }}</td>
                    </tr>
                    <tr v-if="container.image.os || container.image.architecture">
                      <td class="text-medium-emphasis">Platform</td>
                      <td>{{ container.image.os }}/{{ container.image.architecture }}</td>
                    </tr>
                    <tr v-if="container.image.created">
                      <td class="text-medium-emphasis">Created</td>
                      <td>{{ $filters.date(container.image.created) }}</td>
                    </tr>
                    <tr v-if="container.image.digest && container.image.digest.repo">
                      <td class="text-medium-emphasis">Digest</td>
                      <td class="d-flex align-center" style="gap: 4px;">
                        <span class="text-truncate" style="max-width: 300px;">{{ container.image.digest.repo.substring(0, 20) }}...</span>
                        <v-btn icon size="x-small" variant="text" @click.stop="copyToClipboard('digest', container.image.digest.repo)">
                          <v-icon size="small">mdi-content-copy</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <!-- Advanced details (collapsed by default) -->
                <v-expand-transition>
                  <div v-if="showAdvancedInfo">
                    <div class="text-overline text-medium-emphasis mb-2">Advanced</div>
                    <v-table density="compact" class="text-body-2">
                      <tbody>
                        <tr v-if="container.includeTags">
                          <td class="text-medium-emphasis" style="width: 140px;">Include tags</td>
                          <td><code>{{ container.includeTags }}</code></td>
                        </tr>
                        <tr v-if="container.excludeTags">
                          <td class="text-medium-emphasis">Exclude tags</td>
                          <td><code>{{ container.excludeTags }}</code></td>
                        </tr>
                        <tr v-if="container.transformTags">
                          <td class="text-medium-emphasis">Transform</td>
                          <td><code>{{ container.transformTags }}</code></td>
                        </tr>
                        <tr v-if="container.linkTemplate">
                          <td class="text-medium-emphasis">Link template</td>
                          <td>{{ container.linkTemplate }}</td>
                        </tr>
                        <tr v-if="container.image.id">
                          <td class="text-medium-emphasis">Image ID</td>
                          <td class="d-flex align-center" style="gap: 4px;">
                            <span class="text-truncate" style="max-width: 300px;">{{ container.image.id.substring(0, 20) }}...</span>
                            <v-btn icon size="x-small" variant="text" @click.stop="copyToClipboard('image ID', container.image.id)">
                              <v-icon size="small">mdi-content-copy</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>
                </v-expand-transition>
                <div class="d-flex justify-center mt-2">
                  <v-btn variant="text" size="x-small" color="medium-emphasis" @click="showAdvancedInfo = !showAdvancedInfo">
                    {{ showAdvancedInfo ? 'Less info' : 'More info' }}
                    <v-icon end size="x-small">{{ showAdvancedInfo ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-window-item>
            <!-- Error tab -->
            <v-window-item v-if="container.error">
              <container-error :error="container.error" />
            </v-window-item>
          </v-window>

          <!-- Actions -->
          <v-divider />
          <div class="d-flex justify-end pa-3" style="gap: 8px;">
            <v-dialog
              v-model="dialogDelete"
              width="420"
              v-if="deleteEnabled"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  size="small"
                  color="error"
                  variant="tonal"
                  v-bind="props"
                >
                  <v-icon start size="small">mdi-delete-outline</v-icon>
                  Remove
                </v-btn>
              </template>

              <v-card rounded="lg">
                <v-card-title class="text-subtitle-1 font-weight-bold pa-4">
                  <v-icon color="error" class="mr-2">mdi-alert-circle-outline</v-icon>
                  Remove container?
                </v-card-title>
                <v-card-text class="pa-4 pt-0">
                  Remove <strong>{{ container.name }}</strong> from the tracking list?
                  <br />
                  <span class="text-caption text-medium-emphasis">
                    The actual container will not be affected.
                  </span>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0">
                  <v-spacer />
                  <v-btn variant="outlined" size="small" @click="dialogDelete = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    color="error"
                    size="small"
                    @click="dialogDelete = false; deleteContainer();"
                  >
                    Remove
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script lang="ts" src="./ContainerItem.ts"></script>

<style scoped>
.container-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.15s ease;
}

.container-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
}

.container-card.update-available {
  border-left: 3px solid rgb(var(--v-theme-warning));
}

.container-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
