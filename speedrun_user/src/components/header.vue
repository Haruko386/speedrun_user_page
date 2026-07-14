<template>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="https://www.speedrun.com" target="_blank" rel="noreferrer">
        <img src="../assets/logo_speedrun.png" alt="Speedrun.com">
      </a>

      <nav class="primary-nav" aria-label="Primary navigation">
        <a href="https://www.speedrun.com/games" target="_blank" rel="noreferrer">
          Games
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4"/></svg>
        </a>
        <a href="https://www.speedrun.com/challenges" target="_blank" rel="noreferrer">Challenges</a>
        <a href="https://www.speedrun.com/forums" target="_blank" rel="noreferrer">Forums</a>
        <a href="https://www.speedrun.com/support" target="_blank" rel="noreferrer">Help</a>
        <button class="more-button" aria-label="More options">⋮</button>
      </nav>

      <div class="header-actions">
        <a class="supporter" href="https://www.speedrun.com/supporter" target="_blank" rel="noreferrer">
          <span>🖼️</span> SUPPORTER
        </a>

        <label class="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <input v-model="searchText" type="search" placeholder="Search for anything..." @input="handleSearch">
          <kbd>/</kbd>
        </label>

        <button class="icon-button" aria-label="Messages">
          <svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>
        </button>
        <button class="icon-button" aria-label="Notifications">
          <svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 20h4"/></svg>
        </button>

        <div ref="menuRoot" class="user-menu">
          <button class="user-trigger" :aria-expanded="showDropdown" aria-label="Open user menu" @click="showDropdown = !showDropdown">
            <img :src="profileImage" alt="User avatar">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4"/></svg>
          </button>
          <transition name="menu-fade">
            <div v-if="showDropdown" class="user-dropdown">
              <div class="profile-row">
                <img :src="profileImage" alt="">
                <div><strong>{{ user.name || 'Runner' }}</strong><small>View profile</small></div>
              </div>
              <a href="https://www.speedrun.com/support/tickets" target="_blank" rel="noreferrer">Support tickets</a>
              <button @click="openSettings">Settings</button>
              <a href="https://www.speedrun.com/supporter" target="_blank" rel="noreferrer">Supporter</a>
              <button class="sign-out">Sign out</button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import fallbackAvatar from '../assets/image.jpg'
import { avatarUrl } from '@/data/catalog'

const emit = defineEmits(['open-settings'])
const store = useStore()
const showDropdown = ref(false)
const searchText = ref('')
const menuRoot = ref(null)

const user = computed(() => store.getters.user)
const profileImage = computed(() => {
  if (store.getters.replicaSettings.avatarUrl) return store.getters.replicaSettings.avatarUrl
  return user.value.id && user.value.id !== 'jonk35n8' ? avatarUrl(user.value.id) : fallbackAvatar
})

const clearHighlights = () => {
  document.querySelectorAll('.speedrun-highlight').forEach(element => {
    element.replaceWith(document.createTextNode(element.textContent || ''))
  })
  document.body.normalize()
}

const handleSearch = () => {
  clearHighlights()
  const query = searchText.value.trim()
  if (!query) return
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const expression = new RegExp(escaped, 'gi')
  const walker = document.createTreeWalker(document.querySelector('main') || document.body, NodeFilter.SHOW_TEXT)
  const matches = []
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (node.parentElement?.closest('script, style, .settings-modal') || !expression.test(node.nodeValue || '')) continue
    expression.lastIndex = 0
    matches.push(node)
  }
  matches.forEach(node => {
    const fragment = document.createDocumentFragment()
    let start = 0
    ;(node.nodeValue || '').replace(expression, (match, offset) => {
      fragment.append(node.nodeValue.slice(start, offset))
      const mark = document.createElement('mark')
      mark.className = 'speedrun-highlight'
      mark.textContent = match
      fragment.append(mark)
      start = offset + match.length
      return match
    })
    fragment.append(node.nodeValue.slice(start))
    node.replaceWith(fragment)
  })
}

const openSettings = () => {
  showDropdown.value = false
  emit('open-settings')
}

const closeOnOutsideClick = (event) => {
  if (!menuRoot.value?.contains(event.target)) showDropdown.value = false
}

