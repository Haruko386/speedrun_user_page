<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="open" class="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" @click.self="close">
        <section class="settings-panel">
          <header class="settings-header">
            <div>
              <span class="eyebrow">LOCAL PROFILE EDITOR</span>
              <h2 id="settings-title">Profile settings</h2>
            </div>
            <button class="close-button" aria-label="Close settings" @click="close">×</button>
          </header>

          <div class="settings-body">
            <aside class="data-sidebar">
              <div class="source-card">
                <span>Current data source</span>
                <strong>{{ sourceName }}</strong>
                <small>{{ runCount }} runs · {{ followerCount }} followers</small>
              </div>

              <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="importFile">
              <button class="sidebar-action primary" @click="fileInput?.click()">
                <span>⇧</span>
                <div><strong>Import JSON</strong><small>Switch to another user export</small></div>
              </button>
              <button class="sidebar-action" @click="download">
                <span>⇩</span>
                <div><strong>Export JSON</strong><small>Download current profile data</small></div>
              </button>
              <button class="sidebar-action" @click="reloadOriginal">
                <span>↻</span>
                <div><strong>Reload project file</strong><small>Discard unsaved session data</small></div>
              </button>

              <p class="save-note">
                Under <code>npm run serve</code>, Save writes directly to
                <code>public/src_user_export.json</code>. Static deployments download the edited file instead.
              </p>
            </aside>

            <form class="profile-form" @submit.prevent="save">
              <div class="form-section">
                <h3>Public profile</h3>
                <div class="field-grid two-columns">
                  <label>
                    <span>Display name</span>
                    <input v-model="form.name" required maxlength="40">
                  </label>
                  <label>
                    <span>Country code</span>
                    <input v-model="form.areaId" maxlength="2" placeholder="cn">
                  </label>
                </div>
                <label>
                  <span>Bio</span>
                  <textarea v-model="form.bio" rows="3" maxlength="300"></textarea>
                </label>
                <div class="field-grid three-columns">
                  <label>
                    <span>Pronouns</span>
                    <input v-model="form.pronouns" placeholder="She/Her">
                  </label>
                  <label>
                    <span>Joined</span>
                    <input v-model="form.signupDate" type="date">
                  </label>
                  <label>
                    <span>Last online</span>
                    <input v-model="form.touchDate" type="date">
                  </label>
                </div>
              </div>

              <div class="form-section">
                <h3>Replica appearance</h3>
                <label>
                  <span>Avatar URL <em>optional</em></span>
                  <input v-model="form.avatarUrl" type="url" placeholder="https://…">
                </label>
                <label>
                  <span>Background image URL <em>optional</em></span>
                  <input v-model="form.backgroundUrl" type="url" placeholder="https://…">
                </label>
              </div>

              <div class="form-section">
                <h3>Social connections</h3>
                <div class="field-grid two-columns">
                  <label v-for="network in socialNetworks" :key="network.id">
                    <span>{{ network.label }}</span>
                    <input v-model="form[network.key]" :placeholder="network.label">
                  </label>
                </div>
              </div>

              <div v-if="status.message" class="status-message" :class="status.type" role="status">
                {{ status.message }}
              </div>

              <footer class="form-actions">
                <button type="button" class="cancel" @click="close">Cancel</button>
                <button type="submit" class="save" :disabled="saving">
                  {{ saving ? 'Saving…' : 'Save changes' }}
                </button>
              </footer>
            </form>
          </div>
        </section>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { formatDate, socialNetworks } from '@/data/catalog'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const store = useStore()
const fileInput = ref(null)
const status = reactive({ type: '', message: '' })

const emptyForm = () => ({
  name: '', bio: '', areaId: '', pronouns: '', signupDate: '', touchDate: '',
  avatarUrl: '', backgroundUrl: '', discord: '', twitch: '', youtube: '',
  instagram: '', bilibili: '', website: ''
})
const form = reactive(emptyForm())

const sourceName = computed(() => store.state.sourceName)
const saving = computed(() => store.state.saving)
const runCount = computed(() => store.getters.runList.length)
const followerCount = computed(() => store.getters.followers.length)

const resetForm = () => {
  const user = store.getters.user
  const settings = store.getters.userSettings
  const replica = store.getters.replicaSettings
  const socials = store.getters.socials
  Object.assign(form, emptyForm(), {
    name: user.name || settings.name || '',
    bio: settings.bio || '',
    areaId: user.areaId || settings.areaId || '',
    pronouns: (user.pronouns || settings.pronouns || []).join(', '),
    signupDate: formatDate(user.signupDate).replace('—', ''),
    touchDate: formatDate(user.touchDate).replace('—', ''),
    avatarUrl: replica.avatarUrl || '',
    backgroundUrl: replica.backgroundUrl || ''
  })
  socialNetworks.forEach(network => {
    form[network.key] = socials.find(item => Number(item.networkId) === network.id)?.value || ''
  })
  status.message = ''
}

watch(() => props.open, isOpen => {
  if (isOpen) resetForm()
})

const close = () => emit('close')

const importFile = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const data = JSON.parse(await file.text())
    await store.dispatch('importData', { data, sourceName: file.name })
    resetForm()
    status.type = 'success'
    status.message = `已导入 ${file.name}，页面数据已切换。点击 Save changes 可写回项目文件。`
  } catch (error) {
    status.type = 'error'
    status.message = `导入失败：${error.message}`
  } finally {
    event.target.value = ''
  }
}

