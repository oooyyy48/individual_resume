<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Profile } from '@/types'
import { fadeUp } from '@/utils/textReveal'
import { ArrowUpRight, Compass, FileDown, Github, Mail, MapPin, MessageCircle } from 'lucide-vue-next'

const { profile } = defineProps<{ profile: Profile }>()

const kickerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

let cleanups: Array<() => void> = []

onMounted(() => {
  if (kickerRef.value) {
    cleanups.push(fadeUp(kickerRef.value, { start: 'top 78%', y: 12 }))
  }
  if (titleRef.value) {
    cleanups.push(
      fadeUp(titleRef.value, { start: 'top 70%', delay: 0.15, stagger: 0.14, duration: 1.3 }),
    )
  }
  if (buttonRef.value) {
    cleanups.push(fadeUp(buttonRef.value, { start: 'top 85%', delay: 0.55, y: 16 }))
  }
  if (listRef.value) {
    cleanups.push(
      fadeUp(listRef.value.children, { start: 'top 82%', stagger: 0.08, y: 16 }),
    )
  }
})

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
  cleanups = []
})
</script>

<template>
  <section id="contact" class="contact">
    <div class="contact-inner">
      <div class="contact-main">
        <p ref="kickerRef" class="contact-kicker">04 / 保持联系</p>
        <h2 ref="titleRef" class="contact-title">一起把想法变成体验。</h2>
        <a ref="buttonRef" class="contact-button" :href="`mailto:${profile.email}`">
          发邮件给我
          <ArrowUpRight class="contact-button-icon" :size="17" aria-hidden="true" />
        </a>
      </div>

      <ul ref="listRef" class="contact-list">
        <li>
          <span class="contact-list-icon"><Mail :size="15" aria-hidden="true" /></span>
          <span class="contact-list-label">邮箱</span>
          <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
        </li>
        <li>
          <span class="contact-list-icon"><Mail :size="15" aria-hidden="true" /></span>
          <span class="contact-list-label">备用</span>
          <a :href="`mailto:${profile.secondaryEmail}`">{{ profile.secondaryEmail }}</a>
        </li>
        <li>
          <span class="contact-list-icon"><MessageCircle :size="15" aria-hidden="true" /></span>
          <span class="contact-list-label">QQ</span>
          <span>{{ profile.qq }}</span>
        </li>
        <li>
          <span class="contact-list-icon"><Github :size="15" aria-hidden="true" /></span>
          <span class="contact-list-label">GitHub</span>
          <a :href="profile.socialLinks[0]?.href" target="_blank" rel="noreferrer">{{ profile.socialLinks[0]?.label }}</a>
        </li>
        <li>
          <span class="contact-list-icon"><FileDown :size="15" aria-hidden="true" /></span>
          <span class="contact-list-label">简历</span>
          <a :href="profile.resumeUrl" download>下载简历</a>
        </li>
        <li>
          <span class="contact-list-icon"><MapPin :size="15" aria-hidden="true" /></span>
          <span class="contact-list-label">位置</span>
          <span>{{ profile.location }}</span>
        </li>
        <li>
          <span class="contact-list-icon"><Compass :size="15" aria-hidden="true" /></span>
          <span class="contact-list-label">方向</span>
          <span>{{ profile.availability }}</span>
        </li>
      </ul>
    </div>

    <footer class="contact-foot">
      <span>© 2026 {{ profile.name }}</span>
      <span>{{ profile.location }} · 从想法到可运行的体验</span>
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
  padding: 9rem var(--page-pad) 7rem;
  /* Size context for the cqw-based title */
  container-type: inline-size;
  overflow: hidden;
  color: var(--surface);
  background: var(--accent);
}

.contact-inner {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  align-items: center;
  gap: 4rem clamp(3rem, 6vw, 7rem);
  width: min(100%, 78rem);
}

/* ── Left: the 04 block ── */
.contact-kicker {
  margin: 0 0 2rem;
  font-family: var(--mono);
  font-size: 0.68rem;
  color: color-mix(in oklch, var(--surface) 70%, transparent);
}

/* Ten CJK glyphs ≈ 10em — sized against its own column via cqw */
.contact-title {
  margin: 0 0 3rem;
  font-family: var(--display);
  font-size: clamp(2rem, 5.6cqw, 4.4rem);
  font-weight: 400;
  line-height: 1.12;
  text-wrap: balance;
}

.contact-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 52px;
  padding: 0.8rem 1.35rem;
  border: 1px solid color-mix(in oklch, var(--surface) 50%, transparent);
  border-radius: 999px;
  color: var(--accent);
  background: var(--surface);
  box-shadow: 0 12px 28px color-mix(in oklch, var(--fg) 18%, transparent);
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.contact-button-icon {
  transition: transform 0.35s var(--ease);
}

.contact-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 36px color-mix(in oklch, var(--fg) 25%, transparent);
}

.contact-button:hover .contact-button-icon {
  transform: translate(2px, -2px);
}

/* ── Right: info list with open-source icons (lucide) ── */
.contact-list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid color-mix(in oklch, var(--surface) 22%, transparent);
}

.contact-list li {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 1.1rem;
  padding: 0.85rem 0.2rem;
  border-bottom: 1px solid color-mix(in oklch, var(--surface) 14%, transparent);
  font-size: 0.85rem;
}

.contact-list-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid color-mix(in oklch, var(--surface) 28%, transparent);
  border-radius: 50%;
  color: color-mix(in oklch, var(--surface) 82%, transparent);
}

.contact-list-label {
  font-family: var(--mono);
  font-size: 0.62rem;
  letter-spacing: 0.02em;
  color: color-mix(in oklch, var(--surface) 60%, transparent);
}

.contact-list a {
  justify-self: start;
  transition: opacity 0.3s;
}

.contact-list a:hover {
  opacity: 0.65;
}

/* ── Bottom strip ── */
.contact-foot {
  position: absolute;
  right: var(--page-pad);
  bottom: 1.6rem;
  left: var(--page-pad);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid color-mix(in oklch, var(--surface) 22%, transparent);
  font-family: var(--mono);
  font-size: 0.62rem;
  color: color-mix(in oklch, var(--surface) 70%, transparent);
}

/* ── Narrow screens: stack the two halves ── */
@media (max-width: 900px) {
  .contact {
    padding-bottom: 9rem;
  }

  .contact-inner {
    grid-template-columns: 1fr;
    gap: 3.5rem;
  }

  .contact-title {
    margin-bottom: 2.2rem;
  }

  .contact-foot {
    flex-direction: column;
    gap: 0.4rem;
  }
}
</style>
