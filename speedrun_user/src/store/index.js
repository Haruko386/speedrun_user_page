import { createStore } from 'vuex'
import {
  followerDetails,
  gameNames,
  levelNames,
  platformNames,
  socialNetworks,
  userNames
} from '@/data/catalog'

const API_ROOT = 'https://www.speedrun.com/api/v1'

const clone = (value) => JSON.parse(JSON.stringify(value))

const isValidExport = (data) => Boolean(
  data &&
  typeof data === 'object' &&
  data.user &&
  typeof data.user === 'object' &&
  Array.isArray(data.runList)
)

const mapWithConcurrency = async (values, worker, concurrency = 4) => {
  const queue = [...values]
  const results = []
  const runners = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const value = queue.shift()
      try {
        results.push(await worker(value))
      } catch (_) {
        results.push(null)
      }
    }
  })
  await Promise.all(runners)
  return results.filter(Boolean)
}

const fetchApi = async (path) => {
  const response = await fetch(`${API_ROOT}${path}`)
  if (!response.ok) throw new Error(`Speedrun API ${response.status}`)
  return response.json()
}

export default createStore({
  state: {
    exportData: null,
    loaded: false,
    loading: false,
    dataError: '',
    sourceName: 'src_user_export.json',
    dirty: false,
    saving: false,
    metadataStatus: 'idle',
    metadata: {
      games: { ...gameNames },
      levels: { ...levelNames },
      categories: {},
      platforms: { ...platformNames },
      users: { ...userNames },
      userDetails: { ...followerDetails },
      covers: {},
      ranks: {},
      miscellaneousCategories: {},
      variableValues: {}
    }
  },
  getters: {
    data: (state) => state.exportData || {},
    user: (state) => state.exportData?.user || {},
    userSettings: (state) => state.exportData?.userSettings || {},
    replicaSettings: (state) => state.exportData?._replica || {},
    socials: (state) => state.exportData?.userSocialConnectionList || [],
    runList: (state) => state.exportData?.runList || [],
    verifiedRuns: (state) => (state.exportData?.runList || []).filter(run => Number(run.verified) === 1),
    levelRuns: (state, getters) => getters.verifiedRuns.filter(run => Boolean(run.levelId)),
    fullGameRuns: (state, getters) => getters.verifiedRuns.filter(run => !run.levelId),
    pendingRuns: (state) => (state.exportData?.runList || []).filter(run => Number(run.verified) === 0),
    comments: (state) => state.exportData?.commentList || [],
    followers: (state) => state.exportData?.userFollowerList || [],
    followedGames: (state) => state.exportData?.gameFollowerList || [],
    threads: (state) => state.exportData?.threadList || [],
    gameName: (state) => (id) => state.metadata.games[id] || `Game ${id || 'unknown'}`,
    levelName: (state) => (id) => state.metadata.levels[id] || `Level ${id || 'unknown'}`,
    categoryName: (state) => (id) => state.metadata.categories[id] || 'Level',
    platformName: (state) => (id) => state.metadata.platforms[id] || 'PC',
    gameCover: (state) => (id) => state.metadata.covers[id] || '',
    runRank: (state) => (id) => state.metadata.ranks[id] || null,
    isMiscCategory: (state) => (id) => Boolean(state.metadata.miscellaneousCategories[id]),
    variableValue: (state) => (id) => state.metadata.variableValues[id] || null,
    userName: (state) => (id) => state.metadata.users[id] || `User ${id || 'unknown'}`,
    userDetail: (state) => (id) => state.metadata.userDetails[id] || {}
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_DATA(state, { data, sourceName }) {
      state.exportData = data
      state.sourceName = sourceName || 'src_user_export.json'
      state.loaded = true
      state.dataError = ''
      state.dirty = false
    },
    RESET_RANKS(state) {
      state.metadata.ranks = {}
    },
    SET_DATA_ERROR(state, message) {
      state.dataError = message
    },
    SET_DIRTY(state, dirty) {
      state.dirty = dirty
    },
    SET_SAVING(state, saving) {
      state.saving = saving
    },
    SET_METADATA_STATUS(state, status) {
      state.metadataStatus = status
    },
    MERGE_METADATA(state, payload) {
      Object.entries(payload).forEach(([group, values]) => {
        state.metadata[group] = { ...state.metadata[group], ...values }
      })
    }
  },
  actions: {
    async loadData({ state, commit, dispatch }, { force = false } = {}) {
      if (state.loaded && !force) return state.exportData
      commit('SET_LOADING', true)
      try {
        const response = await fetch(`/src_user_export.json${force ? `?t=${Date.now()}` : ''}`, {
          cache: force ? 'no-store' : 'default'
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (!isValidExport(data)) throw new Error('文件缺少 user 或 runList 字段')
        commit('RESET_RANKS')
        commit('SET_DATA', { data, sourceName: 'src_user_export.json' })
        dispatch('hydrateMetadata')
        return data
      } catch (error) {
        const message = `无法读取用户数据：${error.message}`
        commit('SET_DATA_ERROR', message)
        throw new Error(message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    importData({ commit, dispatch }, { data, sourceName }) {
      if (!isValidExport(data)) {
        throw new Error('不是有效的 Speedrun 用户导出：至少需要 user 和 runList。')
      }
      commit('RESET_RANKS')
      commit('SET_DATA', { data: clone(data), sourceName: sourceName || 'Imported JSON' })
      commit('SET_DIRTY', true)
      dispatch('hydrateMetadata')
    },

    async hydrateMetadata({ state, commit, dispatch }) {
      const userId = state.exportData?.user?.id
      if (!userId) return
      commit('SET_METADATA_STATUS', 'loading')
      try {
        const response = await fetchApi(`/users/${encodeURIComponent(userId)}/personal-bests?embed=game,category,level,platform`)
        const metadata = {
          games: {}, levels: {}, categories: {}, platforms: {}, covers: {}, ranks: {}, miscellaneousCategories: {}
        }
        ;(response.data || []).forEach(entry => {
          const game = entry.game?.data
          const category = entry.category?.data
          const level = entry.level?.data
          const platform = entry.platform?.data
          if (game?.id) {
            metadata.games[game.id] = game.names?.international || game.id
            metadata.covers[game.id] = game.assets?.['cover-small']?.uri || ''
          }
          if (category?.id) {
            metadata.categories[category.id] = category.name
            metadata.miscellaneousCategories[category.id] = Boolean(category.miscellaneous)
          }
          if (level?.id) metadata.levels[level.id] = level.name
          if (platform?.id) metadata.platforms[platform.id] = platform.name
          if (entry.run?.id && entry.place) metadata.ranks[entry.run.id] = entry.place
        })
        commit('MERGE_METADATA', metadata)
        await Promise.all([dispatch('hydrateMissingMetadata'), dispatch('hydrateVariables')])
        commit('SET_METADATA_STATUS', 'ready')
      } catch (_) {
        await Promise.all([dispatch('hydrateMissingMetadata'), dispatch('hydrateVariables')])
        commit('SET_METADATA_STATUS', 'offline')
      }
    },

    async hydrateVariables({ state, commit }) {
      const gameIds = [...new Set((state.exportData?.runList || []).map(run => run.gameId).filter(Boolean))].slice(0, 16)
      const responses = await mapWithConcurrency(gameIds, async id => {
        const response = await fetchApi(`/games/${id}/variables`)
        return response.data || []
      })
      const variableValues = {}
      responses.flat().forEach(variable => {
        const choices = variable.values?.values || {}
        Object.entries(choices).forEach(([id, choice]) => {
          variableValues[id] = {
            label: choice.label || id,
            variable: variable.name || '',
            isSubcategory: Boolean(variable['is-subcategory'])
          }
        })
      })
      commit('MERGE_METADATA', { variableValues })
    },

    async hydrateMissingMetadata({ state, commit }) {
      const data = state.exportData || {}
      const runs = data.runList || []
      const followedGames = data.gameFollowerList || []
      const gameIds = [...new Set([...runs.map(run => run.gameId), ...followedGames.map(item => item.gameId)].filter(Boolean))]
      const levelIds = [...new Set(runs.map(run => run.levelId).filter(Boolean))]
      const categoryIds = [...new Set(runs.map(run => run.categoryId).filter(Boolean))]
      const platformIds = [...new Set(runs.map(run => run.platformId).filter(Boolean))]

      const descriptors = [
        ...gameIds.filter(id => !state.metadata.games[id]).map(id => ({ type: 'games', id, path: `/games/${id}` })),
        ...levelIds.filter(id => !state.metadata.levels[id]).map(id => ({ type: 'levels', id, path: `/levels/${id}` })),
        ...categoryIds.filter(id => !state.metadata.categories[id]).map(id => ({ type: 'categories', id, path: `/categories/${id}` })),
        ...platformIds.filter(id => !state.metadata.platforms[id]).map(id => ({ type: 'platforms', id, path: `/platforms/${id}` }))
      ].slice(0, 40)

      const entries = await mapWithConcurrency(descriptors, async descriptor => {
        const response = await fetchApi(descriptor.path)
        return { ...descriptor, value: response.data }
      })

      const metadata = { games: {}, levels: {}, categories: {}, platforms: {}, covers: {}, miscellaneousCategories: {} }
      entries.forEach(({ type, id, value }) => {
        if (type === 'games') {
          metadata.games[id] = value.names?.international || id
          metadata.covers[id] = value.assets?.['cover-small']?.uri || ''
        } else if (type === 'categories') {
          metadata.categories[id] = value.name || id
          metadata.miscellaneousCategories[id] = Boolean(value.miscellaneous)
        } else {
          metadata[type][id] = value.name || id
        }
      })
      commit('MERGE_METADATA', metadata)
    },

    async hydrateUsers({ state, commit }, userIds) {
      const ids = [...new Set((userIds || []).filter(id => id && !state.metadata.users[id]))].slice(0, 30)
      if (!ids.length) return
      const users = await mapWithConcurrency(ids, async id => {
        const response = await fetchApi(`/users/${id}`)
        return response.data
      })
      const names = {}
      const details = {}
      users.forEach(user => {
        names[user.id] = user.names?.international || user.id
        details[user.id] = {
          joined: user.signup ? Math.floor(new Date(user.signup).getTime() / 1000) : null,
          country: user.location?.country?.names?.international || 'Unknown',
          pronouns: user.pronouns || null,
          avatar: user.assets?.image?.uri || ''
        }
      })
      commit('MERGE_METADATA', { users: names, userDetails: details })
    },

    updateProfile({ state, commit }, form) {
      if (!state.exportData) return
      const data = clone(state.exportData)
      const name = String(form.name || '').trim() || data.user.name || 'Runner'
      const country = String(form.areaId || '').trim().toLowerCase() || 'us'
      const pronouns = String(form.pronouns || '').trim()
      const signupDate = form.signupDate ? Math.floor(new Date(`${form.signupDate}T00:00:00Z`).getTime() / 1000) : data.user.signupDate
      const touchDate = form.touchDate ? Math.floor(new Date(`${form.touchDate}T00:00:00Z`).getTime() / 1000) : data.user.touchDate

      data.user = {
        ...data.user,
        name,
        url: name,
        areaId: country,
        pronouns: pronouns ? [pronouns] : [],
        signupDate,
        touchDate
      }
      data.userSettings = {
        ...(data.userSettings || {}),
        name,
        url: name,
        areaId: country,
        bio: String(form.bio || '').trim(),
        pronouns: pronouns ? [pronouns] : []
      }
      data._replica = {
        ...(data._replica || {}),
        avatarUrl: String(form.avatarUrl || '').trim(),
        backgroundUrl: String(form.backgroundUrl || '').trim()
      }

      const connections = [...(data.userSocialConnectionList || [])]
      socialNetworks.forEach(network => {
        const value = String(form[network.key] || '').trim()
        const existingIndex = connections.findIndex(item => Number(item.networkId) === network.id)
        if (value && existingIndex >= 0) connections[existingIndex] = { ...connections[existingIndex], value }
        if (value && existingIndex < 0) {
          connections.push({ userId: data.user.id, networkId: network.id, value, verified: false })
        }
        if (!value && existingIndex >= 0) connections.splice(existingIndex, 1)
      })
      data.userSocialConnectionList = connections
      commit('SET_DATA', { data, sourceName: state.sourceName })
      commit('SET_DIRTY', true)
    },

    async saveData({ state, commit, dispatch }) {
      if (!state.exportData) throw new Error('没有可保存的数据。')
      commit('SET_SAVING', true)
      try {
        const response = await fetch('/api/profile-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.exportData)
        })
        const contentType = response.headers.get('content-type') || ''
        if (!response.ok || !contentType.includes('application/json')) throw new Error('Save API unavailable')
        const result = await response.json()
        if (!result.saved) throw new Error(result.message || 'Save failed')
        commit('SET_DIRTY', false)
        return { mode: 'project', message: '已写回 public/src_user_export.json' }
      } catch (_) {
        dispatch('downloadData')
        return { mode: 'download', message: '当前不是开发服务器，已改为下载修改后的 JSON。' }
      } finally {
        commit('SET_SAVING', false)
      }
    },

    downloadData({ state }) {
      if (!state.exportData) return
      const blob = new Blob([`${JSON.stringify(state.exportData, null, 2)}\n`], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'src_user_export.json'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    }
  }
})