onMounted(() => document.addEventListener('click', closeOnOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', closeOnOutsideClick))
</script>

<style>
.speedrun-highlight {
  background: #ffe066;
  color: #172127;
  border-radius: 2px;
  padding: 0 1px;
}
</style>

<style scoped>
.site-header {
  height: 66px;
  background: rgba(185, 214, 220, 0.96);
  border-bottom: 1px solid rgba(43, 65, 72, 0.18);
  box-shadow: 0 1px 4px rgba(22, 37, 42, 0.12);
  position: relative;
  z-index: 100;
}

.header-inner {
  max-width: var(--content-width);
  width: calc(100% - 32px);
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.brand { display: flex; align-items: center; flex: 0 0 auto; }
.brand img { width: 198px; height: 45px; object-fit: contain; }

.primary-nav { display: flex; align-items: stretch; height: 100%; gap: 2px; }
.primary-nav a,
.more-button {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #24353b;
  padding: 0 12px;
  font-size: 15px;
  font-weight: 650;
  text-decoration: none;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.primary-nav a:hover,
.more-button:hover { background: rgba(35, 55, 62, 0.08); }
.primary-nav svg { width: 15px; fill: none; stroke: currentColor; stroke-width: 2; }
.more-button { font-size: 24px; padding: 0 8px; }

.header-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; min-width: 0; }
.supporter {
  height: 36px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(41, 59, 65, 0.2);
  border-radius: 5px;
  color: #293a40;
  background: rgba(255, 255, 255, 0.2);
  text-decoration: none;
  font-size: 11px;
  font-weight: 900;
}

.search-box {
  width: min(360px, 24vw);
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid rgba(45, 65, 71, 0.18);
  border-radius: 5px;
  background: rgba(126, 165, 174, 0.22);
}
.search-box:focus-within { background: rgba(255,255,255,.45); box-shadow: 0 0 0 2px rgba(54,111,127,.13); }
.search-box svg { width: 18px; fill: none; stroke: #526c74; stroke-width: 2; flex: 0 0 auto; }
.search-box input { min-width: 0; flex: 1; border: 0; outline: 0; background: none; color: #26383e; font: inherit; }
.search-box input::placeholder { color: #637c83; }
.search-box kbd { border: 1px solid rgba(45,65,71,.25); border-radius: 4px; padding: 1px 6px; color: #52686e; background: rgba(255,255,255,.18); }

.icon-button,
.user-trigger {
  border: 0;
  background: transparent;
  color: #31464d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-button { width: 34px; height: 40px; border-radius: 5px; }
.icon-button:hover,
.user-trigger:hover { background: rgba(35,55,62,.08); }
.icon-button svg { width: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; }

.user-menu { position: relative; }
.user-trigger { gap: 6px; height: 48px; padding: 0 4px; border-radius: 24px; }
.user-trigger img { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,.8); }
.user-trigger svg { width: 16px; fill: none; stroke: currentColor; stroke-width: 2; }

.user-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 220px;
  padding: 7px;
  border: 1px solid #dbe3e6;
  border-radius: 8px;
  background: #f8fbfc;
  color: #2b3b41;
  box-shadow: 0 14px 35px rgba(19,36,42,.23);
}
.profile-row { display: flex; align-items: center; gap: 10px; padding: 8px; margin-bottom: 5px; border-bottom: 1px solid #e1e8ea; }
.profile-row img { width: 38px; height: 38px; object-fit: cover; border-radius: 50%; }
.profile-row div { display: flex; flex-direction: column; text-align: left; }
.profile-row small { color: #71848a; margin-top: 2px; }
.user-dropdown a,
.user-dropdown > button { display: block; box-sizing: border-box; width: 100%; padding: 10px; border: 0; border-radius: 5px; background: none; color: inherit; text-decoration: none; text-align: left; font: inherit; cursor: pointer; }
.user-dropdown a:hover,
.user-dropdown > button:hover { background: #e9f0f2; }
.user-dropdown .sign-out { color: #b84b4b; border-top: 1px solid #e1e8ea; border-radius: 0 0 5px 5px; }
.menu-fade-enter-active,.menu-fade-leave-active { transition: opacity .14s ease, transform .14s ease; }
.menu-fade-enter-from,.menu-fade-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 1150px) {
  .supporter, .primary-nav a:nth-child(n+3), .more-button { display: none; }
  .search-box { width: min(310px, 32vw); }
}

@media (max-width: 760px) {
  .site-header { height: 58px; }
  .header-inner { width: calc(100% - 20px); gap: 8px; }
  .brand img { width: 150px; height: 36px; }
  .primary-nav, .icon-button { display: none; }
  .search-box { margin-left: auto; width: 38px; padding: 0 9px; }
  .search-box input, .search-box kbd { display: none; }
}
</style>
