<template>
  <v-form @keyup.enter="login">
    <v-text-field
      label="Username"
      v-model="username"
      prepend-inner-icon="mdi-account-outline"
      :rules="[rules.required]"
      autocomplete="username"
      autofocus
      class="mb-3"
    />
    <v-text-field
      label="Password"
      type="password"
      v-model="password"
      prepend-inner-icon="mdi-lock-outline"
      :rules="[rules.required]"
      autocomplete="current-password"
      class="mb-4"
    />
    <v-btn block color="secondary" size="large" :disabled="!valid" @click="login" rounded="lg">
      Sign In
    </v-btn>
  </v-form>
</template>

<script lang="ts" src="./LoginBasic.ts"></script>
