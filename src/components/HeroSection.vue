<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Profile } from '@/types'
import { revealLines, fadeUp } from '@/utils/textReveal'

const { profile } = defineProps<{ profile: Profile }>()

const titleRef = ref<HTMLElement | null>(null)
const orbitRef = ref<HTMLElement | null>(null)
const sideRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

let cleanups: Array<() => void> = []

onMounted(() => {
  if (titleRef.value) {
    cleanups.push(revealLines(titleRef.value, { delay: 0.2, stagger: 0.14, duration: 1.3 }))
  }
  if (sideRef.value) {
    cleanups.push(fadeUp(sideRef.value.children, { delay: 0.85, stagger: 0.14 }))
  }
  if (footerRef.value) {
    cleanups.push(fadeUp(footerRef.value.children, { delay: 1.1, stagger: 0.1, y: 14 }))
  }
  if (orbitRef.value) {
    cleanups.push(fadeUp(orbitRef.value, { delay: 1.2, y: 12, duration: 1.4 }))
  }
})

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
  cleanups = []
})
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero-inner">
      <div class="hero-main">
        <h1 ref="titleRef" class="hero-title">
          {{ profile.statement.replace(profile.statementEmphasis, '') }}
          <em>{{ profile.statementEmphasis }}</em>
        </h1>

        <div ref="sideRef" class="hero-side">
          <p class="hero-side-label">{{ profile.role }}</p>
          <p>{{ profile.location }}<br />{{ profile.availability }}</p>
          <div class="hero-actions">
            <a class="hero-action hero-action--primary" href="#about">认识我 <span aria-hidden="true">↘</span></a>
            <a class="hero-action" href="#contact">联系我 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>

      <div ref="orbitRef" class="orbit" aria-hidden="true"></div>
      <div ref="footerRef" class="hero-footer">
        <span>{{ profile.name }}</span>
        <span class="scroll-line">向下探索</span>
        <span>{{ profile.location }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: fixed;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  background: var(--bg);
}

.hero-inner {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  min-height: 680px;
  padding: 8.5rem var(--page-pad) 3rem;
}

.hero-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 15rem;
  align-items: start;
  gap: 3rem;
}

.hero-title {
  max-width: 13ch;
  margin: 0;
  font-family: var(--display);
  font-size: 7rem;
  font-weight: 400;
  line-height: 0.96;
  letter-spacing: -0.01em;
}

.hero-title em {
  display: block;
  margin-left: 1.6ch;
  font-weight: 400;
  font-style: normal;
}

.hero-side {
  padding-top: 0.7rem;
  font-size: 0.84rem;
  color: color-mix(in oklch, var(--fg) 68%, transparent);
}

.hero-side-label {
  margin: 0 0 1.3rem;
  font-family: var(--mono);
  font-size: 0.68rem;
}

.hero-side p {
  max-width: 20ch;
  margin: 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.hero-action {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid color-mix(in oklch, var(--fg) 30%, transparent);
  font-family: var(--mono);
  font-size: 0.68rem;
  transition: border-color 0.35s var(--ease), transform 0.35s var(--ease);
}

.hero-action span {
  font-size: 0.9rem;
  transition: transform 0.35s var(--ease);
}

.hero-action:hover {
  border-color: var(--fg);
  transform: translateY(-2px);
}

.hero-action:hover span {
  transform: translate(2px, -2px);
}

.hero-action--primary {
  padding-right: 0.9rem;
  padding-left: 0.9rem;
  border: 1px solid var(--fg);
  color: var(--surface);
  background: var(--fg);
}

.orbit {
  position: absolute;
  right: 9%;
  bottom: 17%;
  width: 10rem;
  aspect-ratio: 1;
  border: 1px solid color-mix(in oklch, var(--fg) 25%, transparent);
  border-radius: 50%;
}

.orbit::before,
.orbit::after {
  content: "";
  position: absolute;
  border-radius: 50%;
}

.orbit::before {
  inset: 18%;
  border: 1px solid color-mix(in oklch, var(--fg) 50%, transparent);
}

.orbit::after {
  top: -5px;
  left: 50%;
  width: 10px;
  height: 10px;
  background: var(--fg);
}

.hero-footer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: end;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid color-mix(in oklch, var(--fg) 16%, transparent);
  font-family: var(--mono);
  font-size: 0.68rem;
}

.hero-footer span:nth-child(2) {
  text-align: center;
}

.hero-footer span:last-child {
  text-align: right;
}

.scroll-line {
  display: inline-flex;
  align-items: center;
  justify-self: center;
  gap: 0.6rem;
}

.scroll-line::before {
  content: "";
  width: 2.8rem;
  height: 1px;
  background: currentColor;
  transform-origin: left;
  animation: pulse-line 2s var(--ease) infinite;
}

@keyframes pulse-line {
  0%,
  100% {
    transform: scaleX(0.25);
    opacity: 0.35;
  }
  50% {
    transform: scaleX(1);
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 5.5rem;
  }
}

@media (max-width: 720px) {
  .hero-inner {
    min-height: 610px;
    padding-top: 7.5rem;
  }

  .hero-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-title {
    max-width: 10ch;
    font-size: 3.65rem;
  }

  .hero-title em {
    margin-left: 0.7ch;
  }

  .hero-side {
    justify-self: end;
    padding: 0;
  }

  .hero-actions {
    justify-content: flex-end;
  }

  .orbit {
    right: 2rem;
    bottom: 21%;
    width: 6rem;
  }

  .hero-footer {
    grid-template-columns: 1fr 1fr;
  }

  .hero-footer span:nth-child(2) {
    display: none;
  }
}
</style>
