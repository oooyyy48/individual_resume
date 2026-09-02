<script setup lang="ts">
import { ref } from 'vue'

const active = ref(false)
const x = ref(0)
const y = ref(0)

function onMouseMove(event: MouseEvent) {
  x.value = event.clientX
  y.value = event.clientY
}

function show() {
  active.value = true
}

function hide() {
  active.value = false
}

defineExpose({ onMouseMove, show, hide })
</script>

<template>
  <div
    class="project-cursor"
    :class="{ 'is-active': active }"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
    }"
    aria-hidden="true"
  >
    查看项目
  </div>
</template>

<style scoped>
.project-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  width: 7rem;
  aspect-ratio: 1;
  border-radius: 50%;
  color: var(--surface);
  background: var(--accent);
  font-size: 0.72rem;
  pointer-events: none;
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.5);
  transition:
    opacity 0.2s,
    transform 0.45s var(--ease);
}

.project-cursor.is-active {
  opacity: 1;
  transform: translate3d(-50%, -50%, 0) scale(1);
}

@media (max-width: 720px) {
  .project-cursor {
    display: none;
  }
}
</style>
