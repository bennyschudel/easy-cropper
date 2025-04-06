<script setup lang="ts">
import { computed, onMounted, useTemplateRef, reactive, watch, ref } from 'vue';
import { useDark, useToggle, useDropZone } from '@vueuse/core';
import { Toaster, toast } from 'vue-sonner';

import 'easy-cropper';
import { EasyCropper } from 'easy-cropper';

import { APP_VERSION } from './config';

type DownloadArgsType = {
  name: string;
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
};

type ComponentArgsType = {
  aspectRatio: string;
  noPixels: boolean;
  maxZoom: number;
  padding: number;
};

// ---

const { BASE_URL } = import.meta.env;

const isDark = useDark();
const toggleDark = useToggle(isDark);

const cropper = useTemplateRef<EasyCropper>('cropper');

const aspectRatios = ['1:1', '3:2', '4:3', '16:9', '2:3', '3:4', '9:16'];

const formats = ['jpg', 'jpeg', 'png', 'webp'];

const qualities = [
  ['low', 0.4],
  ['medium', 0.6],
  ['high', 0.8],
  ['very high', 0.9],
  ['best', 1.0],
];

const paddings = [
  ['small', 32],
  ['medium', 64],
  ['large', 96],
];

const componentArgs = reactive<ComponentArgsType>({
  aspectRatio: '1:1',
  maxZoom: 5,
  noPixels: false,
  padding: 64,
});

const componentArgsStr = computed(() => {
  return Object.entries(componentArgs)
    .map(([k, v]) => {
      if (typeof v === 'number') {
        v = Math.round(v * 1e3) / 1e3;
      }

      return `${k}="${v}"`;
    })
    .map((v) =>
      v.replace(/([^\s]+)="true"/, '$1').replace(/([^\s]+)="false"/, ''),
    )
    .filter(Boolean)
    .join('\n    ');
});

const downloadArgs = reactive<DownloadArgsType>({
  format: 'jpeg',
  name: 'my-image',
  quality: 1,
});

const formatDisabled = computed(() => {
  return downloadArgs.format === 'png';
});

const maxZoom = computed({
  get() {
    return [componentArgs.maxZoom];
  },
  set(value: number[]) {
    componentArgs.maxZoom = value[0];
  },
});

watch(downloadArgs, (args) => {
  if (args.format === 'png') {
    downloadArgs.quality = 1;
  }
});

const downloadFileName = computed(() => {
  const { format, name } = downloadArgs;

  return [name, format].join('.');
});

function onDownloadClick() {
  cropper.value?.downloadCroppedImage(downloadArgs);
}

async function onCopyClick() {
  await cropper.value?.copyCroppedImage();

  toast.success('Copied to clipboard', { duration: 1_000 });
}

const containerEl = ref<HTMLDivElement>();

function onDrop(files: File[] | null) {
  if (!files) return;

  const [file] = files;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    cropper.value?.loadImage(reader.result as string);
  };
}

const { isOverDropZone } = useDropZone(containerEl, {
  onDrop,
  dataTypes: ['image/jpeg', 'image/png', 'image/webp'],
  multiple: false,
  preventDefaultForUnhandled: false,
});

async function onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const clipboardItems = await navigator.clipboard.read();

  for (const clipboardItem of clipboardItems) {
    const imageTypes = clipboardItem.types?.filter((type: string) =>
      type.startsWith('image/'),
    );
    for (const imageType of imageTypes) {
      const blob = await clipboardItem.getType(imageType);

      cropper.value?.loadImageBlob(blob);
    }
  }
}

onMounted(() => {});
</script>

