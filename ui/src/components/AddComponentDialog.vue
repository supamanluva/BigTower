<template>
  <v-dialog v-model="dialogVisible" max-width="520" persistent>
    <v-card>
      <v-card-title class="d-flex align-center" style="gap: 8px;">
        <v-icon size="small" color="secondary">mdi-plus-circle-outline</v-icon>
        <span class="text-subtitle-1 font-weight-bold">Add {{ kindLabel }}</span>
      </v-card-title>

      <v-card-text>
        <div class="text-caption text-medium-emphasis mb-4">
          Choose a provider type and give it a unique name, then configure its settings.
        </div>

        <!-- Step 1: Type and name -->
        <v-select
          v-model="selectedType"
          :items="providerOptions"
          label="Provider type"
          density="compact"
          variant="outlined"
          class="mb-3"
          :disabled="step === 2"
        />
        <v-text-field
          v-model="instanceName"
          label="Name"
          density="compact"
          variant="outlined"
          hint="A unique identifier (letters, numbers, hyphens, underscores)"
          persistent-hint
          class="mb-3"
          :disabled="step === 2"
          :rules="[nameRule]"
        />

        <!-- Step 2: Configuration fields -->
        <template v-if="step === 2">
          <v-divider class="my-3" />
          <div class="text-body-2 font-weight-medium mb-2">Configuration</div>
          <div class="text-caption text-medium-emphasis mb-3">
            Fill in the required fields for the <strong>{{ selectedType }}</strong> provider. Leave optional fields empty to use defaults.
          </div>
          <div v-for="field in configFields" :key="field.key" class="mb-2">
            <v-switch
              v-if="field.type === 'boolean'"
              v-model="configDraft[field.key]"
              :label="field.label"
              density="compact"
              hide-details
              color="secondary"
            />
            <v-text-field
              v-else-if="field.type === 'number'"
              v-model.number="configDraft[field.key]"
              :label="field.label + (field.required ? ' *' : '')"
              type="number"
              density="compact"
              variant="outlined"
              hide-details
            />
            <v-text-field
              v-else
              v-model="configDraft[field.key]"
              :label="field.label + (field.required ? ' *' : '')"
              density="compact"
              variant="outlined"
              hide-details
              :type="field.sensitive ? 'password' : 'text'"
              :placeholder="field.placeholder || ''"
            />
          </div>
        </template>

        <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact" class="mt-3">
          {{ errorMsg }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn
          v-if="step === 1"
          variant="flat"
          color="secondary"
          :disabled="!selectedType || !instanceName || !nameValid"
          @click="step = 2"
        >
          Next
        </v-btn>
        <v-btn
          v-if="step === 2"
          variant="text"
          @click="step = 1"
        >
          Back
        </v-btn>
        <v-btn
          v-if="step === 2"
          variant="flat"
          color="secondary"
          @click="save"
          :loading="saving"
        >
          <v-icon start size="small">mdi-content-save-outline</v-icon>
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" src="./AddComponentDialog.ts"></script>
