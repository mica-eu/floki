import Vue from 'vue';
import router from './router';

import App from './components/App.vue';

Vue.directive('room-name', {
  update: function (el) {
    el.value = el.value.replace(new RegExp(' ', 'g'), '-');
  }
});

new Vue({
  router,
  el: '#app',
  render: h => h(App),
});
