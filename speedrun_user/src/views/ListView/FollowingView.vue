<template>
  <UserGrid title="FOLLOWING" :user-ids="userIds" empty-label="No followed users in this export." />
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import UserGrid from '@/components/UserGrid.vue'

const store = useStore()
const userIds = computed(() => {
  const current = store.getters.user.id
  return [...new Set(store.getters.followers.map(relation =>
    relation.followerId === current ? relation.userId : relation.followerId
  ).filter(id => id && id !== current))]
})
</script>
