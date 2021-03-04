// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

/**
 * Font Awesome SVG
 */
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

import {
  faServer,
  faLayerGroup,
  faSearch,
  faRedo,
  faArrowLeft,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faServer,
  faLayerGroup,
  faSearch,
  faRedo,
  faArrowLeft,
  faSyncAlt,
);

Vue.component('font-awesome-icon', FontAwesomeIcon)

/**
 * Config
 */
import _Config from '@/utils/config';
Vue.prototype.$_Config = _Config;

/**
 * utils for Vue.js
 */
import utils from '@/utils/utils';
Vue.prototype.$utils = utils;

/**
 * axios for Vue.js
 */
import request from "@/utils/request"
Vue.prototype.$request = request;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
