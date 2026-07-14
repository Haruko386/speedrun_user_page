<template>
  <footer class="footer-container">
    <span>© {{ year }} <a href="https://haruko386.github.io" target="_blank" rel="noreferrer">Haruko386</a> · Profile replica for <a href="https://www.speedrun.com/users/Limpid" target="_blank" rel="noreferrer">Limpid</a></span>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer-container {
  width: 100%;
  min-height: 62px;
  background-color: rgba(17, 25, 28, .78);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 90px;
  padding: 15px;
  color: #FFFFFF;
  font-size: 11px;
  text-align: center;
}

.footer-container a {
  color: inherit;
  text-decoration: none;
}

.footer-container a:hover {
  text-decoration: underline;
  opacity: 0.75;
}
</style>
