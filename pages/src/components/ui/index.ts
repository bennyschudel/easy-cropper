import type { App } from 'vue';

import { Alert, AlertDescription, AlertTitle } from './alert'
import { Badge } from './badge';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Input } from './input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Separator } from './separator'
import { Slider } from './slider';

const components = {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
};

export default {
  install: (app: App) => {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};
