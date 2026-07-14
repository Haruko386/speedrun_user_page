<template>
  <section class="profile-banner">
    <div class="profile-hero">
      <img class="profile-avatar" :src="profileImage" :alt="`${user.name || 'Runner'} avatar`">
      <div class="identity">
        <div class="name-line">
          <img src="../assets/icon.webp" alt="Verified">
          <h1>{{ user.name || 'Runner' }}</h1>
          <span v-if="pronouns" class="pronouns">{{ pronouns }}</span>
        </div>
        <div class="country-line"><span class="flag">{{ flag }}</span>{{ location }}</div>
        <div class="social-list" aria-label="Social links">
          <component
            :is="social.href ? 'a' : 'button'"
            v-for="social in visibleSocials"
            :key="social.id"
            class="social-chip"
            :href="social.href || undefined"
            :target="social.href ? '_blank' : undefined"
            :rel="social.href ? 'noreferrer' : undefined"
            :title="social.label"
            @click="social.copy ? copySocial(social.value) : undefined"
          >
            <img :src="social.icon" :alt="social.label">
            <span v-if="social.showValue">{{ social.value }}</span>
            <b v-if="social.verified && social.showValue" aria-label="Verified">✓</b>
          </component>
          <span v-if="copyMessage" class="copy-message">Copied</span>
        </div>
      </div>
    </div>

    <div class="profile-nav">
      <nav aria-label="Profile sections">
        <button
          v-for="tab in tabs"
          :key="tab.routeName"
          :class="{ active: route.name === tab.routeName }"
          @click="router.push({ name: tab.routeName })"
        >
          {{ tab.label }}
          <span v-if="tab.count" class="badge">{{ tab.count }}</span>
        </button>
      </nav>
      <button class="settings-button" @click="$emit('open-settings')">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.5a7 7 0 0 0-.7-1.7l1.1-1.8-2.1-2.1-1.8 1.1a7 7 0 0 0-1.7-.7l-.5-2h-3l-.5 2a7 7 0 0 0-1.7.7L4.3 4.4 2.2 6.5l1.1 1.8a7 7 0 0 0-.7 1.7l-2 .5v3l2 .5a7 7 0 0 0 .7 1.7l-1.1 1.8 2.1 2.1 1.8-1.1a7 7 0 0 0 1.7.7l.5 2h3l.5-2a7 7 0 0 0 1.7-.7l1.8 1.1 2.1-2.1-1.1-1.8a7 7 0 0 0 .7-1.7z"/></svg>
        Settings
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { avatarUrl, countryFlag, countryName } from '@/data/catalog'
import fallbackAvatar from '../assets/avatar.png'
import discordIcon from '../assets/logo/discord.png'
import twitchIcon from '../assets/logo/twitch.png'
import youtubeIcon from '../assets/logo/Youtube.png'
import instagramIcon from '../assets/logo/instagram.png'
import bilibiliIcon from '../assets/logo/bilibili.png'
import websiteIcon from '../assets/logo/Web.png'

defineEmits(['open-settings'])

const store = useStore()
const router = useRouter()
const route = useRoute()
const copyMessage = ref(false)

const user = computed(() => store.getters.user)
const profileImage = computed(() => {
  if (store.getters.replicaSettings.avatarUrl) return store.getters.replicaSettings.avatarUrl
  return user.value.id && user.value.id !== 'jonk35n8' ? avatarUrl(user.value.id) : fallbackAvatar
})
const pronouns = computed(() => (user.value.pronouns || []).join(', '))
const flag = computed(() => countryFlag(user.value.areaId))
const location = computed(() => countryName(user.value.areaId))

const socialById = computed(() => Object.fromEntries(store.getters.socials.map(item => [Number(item.networkId), item])))
const socialDefinitions = [
  { id: 5, label: 'Discord', icon: discordIcon, showValue: true, copy: true },
  { id: 29, label: 'Twitch', icon: twitchIcon, showValue: true, prefix: 'https://www.twitch.tv/' },
  { id: 32, label: 'YouTube', icon: youtubeIcon, prefix: 'https://www.youtube.com/user/' },
  { id: 11, label: 'Instagram', icon: instagramIcon, prefix: 'https://www.instagram.com/' },
  { id: 3, label: 'Bilibili', icon: bilibiliIcon, prefix: 'https://space.bilibili.com/' },
  { id: 31, label: 'Website', icon: websiteIcon, direct: true }
]
const visibleSocials = computed(() => socialDefinitions.flatMap(definition => {
  const connection = socialById.value[definition.id]
  if (!connection?.value) return []
  return [{
    ...definition,
    value: connection.value,
    verified: connection.verified,
    href: definition.copy ? '' : (definition.direct ? connection.value : `${definition.prefix}${connection.value}`)
  }]
}))

