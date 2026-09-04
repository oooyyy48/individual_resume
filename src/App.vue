<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* ─── Design tokens —— shared across all components ─── */
:root {
  --bg: oklch(97.15% 0.0242 77.46);
  --surface: oklch(100% 0 0);
  --fg: oklch(0% 0 0);
  --muted: oklch(54.63% 0.0085 80.71);
  --border: oklch(90.11% 0.0201 77.31);
  --accent: oklch(33.36% 0.0518 202.79);
  --display: "Iowan Old Style", Baskerville, "Songti SC", STSong, serif;
  --body: "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
  --mono: SFMono-Regular, "Cascadia Mono", Consolas, monospace;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --page-pad: 3.5rem;
}

@media (max-width: 1024px) {
  :root {
    --page-pad: 2rem;
  }
}

@media (max-width: 720px) {
  :root {
    --page-pad: 1.2rem;
  }
}

/* ─── Global reset ─── */
* {
  box-sizing: border-box;
}

html {
  color: var(--fg);
  background: var(--bg);
}

html.lenis {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

body {
  margin: 0;
  min-width: 320px;
  overflow-x: hidden;
  font-family: var(--body);
  font-size: 16px;
  line-height: 1.45;
  background: var(--bg);
}

button,
input,
textarea {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  color: inherit;
  border: 0;
  cursor: pointer;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

/* Lines split by textReveal.ts slide up inside overflow masks */
.reveal-line {
  will-change: transform;
  white-space: nowrap;
}

.skip-link {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  padding: 0.8rem 1rem;
  background: var(--fg);
  color: var(--surface);
  transform: translateY(-200%);
  font-family: var(--body);
}

.skip-link:focus {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