const download = () => {
  store.dispatch('downloadData')
  status.type = 'success'
  status.message = '已导出当前 JSON。'
}

const reloadOriginal = async () => {
  try {
    await store.dispatch('loadData', { force: true })
    resetForm()
    status.type = 'success'
    status.message = '已重新读取 public/src_user_export.json。'
  } catch (error) {
    status.type = 'error'
    status.message = error.message
  }
}

const save = async () => {
  try {
    store.dispatch('updateProfile', { ...form })
    const result = await store.dispatch('saveData')
    status.type = result.mode === 'project' ? 'success' : 'notice'
    status.message = result.message
  } catch (error) {
    status.type = 'error'
    status.message = `保存失败：${error.message}`
  }
}

const onKeydown = (event) => {
  if (props.open && event.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.settings-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(13, 24, 29, .67);
  backdrop-filter: blur(7px);
}
.settings-panel {
  width: min(940px, 100%);
  max-height: min(820px, calc(100vh - 48px));
  overflow: hidden;
  color: #26383f;
  background: #f7fafb;
  border: 1px solid rgba(255,255,255,.5);
  border-radius: 12px;
  box-shadow: 0 25px 80px rgba(0,0,0,.38);
}
.settings-header { height: 82px; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; border-bottom: 1px solid #dce5e8; background: #eef4f5; }
.eyebrow { display: block; color: #668087; font-size: 10px; font-weight: 850; letter-spacing: 1.3px; }
h2 { margin: 3px 0 0; font-size: 24px; }
.close-button { width: 38px; height: 38px; border: 0; border-radius: 50%; background: transparent; color: #526970; font-size: 28px; line-height: 1; cursor: pointer; }
.close-button:hover { background: #dce8ea; }
.settings-body { display: grid; grid-template-columns: 250px minmax(0, 1fr); max-height: calc(min(820px, 100vh - 48px) - 82px); }
.data-sidebar { padding: 18px; background: #e9f0f2; border-right: 1px solid #d6e1e4; }
.source-card { display: flex; flex-direction: column; gap: 4px; padding: 14px; margin-bottom: 14px; border: 1px solid #d1dee1; border-radius: 8px; background: rgba(255,255,255,.55); text-align: left; }
.source-card span,.source-card small { color: #71878d; font-size: 11px; }
.source-card strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
.sidebar-action { width: 100%; display: flex; align-items: center; gap: 10px; padding: 11px; margin-bottom: 7px; border: 1px solid transparent; border-radius: 7px; background: transparent; color: #31464d; text-align: left; cursor: pointer; }
.sidebar-action:hover { background: rgba(255,255,255,.58); border-color: #d4e0e3; }
.sidebar-action.primary { color: #165e73; background: #d5e9ee; }
.sidebar-action > span { width: 24px; font-size: 20px; text-align: center; }
.sidebar-action div { display: flex; flex-direction: column; gap: 2px; }
.sidebar-action small { color: #778a90; font-size: 10px; }
.save-note { margin: 20px 3px 0; color: #677d83; font-size: 11px; line-height: 1.5; }
.save-note code { color: #415a62; font-size: 10px; }
.profile-form { overflow-y: auto; padding: 4px 24px 22px; text-align: left; }
.form-section { padding: 18px 0; border-bottom: 1px solid #e0e8ea; }
.form-section h3 { margin: 0 0 12px; color: #3b535b; font-size: 14px; text-transform: uppercase; letter-spacing: .5px; }
.field-grid { display: grid; gap: 12px; }
.two-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.three-columns { grid-template-columns: repeat(3, minmax(0, 1fr)); }
label { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
label > span { color: #60767d; font-size: 11px; font-weight: 750; }
label em { color: #8a9a9f; font-weight: 400; }
input,textarea { box-sizing: border-box; width: 100%; border: 1px solid #cbd9dd; border-radius: 6px; outline: 0; padding: 9px 10px; background: white; color: #26383f; font: inherit; font-size: 13px; }
textarea { resize: vertical; line-height: 1.45; }
input:focus,textarea:focus { border-color: #6399a7; box-shadow: 0 0 0 3px rgba(70,139,157,.12); }
.status-message { margin-top: 16px; padding: 11px 13px; border-radius: 6px; font-size: 12px; }
.status-message.success { color: #276341; background: #e1f2e8; }
.status-message.error { color: #8b3535; background: #f9e3e3; }
.status-message.notice { color: #745615; background: #fff0c9; }
.form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 18px; }
.form-actions button { min-width: 104px; padding: 10px 16px; border-radius: 6px; font-weight: 750; cursor: pointer; }
.cancel { border: 1px solid #ccd9dc; background: white; color: #52686e; }
.save { border: 1px solid #294f5a; background: #365f6a; color: white; }
.save:hover { background: #2d535e; }
.save:disabled { opacity: .6; cursor: wait; }
.modal-fade-enter-active,.modal-fade-leave-active { transition: opacity .18s ease; }
.modal-fade-enter-from,.modal-fade-leave-to { opacity: 0; }

@media (max-width: 760px) {
  .settings-modal { padding: 10px; }
  .settings-panel { max-height: calc(100vh - 20px); }
  .settings-body { display: block; overflow-y: auto; max-height: calc(100vh - 102px); }
  .data-sidebar { border-right: 0; border-bottom: 1px solid #d6e1e4; }
  .profile-form { overflow: visible; }
  .two-columns,.three-columns { grid-template-columns: 1fr; gap: 0; }
}
</style>
