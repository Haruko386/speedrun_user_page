<template>
  <UserGrid title="FOLLOWERS" :user-ids="userIds" empty-label="No followers in this export." />
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import UserGrid from '@/components/UserGrid.vue'

const store = useStore()
const userIds = computed(() => {
  const current = store.getters.user.id
  return [...new Set(store.getters.followers.map(relation =>
    relation.userId === current ? relation.followerId : relation.userId
  ).filter(id => id && id !== current))]
})
</script>
