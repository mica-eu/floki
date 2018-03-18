<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
@import '../../node_modules/bulma/css/bulma.css';


html, body, #app {
  height: 100%;
}

body {
  background-color: #1a1a1a;
}
</style>
