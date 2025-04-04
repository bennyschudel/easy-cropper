<script setup lang="ts">
import { computed, onMounted, useTemplateRef, reactive, watch, ref } from 'vue';
import { useDark, useToggle } from '@vueuse/core';

import 'easy-cropper';
import { EasyCropper } from 'easy-cropper';

type DownloadArgsType = {
  name: string;
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
};

type ComponentArgsType = {
  aspectRatio: number;
  noPixels: boolean;
  maxZoom: number;
};

const { BASE_URL } = import.meta.env;

const isDark = useDark();
const toggleDark = useToggle(isDark);

const cropper0 = useTemplateRef<EasyCropper>('cropper0');

const aspectRatios = [
  ['1:1', 1 / 1],
  ['3:2', 3 / 2],
  ['4:3', 4 / 3],
  ['16:9', 16 / 9],
  ['2:3', 2 / 3],
  ['3:4', 3 / 4],
  ['9:16', 9 / 16],
];

const formats = ['jpg', 'jpeg', 'png', 'webp'];

const qualities = [
  ['low', 0.4],
  ['medium', 0.6],
  ['high', 0.8],
  ['very high', 0.9],
  ['best', 1.0],
];

const componentArgs = reactive<ComponentArgsType>({
  aspectRatio: 1 / 1,
  maxZoom: 5,
  noPixels: false,
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

function onDownloadClick() {
  cropper0.value?.downloadCroppedImage(downloadArgs);
}

onMounted(() => {});
</script>

<template>
  <div class="app">
    <div class="head">
      <Button @click="toggleDark()">
        {{ isDark ? 'Dark' : 'Light' }}
      </Button>
      <a href="http://github.com/bennyschudel/easy-cropper">Github</a>
    </div>

    <h1>&lt;easy-cropper&gt;</h1>
    <div class="container">
      <easy-cropper
        ref="cropper0"
        v-bind="componentArgs"
        :src="`${BASE_URL}/image-01.jpg`"
      ></easy-cropper>
    </div>

    <div class="flex flex-col sm:flex-row gap-12 m-8">
      <div class="flex flex-col md:flex-row gap-3">
        <UiField for="aspectRatio" label="Aspect Ratio">
          <Select v-model="componentArgs.aspectRatio" id="aspectRatio">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <template v-for="[label, value] in aspectRatios" :key="label">
                <SelectItem :value="value">{{ label }}</SelectItem>
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
      </div>
      <div class="flex flex-col md:flex-row gap-3">
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
          <Button @click="onDownloadClick">Download</Button>
        </UiField>
      </div>
    </div>

    <p class="note">
      2025, by
      <a href="https://twitter.com/bennyschudel" target="_blank"
        >@bennyschudel</a
      >, MIT License
    </p>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  margin: 96px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  display: block;
  font-size: 40px;
  color: light-dark(#202020, #f0f0f0);
  background-clip: text;
  -webkit-background-clip: text;
}

h2 {
  font-size: 24px;
  margin-top: 64px;
}

code {
  background-color: light-dark(#f0f0f0, #202020);
  padding: 12px 16px;
  border-radius: 4px;
}

.container {
  margin-top: 32px;
  width: 100%;
  position: relative;
  aspect-ratio: 16 / 9;
  max-width: 1280px;
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
