import { createStore } from 'vuex';

export default createStore({
    state: {
        count: 1
    },
    getters: {
        doubleCount(state) {
            return state.count * 2;
        },
        getCount(state) {
            return state.count > 0 ? state.count : "No count available";
        }
    },
    mutations: {
        increment(state) {
            state.count++;
            state.count *= 2;
        }
    },
    actions: {
        addNumber({ commit }) {
            commit('increment');
        }
    },
    modules: {
    }
})