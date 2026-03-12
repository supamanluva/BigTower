<template>
  <v-app>
    <snack-bar
      :message="snackbarMessage"
      :show="snackbarShow"
      :level="snackbarLevel"
    />

    <navigation-drawer v-if="authenticated" />

    <app-bar v-if="authenticated" :user="user" />

    <v-main class="app-main">
      <v-container fluid class="pa-4 pa-md-6">
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="secondary"
          class="mb-4"
          style="position: fixed; top: 64px; left: 0; right: 0; z-index: 100;"
        />
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <app-footer v-if="authenticated" />
  </v-app>
</template>

<script lang="ts" src="./App.ts"></script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app-main {
  min-height: 100vh;
}
</style>
