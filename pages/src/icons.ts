import type { App } from 'vue';

import { Book, Clipboard, Download, Moon, Sun } from 'lucide-vue-next';
import { GitHubIcon as Github } from 'vue3-simple-icons';

const icons = {
  Book,
  Clipboard,
  Download,
  Github,
  Moon,
  Sun,
};

export default {
  install: (app: App) => {
    Object.entries(icons).forEach(([name, component]) => {
      app.component(name + 'Icon', component);
    });
  },
};
