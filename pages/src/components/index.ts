import type { App } from 'vue';

import UiField from './UiField.vue';

const components = {
  UiField,
};

export default {
  install: (app: App) => {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};
