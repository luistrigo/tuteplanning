import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import JsonCSV from 'vue-json-csv'



const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('downloadCsv', JsonCSV)   

app.mount('#app')
