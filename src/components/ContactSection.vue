<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Profile } from '@/types'
import { revealLines, fadeUp } from '@/utils/textReveal'

const { profile } = defineProps<{ profile: Profile }>()

const kickerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLElement | null>(null)

let cleanups: Array<() => void> = []

onMounted(() => {
  if (kickerRef.value) {
    cleanups.push(fadeUp(kickerRef.value, { start: 'top 78%', y: 12 }))
  }
  if (titleRef.value) {
    cleanups.push(
      revealLines(titleRef.value, { start: 'top 70%', delay: 0.15, stagger: 0.14, duration: 1.3 }),
    )
  }
  if (buttonRef.value) {
    cleanups.push(fadeUp(buttonRef.value, { start: 'top 85%', delay: 0.55, y: 16 }))
  }
})

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
  cleanups = []
})
</script>

<template>
  <section id="contact" class="contact">
    <div>
      <p ref="kickerRef" class="contact-kicker">03 / 下一件值得做的事</p>
      <h2 ref="titleRef" class="contact-title">一起把想法变成体验。</h2>
      <a ref="buttonRef" class="contact-button" :href="`mailto:${profile.email}`">发邮件给我 <span aria-hidden="true">↗</span></a>
    </div>

    <footer class="contact-foot">
      <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
      <span>{{ profile.location }} · {{ profile.availability }}</span>
      <div class="social-links">
        <a v-for="social in profile.socialLinks" :key="social.label" :href="social.href" target="_blank" rel="noreferrer">{{ social.label }}</a>
        <a :href="profile.resumeUrl" download>下载简历</a>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  z-index: 20;
  display: grid;
  place-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 9rem var(--page-pad);
  overflow: hidden;
  color: var(--surface);
  text-align: center;
  background: var(--accent);
}

.contact-kicker {
  margin: 0 0 2rem;
  font-family: var(--mono);
  font-size: 0.68rem;
  color: color-mix(in oklch, var(--surface) 70%, transparent);
}

.contact-title {
  max-width: 12ch;
  margin: 0 auto 3rem;
  font-family: var(--display);
  font-size: 6rem;
  font-weight: 400;
  line-height: 0.98;
}

.contact-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0.8rem 1.25rem;
  border: 1px solid color-mix(in oklch, var(--surface) 50%, transparent);
  border-radius: 999px;
  color: var(--accent);
  background: var(--surface);
  box-shadow: 0 12px 28px color-mix(in oklch, var(--fg) 18%, transparent);
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.contact-button span { margin-left: 0.45rem; }

.contact-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 36px color-mix(in oklch, var(--fg) 25%, transparent);
}

.contact-foot {
  position: absolute;
  right: var(--page-pad);
  bottom: 2rem;
  left: var(--page-pad);
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid color-mix(in oklch, var(--surface) 22%, transparent);
  font-family: var(--mono);
  font-size: 0.62rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.contact-foot a { transition: opacity 0.3s; }
.contact-foot a:hover { opacity: 0.65; }

@media (max-width: 1024px) {
  .contact-title { font-size: 5rem; }
}

@media (max-width: 720px) {
  .contact {
    min-height: 85vh;
  }
  .contact-title { font-size: 3.8rem; }
  .contact-foot {
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
    display: flex;
    align-items: flex-start;
  }

  .social-links { flex-wrap: wrap; }
}
</style>
