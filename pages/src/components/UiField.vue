<script lang="ts" setup>
import { Label } from '@/components/ui/label';

const props = defineProps<{
  for?: string;
  label?: string;
}>();
</script>

<template>
  <div class="grid items-center gap-1.5 ui-field">
    <Label :for="props.for ? props.for : undefined" class="text-neutral-600">{{
      props.label ?? '&nbsp;'
    }}</Label>
    <div class="flex data-[size=default]:h-9 items-center" data-size="default">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
