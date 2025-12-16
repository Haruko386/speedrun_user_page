<template>
  <footer class="footer-container">
    <span>© 2025 <a href="https://haruko386.github.io">Haruko386</a> ❤ <a href="https://www.speedrun.com/users/Limpid">Limpid</a> all rights reserved.</span>
  </footer>
</template>

<script>
export default {
  name: 'footers'
}
</script>

<style scoped>
.footer-container {
  width: 100%;
  height: 60px;
  background-color: #111618;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 128px;
  opacity: 0.7;
  color: #FFFFFF;
  font-size: 14px;
}

.footer-container a {
  color: inherit;
  text-decoration: none;
}

.footer-container a:hover {
  text-decoration: dashed;
  opacity: 0.6;
}
</style>