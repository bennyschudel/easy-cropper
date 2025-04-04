import type { App } from 'vue';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import UiField from '@/components/UiField.vue';

const components = {
  Button,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  // ---
  UiField,
};

export default {
  install: (app: App) => {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};
