import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/less/styles.less'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faTimes} from '@fortawesome/free-solid-svg-icons'
import { faMicrophone} from '@fortawesome/free-solid-svg-icons'
import { faPlay} from '@fortawesome/free-solid-svg-icons'
import { faPause} from '@fortawesome/free-solid-svg-icons'
import { faRedo} from '@fortawesome/free-solid-svg-icons'
import { faCrow} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSpinner, faTimes, faMicrophone, faPlay, faPause, faRedo, faCrow)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
//Vue.use(axios)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
