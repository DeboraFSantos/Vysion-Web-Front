import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import money from 'v-money3'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { initializeApp } from 'firebase/app'
import "izitoast/dist/css/iziToast.css"
import "vue-multiselect/dist/vue-multiselect.css"
import VueApexCharts from "vue3-apexcharts";

library.add(fas, far);


const firebaseConfig = {
    apiKey: "AIzaSyBnFce5EXwOiLIXNCB9_uMlBAc3z6Pcsxs",
    authDomain: "vysion-917ff.firebaseapp.com",
    projectId: "vysion-917ff",
    storageBucket: "vysion-917ff.appspot.com",
    messagingSenderId: "506413084503",
    appId: "1:506413084503:web:5667b2e39652f91e7ad812",
    measurementId: "G-28WZLW0CR0"
}

initializeApp(firebaseConfig);

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)
app.use(money)
app.use(VueApexCharts);

router.isReady().then(() => {
    app.mount('#app')
})

