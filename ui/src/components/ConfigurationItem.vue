<template>
  <v-card rounded="lg" class="config-card">
    <div
      @click="collapse()"
      class="d-flex align-center pa-3 config-header"
      style="cursor: pointer; min-height: 52px; gap: 8px;"
    >
      <IconRenderer v-if="item.icon" :icon="item.icon" :size="20" :margin-right="4" />
      <v-chip size="small" variant="tonal" color="secondary" label>
        {{ item.type }}
      </v-chip>
      <span class="text-body-2 font-weight-medium">{{ item.name }}</span>
      <v-spacer />
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
                    {{ formatDisplayValue(configurationItem.key, configurationItem.value) }}
                  </code>
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
        <v-card-title class="text-subtitle-1">Remove {{ item.type }}/{{ item.name }}?</v-card-title>
        <v-card-text class="text-body-2">
          This will deregister the component and remove its saved configuration.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDelete = false">Cancel</v-btn>
          <v-btn variant="flat" color="error" @click="doDelete" :loading="deleting">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" src="./ConfigurationItem.ts"></script>

<style scoped>
.config-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.15s ease;
}
.config-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
}
.config-header:hover {
  background: rgba(0, 0, 0, 0.02);
}
</style>
