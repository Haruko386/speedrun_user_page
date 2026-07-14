<template>
  <section class="side-card about-card">
    <header>
      <h2>ABOUT {{ (user.name || 'RUNNER').toUpperCase() }}</h2>
      <button aria-label="Open full profile stats" @click="router.push({ name: 'About' })">
        <svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg>
      </button>
    </header>
    <p>{{ settings.bio || 'No bio available.' }}</p>
    <footer>
      <div><span>Joined</span><strong>{{ formatDate(user.signupDate) }}</strong></div>
      <div><span>Online</span><strong>{{ formatDate(user.touchDate || user.onlineDate) }}</strong></div>
      <div><span>Runs</span><strong>{{ verifiedCount }}</strong></div>
    </footer>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { formatDate } from '@/data/catalog'

const store = useStore()
const router = useRouter()
const user = computed(() => store.getters.user)
const settings = computed(() => store.getters.userSettings)
const verifiedCount = computed(() => store.getters.verifiedRuns.length)
</script>

<style scoped>
.side-card { overflow: hidden; border-radius: 7px; color: var(--text-main); background: var(--panel-bg); box-shadow: var(--shadow); text-align: left; }
.about-card { min-height: 179px; padding: 17px 17px 15px; display: flex; flex-direction: column; }
header { display: flex; align-items: center; justify-content: space-between; }
h2 { margin: 0; font-size: 14px; font-weight: 850; letter-spacing: .35px; }
button { width: 25px; height: 25px; display: grid; place-items: center; border: 0; background: transparent; color: #bfd2d6; cursor: pointer; }
button:hover { color: white; transform: translate(1px,-1px); }
svg { width: 21px; fill: none; stroke: currentColor; stroke-width: 1.7; }
p { margin: 20px 0 14px; color: #ecf4f5; font-size: 13px; line-height: 1.45; }
footer { margin-top: auto; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
footer div { display: flex; flex-direction: column; gap: 4px; }
footer span { color: #a5bcc2; font-size: 11px; font-weight: 650; }
footer strong { color: #f1f7f8; font-size: 15px; white-space: nowrap; }
</style>
