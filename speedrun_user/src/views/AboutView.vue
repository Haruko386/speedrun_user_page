<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{ $store.getters.getCount }}</p>
    <p>{{ getCount }}</p>
    <button @click="increment">Increase Count</button>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
  name: 'AboutView',
  methods: {
    addNumber() {
      this.$store.state.count += 1;
    }
  },
  computed: {
    ...mapState(['count']),
    ...mapGetters(['getCount']),
    ...mapMutations(['increment'])
  } 
}
</script>
