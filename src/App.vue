<template>
  <component :is="isLoginOrSignUp() ? Blank : Default">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Blank from '@/layouts/blank.vue'
import Default from '@/layouts/default.vue'

const route = useRoute();

const isLoginOrSignUp = () => {
  if (route && route.name) {
    return route.name === 'login' || route.name === 'sign-up'

  }
  return false;
}
</script>
