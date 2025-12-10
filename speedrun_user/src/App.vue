<template>
  <headers/>
  <mid/>
  <footers/>
</template>

<script>
import headers from '@/components/header.vue'
import footers from '@/components/footer.vue'
import mid from '@/components/main.vue'

export default {
  name: 'App',
  components: {
    headers,
    mid,
    footers
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
  background-image: url('assets/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
