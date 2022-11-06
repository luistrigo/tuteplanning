import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n.js';

import App from './App.vue'
import router from './router'

import './assets/main.css'
import JsonCSV from 'vue-json-csv'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.component('downloadCsv', JsonCSV)   

app.mount('#app')
