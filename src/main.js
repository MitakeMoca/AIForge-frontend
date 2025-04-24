// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';
import Toast from "@/components/Toast.vue";

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(createPinia())

app.mount('#app')
