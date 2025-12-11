<template>
    <div class="stats-card">
        <!-- Title -->
        <div class="stats-title">USER STATS</div>

        <!-- Speedrun Stats -->
        <div class="section-title">SPEEDRUN STATS</div>
        <div class="stats-grid">
            <div class="stats-item">
                <div class="label">Total runs</div>
                <div class="value">{{ totalRuns }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Full game runs</div>
                <div class="value">{{ totalRuns - levelRuns }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Level runs</div>
                <div class="value">{{ levelRuns }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Challenge runs</div>
                <div class="value">{{ challengeRuns }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Pending runs</div>
                <div class="value">{{ pendingRuns }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Total run time</div>
                <div class="value">{{ totalRunTime }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Unique games</div>
                <div class="value">{{ uniqueGames }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Unique categories</div>
                <div class="value">{{ uniqueCategories }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Unique levels</div>
                <div class="value">{{ uniqueLevels }}</div>
            </div>

            <div class="stats-item">
                <div class="label">First run</div>
                <div class="value">{{ firstRun }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Last run</div>
                <div class="value">{{ lastRun }}</div>
            </div>
        </div>

        <!-- Community Stats -->
        <div class="section-title">COMMUNITY STATS</div>
        <div class="stats-grid">
            <div class="stats-item">
                <div class="label">Joined</div>
                <div class="value" v-if="users">{{ formatDate2Sec(users.signupDate) }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Last visit</div>
                <div class="value"v-if="users">{{ formatDate2Sec(users.touchDate) }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Followers</div>
                <div class="value">{{ followers }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Games followed</div>
                <div class="value" v-if="gameFollowerList">{{ gameFollowerList.length }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Users followed</div>
                <div class="value" v-if="userFollowerList">{{ userFollowerList.length }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Threads created</div>
                <div class="value">{{ threadsCreated }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Guides created</div>
                <div class="value">{{ guidesCreated }}</div>
            </div>

            <div class="stats-item">
                <div class="label">Resources created</div>
                <div class="value">{{ resourcesCreated }}</div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const getAllVerifiedRunCount = () => {
    return runList.value.filter(run => run.verified == 1).length;
};

const getLevelRunCount = () => {
    return runList.value.filter(run => run.levelId && run.verified == 1).length;
};

const users = ref(null);
const userSettings = ref(null);
const userSocialConnectionList = ref(null);
const runList = ref([]);
const userFollowerList = ref([]);
const commentList = ref([]);
const gameFollowerList = ref([]);

const totalRuns = computed(() => getAllVerifiedRunCount())
const levelRuns = computed(() => getLevelRunCount())
const challengeRuns = 0
const pendingRuns = 0
const totalRunTime = ref("11h 19m 07s")
const uniqueGames = ref(0)
const uniqueCategories = ref(0)
const uniqueLevels = ref(0)
const firstRun = ref("-")
const lastRun = ref("-")

const followers = 11
const threadsCreated = 0
const guidesCreated = 0
const resourcesCreated = 0

function formatDuration(seconds) {
  if (seconds < 0) return '0s';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  let result = '';
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}m `;
  }
  if (secs > 0 || (hours === 0 && minutes === 0)) {
    result += `${secs}s`;
  }
  return result.trim();
}

const getInfo = () => {
    var time = 0.0, dateFirst = 0x3f3f3f3f3f, dateLast = 0;
    var games = {}, categories = {}, levels = {}
    for (const run of runList.value) {
        if (run.verified != 1)continue;
        time += run.igt ? run.igt : run.time;
        dateFirst = Math.min(dateFirst, run.dateSubmitted);
        dateLast = Math.max(dateLast, run.dateSubmitted);
        games[run.gameId]++;
        categories[run.categoryId]++;
        levels[run.levelId]++;
    }
    console.log(time);
    console.log(formatDuration(time));
    totalRunTime.value = formatDuration(time);
    uniqueGames.value = Object.keys(games).length;
    uniqueCategories.value = Object.keys(categories).length;
    uniqueLevels.value = Object.keys(levels).length;
    firstRun.value = formatDate2Sec(dateFirst);
    lastRun.value = formatDate2Sec(dateLast);
}

onMounted(async () => {
    try {
        const response = await fetch('/src_user_export.json');
        const data = await response.json();
        users.value = data.user;
        userSettings.value = data.userSettings;
        userSocialConnectionList.value = data.userSocialConnectionList;
        runList.value = data.runList;
        userFollowerList.value = data.userFollowerList;
        commentList.value = data.commentList;
        gameFollowerList.value = data.gameFollowerList;
    } catch (error) {
        console.error('Load json failed:', error);
    }
    getInfo();
});

const formatDate2Sec = (timestamp) => {
    if (!timestamp) return '-';
    const d = new Date(timestamp * 1000);
    const pad = (n) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const min = pad(d.getMinutes());
    const sec = pad(d.getSeconds());
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
};
</script>

<style scoped>
.stats-card {
    background: linear-gradient(135deg, rgba(57, 74, 82, 0.85), rgba(38, 54, 61, 0.9));
    color: #fff;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    width: 100%;
    backdrop-filter: blur(6px);
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
}

.stats-title {
    font-size: 18px;
    font-weight: 900;
    text-transform: uppercase;
    opacity: 0.95;
    margin-bottom: 10px;
}

.section-title {
    font-size: 14px;
    margin-top: 18px;
    margin-bottom: 6px;
    opacity: 0.8;
    font-weight: 700;
    text-transform: uppercase;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px 12px;
    margin-bottom: 10px;
}

.stats-item {
    background: rgba(34, 46, 51, 0.85);
    padding: 10px 12px;
    border-radius: 8px;
}

.label {
    font-size: 12px;
    opacity: 0.75;
}

.value {
    font-size: 17px;
    font-weight: 800;
    margin-top: 2px;
}
</style>