const tabs = computed(() => [
  { label: 'Full game runs', routeName: 'FullGameRuns', count: store.getters.fullGameRuns.length },
  { label: 'Level runs', routeName: 'LevelRuns', count: store.getters.levelRuns.length },
  { label: 'Threads', routeName: 'Threads', count: store.getters.threads.length },
  { label: 'Comments', routeName: 'Comments', count: store.getters.comments.length },
  { label: 'Followers', routeName: 'Followers', count: store.getters.followers.length },
  { label: 'Following', routeName: 'Following', count: store.getters.followers.length },
  { label: 'Pending', routeName: 'Pending', count: store.getters.pendingRuns.length },
  { label: 'About', routeName: 'About', count: 0 }
])

const copySocial = async (value) => {
  try {
    await navigator.clipboard.writeText(value)
    copyMessage.value = true
    window.setTimeout(() => { copyMessage.value = false }, 1300)
  } catch (_) { /* Clipboard can be unavailable on non-HTTPS previews. */ }
}
</script>

<style scoped>
.profile-banner {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  background: var(--panel-bg);
  box-shadow: var(--shadow);
  color: var(--text-main);
}
.profile-hero {
  min-height: 149px;
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 18px 28px;
  background: linear-gradient(110deg, rgba(67,94,102,.9), rgba(65,91,99,.78));
}
.profile-avatar { width: 92px; height: 92px; flex: 0 0 auto; border-radius: 50%; object-fit: cover; border: 2px solid rgba(245,251,252,.9); box-shadow: 0 2px 8px rgba(0,0,0,.25); }
.identity { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; }
.name-line { display: flex; align-items: center; gap: 7px; min-width: 0; }
.name-line > img { width: 16px; height: 16px; object-fit: contain; }
h1 { margin: 0; font-size: 24px; line-height: 1.25; font-weight: 750; background: linear-gradient(90deg,#44bbee,#ffb3f3); background-clip: text; -webkit-background-clip: text; color: transparent; }
.pronouns { padding: 3px 7px; border-radius: 12px; background: rgba(255,255,255,.1); color: var(--text-muted); font-size: 11px; }
.country-line { display: flex; align-items: center; gap: 7px; margin-top: 10px; color: #f2f6f7; font-size: 14px; font-weight: 650; }
.flag { font-size: 16px; line-height: 1; }
.social-list { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-top: 10px; }
.social-chip { height: 27px; display: inline-flex; align-items: center; gap: 5px; padding: 0 8px; border: 0; border-radius: 5px; background: rgba(204,224,229,.13); color: #d6e4e7; text-decoration: none; font-size: 11px; font-weight: 650; cursor: pointer; }
.social-chip:hover { background: rgba(224,239,242,.22); color: white; }
.social-chip img { width: 16px; height: 16px; object-fit: contain; filter: grayscale(.15); }
.social-chip b { width: 13px; height: 13px; display: inline-grid; place-items: center; border-radius: 50%; background: #b9d1d6; color: #45616a; font-size: 9px; }
.copy-message { color: #dbe9ec; font-size: 11px; }
.profile-nav { height: 51px; display: flex; align-items: stretch; background: rgba(39,60,67,.93); }
.profile-nav nav { min-width: 0; display: flex; overflow-x: auto; scrollbar-width: none; }
.profile-nav nav::-webkit-scrollbar { display: none; }
.profile-nav button { position: relative; flex: 0 0 auto; display: flex; align-items: center; gap: 7px; padding: 0 16px; border: 0; background: transparent; color: #bfd0d4; font-size: 13px; font-weight: 700; cursor: pointer; }
.profile-nav button:hover { color: white; background: rgba(255,255,255,.04); }
.profile-nav nav button::after { content: ''; position: absolute; height: 2px; right: 8px; bottom: 0; left: 8px; background: white; transform: scaleX(0); transition: transform .18s ease; }
.profile-nav nav button.active { color: white; }
.profile-nav nav button.active::after { transform: scaleX(1); }
.badge { min-width: 21px; height: 21px; padding: 0 6px; display: inline-grid; place-items: center; border-radius: 12px; background: rgba(193,215,221,.17); color: #e5eff1; font-size: 10px; }
.settings-button { margin-left: auto; border-left: 1px solid rgba(255,255,255,.05) !important; }
.settings-button svg { width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 1.7; }

@media (max-width: 760px) {
  .profile-hero { min-height: 130px; padding: 16px; gap: 15px; }
  .profile-avatar { width: 74px; height: 74px; }
  h1 { font-size: 21px; }
  .social-chip span,.social-chip b { display: none; }
  .social-chip { width: 28px; padding: 0; justify-content: center; }
  .profile-nav { height: 48px; }
  .profile-nav button { padding: 0 12px; font-size: 12px; }
  .settings-button { padding: 0 12px !important; font-size: 0 !important; }
}
</style>
