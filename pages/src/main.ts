import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import components  from './components';
import uiComponents from './components/ui';
import icons from './icons';

const app = createApp(App);

app.use(components);
app.use(uiComponents);
app.use(icons);

app.mount('#app');
