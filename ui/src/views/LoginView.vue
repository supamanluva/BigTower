<template>
  <div class="d-flex align-center justify-center" style="min-height: 80vh;">
    <v-card rounded="lg" width="420" class="pa-2">
      <v-card-text class="text-center pa-6">
        <v-icon size="56" color="secondary" class="mb-3">mdi-tower-fire</v-icon>
        <div class="text-h5 font-weight-bold mb-1">BigTower</div>
        <div class="text-body-2 text-medium-emphasis mb-6">Sign in to continue</div>

        <v-tabs
          v-if="strategies.length > 1"
          v-model="strategySelected"
          color="secondary"
          class="mb-4"
          density="compact"
        >
          <v-tab
            v-for="strategy in strategies"
            :key="strategy.name"
            class="text-body-2 text-capitalize"
          >
            {{ strategy.name }}
          </v-tab>
        </v-tabs>

        <v-window v-model="strategySelected">
          <v-window-item
            v-for="strategy in strategies"
            :key="strategy.type + strategy.name"
          >
            <login-basic
              v-if="strategy.type === 'basic'"
              @authentication-success="onAuthenticationSuccess"
            />
            <login-oidc
              v-if="strategy.type === 'oidc'"
              :name="strategy.name"
              @authentication-success="onAuthenticationSuccess"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" src="./LoginView.ts"></script>
