<template>
  <div class="app-shell" :style="backgroundStyle">
    <headers @open-settings="settingsOpen = true" />
    <main>
      <div v-if="loading" class="page-state">Loading profile…</div>
      <div v-else-if="dataError" class="page-state error">{{ dataError }}</div>
      <router-view v-else @open-settings="settingsOpen = true" />
    </main>
    <footers />
    <SettingsModal :open="settingsOpen" @close="settingsOpen = false" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import headers from '@/components/header.vue'
import footers from '@/components/footer.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import defaultBackground from '@/assets/background.png'

const store = useStore()
const settingsOpen = ref(false)
const loading = computed(() => store.state.loading || !store.state.loaded)
const dataError = computed(() => store.state.dataError)
const backgroundStyle = computed(() => ({
  '--profile-background': `url("${store.getters.replicaSettings.backgroundUrl || defaultBackground}")`
}))

onMounted(() => {
  store.dispatch('loadData').catch(() => {})
})
</script>

<style>
:root {
  --content-width: 1312px;
  --panel-bg: rgba(49, 73, 81, .88);
  --panel-bg-strong: rgba(42, 63, 70, .94);
  --panel-soft: rgba(82, 111, 119, .56);
  --panel-line: rgba(211, 230, 235, .13);
  --text-main: #edf5f7;
  --text-muted: #bbced3;
  --text-faint: #8fa9b0;
  --shadow: 0 3px 10px rgba(20, 35, 40, .25);
}

* { box-sizing: border-box; }
html { min-width: 320px; background: #9bbcc2; }
body { margin: 0; min-height: 100vh; color: var(--text-main); background: #9bbcc2; }
button,input,textarea { font-family: inherit; }
#app { min-height: 100vh; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }

.app-shell { position: relative; min-height: 100vh; isolation: isolate; }
.app-shell::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -2;
  background-image: var(--profile-background);
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
}
.app-shell::after {
  content: '';
  position: fixed;
  inset: 66px 0 0;
  z-index: -1;
  pointer-events: none;
  background: rgba(203, 225, 229, .12);
}

main { min-height: calc(100vh - 230px); }
.page-state { max-width: var(--content-width); width: calc(100% - 32px); margin: 16px auto; padding: 30px; border-radius: 8px; background: var(--panel-bg); box-shadow: var(--shadow); color: white; text-align: center; }
.page-state.error { background: rgba(112, 48, 48, .9); }

::selection { color: #17262b; background: #bfe6ef; }

@media (max-width: 760px) {
  :root { --content-width: 100%; }
  .app-shell::after { top: 58px; }
}
</style>
