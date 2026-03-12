<template>
  <v-form @keyup.enter="redirect">
    <v-btn block color="secondary" size="large" @click="redirect" rounded="lg">
      <v-icon start>mdi-openid</v-icon>
      Sign in with OpenID Connect
    </v-btn>
  </v-form>
</template>

<script lang="ts" src="./LoginOidc.ts"></script>
