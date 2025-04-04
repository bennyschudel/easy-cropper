<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { onMounted, useTemplateRef } from 'vue';

import 'easy-cropper';
import { EasyCropper } from 'easy-cropper';

const { BASE_URL } = import.meta.env;

const isDark = useDark();
const toggleDark = useToggle(isDark);

const cropper0 = useTemplateRef<EasyCropper>("cropper0");

function onDownloadClick() {
  cropper0.value?.downloadCroppedImage();
}

onMounted(() => {});
</script>

<template>
  <div class="app">
    <div class="head">
      <button @click="toggleDark()">
        <span class="ml-2">{{ isDark ? 'Dark' : 'Light' }}</span>
      </button>
      <a href="http://github.com/bennyschudel/easy-cropper">Github</a>
    </div>

    <h1>&lt;easy-cropper&gt;</h1>
    <div class="container">
      <easy-cropper ref="cropper0" :src="`${BASE_URL}/image-01.jpg`"></easy-cropper>
    </div>

    <button @click="onDownloadClick">Download</button>

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
  color: light-dark(#202020, #f0f0f0);;
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
