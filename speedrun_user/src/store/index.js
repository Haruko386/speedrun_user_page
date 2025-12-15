import { createStore } from 'vuex';

export default createStore({
    state: {
        UserIdMap: {
            '0jmpm0zj': 'Yihou',
            'x7617pqj': 'CYY2023',
            '8qrzvmdj': 'Remto',
            'jn9qeedx': 'huohuoUwU',
            'jpopv2k8': 'Swordow',
            '8rlvv2w8': 'Ghj14174',
            '8w060wvj': 'Lumosfan',
            'j0vo299x': 'Aribuge',
            'x36qglqx': 'HJM_GoldenTrophy',
            '8lrzd5v8': 'xiaomei',
            'x369vkqx': 'Haruko386',
            '8v23wzvj': 'Csus4',
            '8gmpy218': 'DUUScarlet',
            'x777rrqx': 'xuwuxw',
            '810ed5rx': 'wszOwO',
            'x7617pqq': 'pistachio3218'
        },

        /** ⭐ 新增：粉丝 mock 数据 */
        UserFollowerMock: [
            {
                id: '0jmpm0zj',
                pronouns: null,
                joined: 1464355191,
                country: 'China'
            },
            {
                id: 'x7617pqq',
                pronouns: 'He/Him',
                joined: 1580141239,
                country: 'China'
            },
            {
                id: '8qrzvmdj',
                pronouns: null,
                joined: 1608390215,
                country: 'China'
            },
            {
                id: 'j0vo299x',
                pronouns: 'He/Him',
                joined: 1633779261,
                country: 'China'
            },
            {
                id: 'j4qdm2vx',
                pronouns: 'He/Him',
                joined: 1634968182,
                country: 'China'
            },
            {
                id: 'jn9qeedx',
                pronouns: 'He/Him',
                joined: 1635056305,
                country: 'China'
            },
            {
                id: 'jpopv2k8',
                pronouns: 'He/Him',
                joined: 1654081143,
                country: 'China'
            },
            {
                id: '8gmpy218',
                pronouns: null,
                joined: 1659461953,
                country: 'China'
            },
            {
                id: '8w060wvj',
                pronouns: 'He/Him',
                joined: 1672012878,
                country: 'Nigeria'
            },
            {
                id: '8rlvv2w8',
                pronouns: 'She/Her',
                joined: 1675171963,
                country: 'China'
            },
            {
                id: 'x7617pqj',
                pronouns: 'She/Her',
                joined: 1676028239,
                country: 'China'
            },
            {
                id: '8v23wzvj',
                pronouns: 'Any/All',
                joined: 1676867260,
                country: 'China'
            },
            {
                id: 'x36qglqx',
                pronouns: null,
                joined: 1691507150,
                country: 'China'
            },
            {
                id: 'x777rrqx',
                pronouns: 'Any/All, He/Him',
                joined: 1696325741,
                country: 'China'
            },
            {
                id: '8lrzd5v8',
                pronouns: 'Any/All',
                joined: 1699345749,
                country: 'China'
            },
            {
                id: 'x369vkqx',
                pronouns: 'She/Her',
                joined: 1708211532,
                country: 'Hong Kong'
            }
        ],
        gameIdMap : {
            '76rqmld8': 'Hollow Knight',
            '4d7xvzr1': 'Animal Well',
            'y65r7g81': 'Hollow Knight: Silk Song',
            'o1y9j9v6': 'Celeste',
            '9d3reryd': 'Hollow Knight: Catergory Extensions',
            '4d73n317': 'Undertale',
            'pdv29k96': 'Pico Park',
            'm1zjgy36': 'Ori and the Will of the Wisps',
            'ldej3o51': 'Among Us',
            'yd487k6e': 'Plants vs. Zombies',
            '9do8nnk1': 'Overwatch 2',
        }
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