<template>
  <div class="app flex flex-col gap-4" ref="rootEl">
    <Toaster position="bottom-right" richColors />
    <div class="head mb-4">
      <Button @click="toggleDark()">
        <template v-if="isDark">
          <MoonIcon />
        </template>
        <template v-else>
          <SunIcon />
        </template>
        {{ isDark ? 'Dark' : 'Light' }}
      </Button>
      <Button as-child variant="link">
        <a href="http://github.com/bennyschudel/easy-cropper">
          <GithubIcon />
          Github</a>
      </Button>
    </div>

    <h1 class="flex items-center font-bold text-3xl md:text-4xl lg:text-5xl">
      &lt;easy-cropper&gt;
    </h1>

    <Badge variant="secondary" class="mb-8">
      {{ APP_VERSION }}
    </Badge>

    <div
      class="container"
      ref="containerEl"
      :data-can-drop="isOverDropZone ? '' : null"
      tabindex="0"
      @paste="onPaste"
    >
      <easy-cropper
        ref="cropper"
        v-bind="componentArgs"
        :src="`${BASE_URL}/image-01.jpg`"
      ></easy-cropper>
    </div>

    <div class="content flex flex-col items-center gap-4 max-w-8xl">
      <div class="max-w-lg p-8">
        <Alert>
          <BookIcon class="h-4 w-4" />
          <AlertDescription>
            These control inputs below, along with the drop and paste
            functionality, are intended solely for demonstration purposes and
            are not part of the component.
          </AlertDescription>
        </Alert>
      </div>

      <div class="flex flex-col gap-4 p-8 pt-0 items-center">
        <div class="flex flex-wrap justify-center p-4 gap-3">
          <UiField for="aspectRatio" label="Aspect Ratio">
            <Select v-model="componentArgs.aspectRatio" id="aspectRatio">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <template v-for="ratio in aspectRatios" :key="ratio">
                  <SelectItem :value="ratio">{{ ratio }}</SelectItem>
                </template>
              </SelectContent>
            </Select>
          </UiField>
          <UiField for="maxZoom" label="Max Zoom" class="w-48">
            <div class="flex gap-2 w-full items-center text-neutral-500">
              <Slider
                v-model="maxZoom"
                id="maxZoom"
                :default-value="[5]"
                :max="30"
                :step="1"
                :min="1"
              />
              <span>{{ componentArgs.maxZoom }}x</span>
            </div>
          </UiField>
          <UiField for="noPixels" label="No Pixels">
            <Checkbox v-model="componentArgs.noPixels" id="noPixels"></Checkbox>
          </UiField>
          <UiField for="padding" label="Padding">
            <Select v-model="componentArgs.padding" id="padding">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <template v-for="[label, value] in paddings" :key="label">
                  <SelectItem :value="value">{{ label }}</SelectItem>
                </template>
              </SelectContent>
            </Select>
          </UiField>
        </div>
        <Separator />
        <div class="flex flex-wrap justify-center p-4 gap-3">
          <UiField for="format" label="Format">
            <Select v-model="downloadArgs.format" id="format">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <template v-for="format in formats" :key="format">
                  <SelectItem :value="format">{{ format }}</SelectItem>
                </template>
              </SelectContent>
            </Select>
          </UiField>
          <UiField for="quality" label="Quality">
            <Select
              v-model="downloadArgs.quality"
              id="quality"
              :disabled="formatDisabled"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <template v-for="[label, value] in qualities" :key="label">
                  <SelectItem :value="value">{{ label }}</SelectItem>
                </template>
              </SelectContent>
            </Select>
          </UiField>
          <UiField for="name" label="Name">
            <Input v-model="downloadArgs.name" id="name" />
          </UiField>
          <UiField>
            <Button @click="onDownloadClick">
              <DownloadIcon />
              Download
            </Button>
          </UiField>
          <UiField>
            <Button @click="onCopyClick"
              ><ClipboardIcon /> Copy to Clipboard</Button
            >
          </UiField>
        </div>
      </div>

      <code class="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-sm">
        <pre class="text-xs">npm install easy-cropper</pre>
      </code>

      <div class="max-w-lg p-8 pb-0">
        <Alert>
          <BookIcon class="h-4 w-4" />
          <AlertDescription>
            The component is given absolute positioning by default, which is why the parent container needs to have relative positioning.
          </AlertDescription>
        </Alert>
      </div>

      <code class="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-sm">
        <pre class="text-xs">{{
`<div style="position: relative;">
  <easy-cropper
    ${componentArgsStr}
    src="${downloadFileName}"
  ></easy-cropper>
</div>`
        }}</pre>
      </code>

      <p class="note">
        2025, by
        <a href="https://twitter.com/bennyschudel" target="_blank"
          >@bennyschudel</a
        >, MIT License
      </p>
    </div>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  margin: 96px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  box-sizing: border-box;

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
}

.container {
  --border-color: light-dark(hsla(0, 0%, 0%, 0.2), hsla(0, 100%, 100%, 0.2));
  --border-width: 1px;
  --can-drop-color: var(--color-blue-500);

  width: 100%;
  position: relative;
  aspect-ratio: 16 / 9;
  max-width: 1280px;
  border: var(--border-width) solid var(--border-color);
  outline: none;

  &[data-can-drop] {
    --border-color: var(--can-drop-color);
    --border-width: 5px;
  }

  &:focus {
    --border-color: var(--ring);
  }
}

.head {
  align-items: center;
  display: inline-flex;
  gap: 16px;
}

.note {
  margin-top: 64px;
}

easy-cropper {
  --padding: clamp(32px, 10vw, 128px);
}
</style>
