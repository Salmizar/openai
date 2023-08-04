<template>
  <ChatNavigator />
  <router-view/>
</template>
<script lang="ts" setup>
import ChatNavigator from '@/components/ChatNavigator.vue'; // @ is an alias to /src
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
}
body, html {
  margin: 0px;
  padding: 0px;
}
</style>
