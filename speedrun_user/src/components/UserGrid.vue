<template>
  <section class="users-card">
    <header><h2>{{ title }}</h2></header>
    <div v-if="userIds.length" class="user-grid">
      <a v-for="id in userIds" :key="id" :href="`https://www.speedrun.com/users/${id}`" target="_blank" rel="noreferrer">
        <img :src="avatar(id)" :alt="userName(id)" @error="useFallback">
        <div>
          <strong>{{ userName(id) }} <small v-if="detail(id).pronouns">· {{ detail(id).pronouns }}</small></strong>
          <span>Joined {{ formatDate(detail(id).joined) }}<template v-if="detail(id).country"> · {{ detail(id).country }}</template></span>
        </div>
      </a>
    </div>
    <div v-else class="empty-state"><h3>NO USERS</h3><p>{{ emptyLabel }}</p></div>
  </section>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { avatarUrl, formatDate } from '@/data/catalog'
import fallbackAvatar from '@/assets/logo/0.png'

const props = defineProps({
  title: { type: String, required: true },
  userIds: { type: Array, default: () => [] },
  emptyLabel: { type: String, default: 'No users.' }
})
const store = useStore()
const hydrate = () => store.dispatch('hydrateUsers', props.userIds)
onMounted(hydrate)
watch(() => props.userIds, hydrate, { deep: true })
const userName = (id) => store.getters.userName(id)
const detail = (id) => store.getters.userDetail(id)
const avatar = (id) => detail(id).avatar || avatarUrl(id)
const useFallback = (event) => { event.target.src = fallbackAvatar }
</script>

<style scoped>
.users-card{overflow:hidden;border-radius:7px;color:var(--text-main);background:var(--panel-bg);box-shadow:var(--shadow);text-align:left}header{padding:14px 17px;border-bottom:1px solid var(--panel-line)}h2{margin:0;font-size:14px;font-weight:850;letter-spacing:.4px}.user-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:14px}.user-grid a{min-width:0;display:flex;align-items:center;gap:11px;padding:10px;border-radius:6px;background:rgba(35,56,63,.5);color:inherit;text-decoration:none}.user-grid a:hover{background:rgba(210,232,237,.11)}.user-grid img{width:44px;height:44px;flex:0 0 auto;border-radius:50%;object-fit:cover;background:rgba(15,28,33,.4)}.user-grid a>div{min-width:0;display:flex;flex-direction:column;gap:4px}.user-grid strong{overflow:hidden;color:#e7f0f2;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.user-grid small{color:#aec2c7;font-weight:500}.user-grid span{overflow:hidden;color:#9fb5bb;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.empty-state{padding:55px 20px 62px;text-align:center}.empty-state h3{margin:0 0 7px;font-size:15px}.empty-state p{margin:0;color:var(--text-muted);font-size:12px}@media(max-width:560px){.user-grid{grid-template-columns:1fr}}
</style>
