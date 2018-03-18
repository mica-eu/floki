import Vue from 'vue';
import VueRouter from 'vue-router';

import Setup from './components/Setup.vue';
import Room from './components/Room.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'home',
    component: Setup,
  }, {
    path: '/:id',
    name: 'room',
    component: Room,
  }],
});

export default router;
