<template>
  <v-navigation-drawer
    app
    :rail="mini"
    permanent
    :disable-route-watcher="true"
    color="primary"
    theme="dark"
    class="nav-drawer"
  >
    <!-- Brand header -->
    <div class="nav-brand d-flex align-center pa-3" :class="{ 'justify-center': mini }">
      <v-btn
        icon
        variant="text"
        size="small"
        @click.stop="mini = !mini"
        class="mr-1"
      >
        <v-icon v-if="mini">mdi-menu</v-icon>
        <v-icon v-else color="white">mdi-tower-fire</v-icon>
      </v-btn>
      <span v-if="!mini" class="text-subtitle-1 font-weight-bold text-white">
        BigTower
      </span>
    </div>

    <v-divider class="mx-3 mb-2" style="opacity: 0.15" />

    <!-- Main navigation -->
    <v-list nav density="compact" class="px-2">
      <v-list-item
        to="/"
        key="home"
        prepend-icon="mdi-view-dashboard-outline"
        rounded="lg"
        class="mb-1"
      >
        <v-list-item-title class="text-body-2">Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-item
        to="/containers"
        key="containers"
        :prepend-icon="containerIcon"
        rounded="lg"
        class="mb-1"
      >
        <v-list-item-title class="text-body-2">Containers</v-list-item-title>
      </v-list-item>

      <v-list-item
        to="/update-management"
        key="update-management"
        prepend-icon="mdi-update"
        rounded="lg"
        class="mb-1"
      >
        <v-list-item-title class="text-body-2">Update Management</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider class="mx-3 my-2" style="opacity: 0.15" />

    <!-- Settings -->
    <v-list nav density="compact" class="px-2">
      <v-list-item
        to="/settings"
        key="settings"
        prepend-icon="mdi-cog-outline"
        rounded="lg"
        class="mb-1"
      >
        <v-list-item-title class="text-body-2">Settings</v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Bottom section -->
    <template v-slot:append>
      <v-divider class="mx-3" style="opacity: 0.15" />
      <v-list density="compact" class="px-2 py-2">
        <v-list-item
          rounded="lg"
          @click="toggleDarkMode(!darkMode)"
          :prepend-icon="darkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
        >
          <v-list-item-title v-if="!mini" class="text-body-2">
            {{ darkMode ? 'Dark Mode' : 'Light Mode' }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" src="./NavigationDrawer.ts"></script>

<style scoped>
.nav-drawer {
  border-right: none !important;
}

.nav-drawer :deep(.v-list-item--active) {
  background: rgba(255, 255, 255, 0.12);
}

.nav-drawer :deep(.v-list-item--active .v-list-item-title) {
  font-weight: 600;
}

.nav-brand {
  min-height: 48px;
}
</style>
