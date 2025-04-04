import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import UiComponents from './components/ui';

const app = createApp(App);

app.use(UiComponents);

app.mount('#app');
