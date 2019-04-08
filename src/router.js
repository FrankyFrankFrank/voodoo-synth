import Vue from 'vue'
import Router from 'vue-router'
import Synthesizer from './views/Synthesizer.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'synthesizer',
      component: Synthesizer
    },
  ]
})
