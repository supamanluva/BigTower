<template>
  <div class="d-flex flex-column" style="gap: 8px;">
    <configuration-item :item="serverConfiguration" />
    <configuration-item :item="logConfiguration" />
    <configuration-item :item="storeConfiguration" />
  </div>
</template>

<script lang="ts" src="./ConfigurationServerView.ts"></script>
