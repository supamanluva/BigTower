<template>
  <v-card rounded="lg" class="trigger-card">
    <div
      @click="collapse()"
      class="d-flex align-center pa-3 trigger-header"
      style="cursor: pointer; min-height: 52px; gap: 8px;"
    >
      <v-icon size="20">{{ trigger.icon || 'mdi-bell-ring-outline' }}</v-icon>
      <v-chip size="small" variant="tonal" color="secondary" label>
        {{ trigger.type }}
      </v-chip>
      <span class="text-body-2 font-weight-medium">{{ trigger.name }}</span>
      <v-spacer />
      <v-btn
        variant="tonal"
        size="x-small"
        color="accent"
        @click.stop="showTestForm = true"
        class="mr-1"
      >
        <v-icon start size="small">mdi-test-tube</v-icon>
        Test
      </v-btn>
      <v-btn
        v-if="editable"
        variant="tonal"
        size="x-small"
        color="accent"
        @click.stop="startEditing"
        class="mr-1"
      >
        <v-icon size="small">mdi-pencil-outline</v-icon>
      </v-btn>
      <v-btn
        v-if="editable"
        variant="tonal"
        size="x-small"
        color="error"
        @click.stop="confirmDelete = true"
        class="mr-1"
      >
        <v-icon size="small">mdi-delete-outline</v-icon>
      </v-btn>
      <v-icon size="small" class="text-medium-emphasis">
        {{ showDetail ? "mdi-chevron-up" : "mdi-chevron-down" }}
      </v-icon>
    </div>
    <v-expand-transition>
      <div v-show="showDetail">
        <v-divider />
        <v-card-text class="pa-4">
          <!-- View mode -->
          <v-table density="compact" v-if="!isEditing && configurationItems.length > 0">
            <tbody>
              <tr v-for="configurationItem in configurationItems" :key="configurationItem.key">
                <td class="text-caption font-weight-medium" style="width: 200px;">
                  {{ configurationItem.label }}
                </td>
                <td class="text-caption text-medium-emphasis">
                  <template v-if="typeof configurationItem.value === 'boolean'">
                    <v-icon size="small" :color="configurationItem.value ? 'success' : 'grey'">
                      {{ configurationItem.value ? 'mdi-check-circle' : 'mdi-close-circle' }}
                    </v-icon>
                    {{ configurationItem.value ? 'Yes' : 'No' }}
                  </template>
                  <code v-else-if="configurationItem.value !== '' && configurationItem.value !== null && configurationItem.value !== undefined">
                    {{ configurationItem.value }}
                  </code>
                  <span v-else class="text-disabled font-italic">not set</span>
                </td>
              </tr>
            </tbody>
          </v-table>
          <div v-else-if="!isEditing" class="text-body-2 text-medium-emphasis py-2">
            Using default configuration
          </div>

          <!-- Edit mode -->
          <div v-if="isEditing">
            <div class="text-caption text-medium-emphasis mb-3">
              Edit the configuration values below. Leave fields empty to use defaults.
            </div>
            <div v-for="field in editFields" :key="field.key" class="mb-3">
              <v-switch
                v-if="field.type === 'boolean'"
                v-model="editDraft[field.key]"
                :label="field.label"
                density="compact"
                hide-details
                color="secondary"
              />
              <v-text-field
                v-else-if="field.type === 'number'"
                v-model.number="editDraft[field.key]"
                :label="field.label"
                type="number"
                density="compact"
                variant="outlined"
                hide-details
              />
              <v-text-field
                v-else
                v-model="editDraft[field.key]"
                :label="field.label"
                density="compact"
                variant="outlined"
                hide-details
                :type="field.sensitive ? 'password' : 'text'"
              />
            </div>
            <div class="d-flex justify-end" style="gap: 8px;">
              <v-btn variant="text" size="small" @click="cancelEditing">Cancel</v-btn>
              <v-btn
                variant="flat"
                size="small"
                color="secondary"
                @click="saveEditing"
                :loading="saving"
              >
                <v-icon start size="small">mdi-content-save-outline</v-icon>
                Save
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="confirmDelete" max-width="400">
      <v-card>
        <v-card-title class="text-subtitle-1">Remove {{ trigger.type }}/{{ trigger.name }}?</v-card-title>
        <v-card-text class="text-body-2">
          This will deregister the action and remove its saved configuration.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDelete = false">Cancel</v-btn>
          <v-btn variant="flat" color="error" @click="doDelete" :loading="deleting">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Test trigger drawer -->
    <v-navigation-drawer
      v-model="showTestForm"
      location="right"
      temporary
      width="400"
    >
      <div class="pa-4">
        <div class="text-subtitle-1 font-weight-bold mb-2 d-flex align-center" style="gap: 8px;">
          <v-icon size="small" color="accent">mdi-test-tube</v-icon>
          Test Trigger
        </div>
        <div class="text-caption text-medium-emphasis mb-4">
          Send a sample notification to verify this trigger works.
        </div>
        <v-text-field
          label="Container name"
          v-model="container.name"
          hint="Name of the test container"
          persistent-hint
          class="mb-3"
        />
        <v-select
          label="Update type"
          v-model="container.updateKind.kind"
          :items="['digest', 'tag']"
          hint="What type of update to simulate"
          persistent-hint
          class="mb-3"
        />
        <v-select
          v-if="container.updateKind.kind === 'tag'"
          label="Severity"
          v-model="container.updateKind.semverDiff"
          :items="['major', 'minor', 'patch']"
          hint="How big the version jump is"
          persistent-hint
          class="mb-3"
        />
        <v-text-field
          label="Current version"
          v-model="container.updateKind.localValue"
          hint="Version currently running"
          persistent-hint
          class="mb-3"
        />
        <v-text-field
          label="New version"
          v-model="container.updateKind.remoteValue"
          hint="Version available to update to"
          persistent-hint
          class="mb-4"
        />
        <v-btn
          color="accent"
          block
          @click="runTrigger"
          :loading="isTriggering"
        >
          <v-icon start size="small">mdi-play</v-icon>
          Run trigger
        </v-btn>
      </div>
    </v-navigation-drawer>
  </v-card>
</template>

<script lang="ts" src="./TriggerDetail.ts"></script>

<style scoped>
.trigger-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.15s ease;
}
.trigger-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
}
.trigger-header:hover {
  background: rgba(0, 0, 0, 0.02);
}
</style>
