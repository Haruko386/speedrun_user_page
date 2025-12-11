import { createRouter, createWebHashHistory } from 'vue-router'
import mid from '../components/mid.vue'
import ListView from '../views/ListView/LevelRunView.vue'
import FullGameRunView from '@/views/ListView/FullGameRunView.vue'
import ThreadsView from '@/views/ListView/ThreadsView.vue'
import FollowersView from '@/views/ListView/FollowersView.vue'
import FollowingView from '@/views/ListView/FollowingView.vue'
import PendingView from '@/views/ListView/PendingView.vue'
import AboutView from '@/views/ListView/AboutView.vue'
import CommentsView from '@/views/ListView/CommentsView.vue'


const routes = [
  {
    path: '/',
    name: 'mid',
    component: mid,
    children: [
      {
        path: '', // 默认路径，重定向到 Level runs
        redirect: '/level-runs'
      },
      {
        path: 'level-runs',
        name: 'LevelRuns',
        component: ListView
      },
      {
        path: 'full-game-runs',
        name: 'FullGameRuns',
        component: FullGameRunView
      },
      {
        path: 'threads',
        name: 'Threads',
        component: ThreadsView
      },
      {
        path: 'comments',
        name: 'Comments',
        component: CommentsView
      },
      {
        path: 'followers',
        name: 'Followers',
        component: FollowersView
      },
      {
        path: 'following',
        name: 'Following',
        component: FollowingView
      },
      {
        path: 'pending',
        name: 'Pending',
        component: PendingView
      },
      {
        path: 'about',
        name: 'About',
        component: AboutView
      }
    ]
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
