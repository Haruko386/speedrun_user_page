<template>
    <div>
        <img width="260px" alt="Vue logo" src="../assets/photo.png">
        <h1>{{ msg }}</h1>
    </div>
    
</template>

<script>
import { ref, reactive } from 'vue';

export default {
    name: 'test',
    props: {
        msg: String
    },
    setup() {
        const message = ref('Hello Vue 3 with Composition API!');
        const count = ref(0);
        const names = reactive({ list: ['Alice', 'Bob', 'Charlie'] });

        function countAdd() {
            count.value++;
        }



        return {
            message, names, count, countAdd
        };
    }
}
</script>

<style scoped>
.button-example {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}

.button-row>* {
    margin: 0;
}
</style>