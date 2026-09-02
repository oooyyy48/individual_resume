<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Project } from '@/types'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

defineProps<{
  projects: Project[]
}>()

const emit = defineEmits<{
  (e: 'card-mouseenter'): void
  (e: 'card-mouseleave'): void
}>()

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

let mm: gsap.MatchMedia | null = null
const cycles: gsap.core.Timeline[] = []

onMounted(() => {
  mm = gsap.matchMedia()

  // Pinned horizontal narration: vertical scroll drives the track sideways.
  // Touch-width and reduced-motion users get the plain vertical stack.
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    const track = trackRef.value!
    const section = sectionRef.value!

    const travel = () => track.scrollWidth - window.innerWidth

    const tween = gsap.to(track, {
      x: () => -travel(),
      ease: 'none',
      scrollTrigger: {
        pin: true,
        trigger: section,
        start: 'top top',
        end: () => '+=' + travel(),
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          if (progressRef.value) {
            gsap.set(progressRef.value, { scaleX: self.progress })
          }
        },
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.set(track, { clearProps: 'x' })
    }
  })

  // Multi-image cards cycle their shots in the frame: the bottom layer stays
  // opaque, upper layers fade in one by one, then clear to reveal it again —
  // a crossfade with no dip to the frame background.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced && sectionRef.value) {
    sectionRef.value.querySelectorAll('.works-item__link').forEach((link) => {
      const imgs = gsap.utils.toArray<HTMLElement>('.works-img', link)
      if (imgs.length < 2) return
      const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
      imgs.slice(1).forEach((img) => gsap.set(img, { autoAlpha: 0 }))
      const fade = 0.9
      const hold = 2.1
      const step = hold + fade
      imgs.slice(1).forEach((img, idx) => {
        tl.to(img, { autoAlpha: 1, duration: fade }, idx * step)
      })
      tl.to(imgs.slice(1), { autoAlpha: 0, duration: fade }, (imgs.length - 1) * step)
      cycles.push(tl)
    })
  }
})

onUnmounted(() => {
  cycles.forEach((tl) => tl.kill())
  cycles.length = 0
  mm?.revert()
})
</script>

<template>
  <section id="works" ref="sectionRef" class="works">
    <div class="works-stage">
      <header class="works-head">
        <p class="works-label">03 / 精选作品</p>
        <div class="works-head-right">
          <p class="works-note">用几个真实项目，说明我如何工作。</p>
          <a href="https://github.com/oooyyy48" target="_blank" rel="noreferrer">更多项目 <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <div class="works-track-viewport">
        <div ref="trackRef" class="works-track">
          <article v-for="project in projects" :key="project.id" class="works-item">
            <div class="works-item__inner">
              <a
                class="works-item__link"
                :href="project.link || '#contact'"
                :target="project.link ? '_blank' : undefined"
                :rel="project.link ? 'noreferrer' : undefined"
                :aria-label="`查看${project.name}`"
                @mouseenter="emit('card-mouseenter')"
                @mouseleave="emit('card-mouseleave')"
              >
                <img
                  v-for="(src, i) in project.images ?? [project.image]"
                  :key="src"
                  class="works-img"
                  :src="src"
                  :alt="i === 0 ? project.name : ''"
                  loading="lazy"
                  decoding="async"
                />
                <span v-if="project.status" class="works-badge">
                  <i aria-hidden="true"></i>
                  {{ project.status }}
                </span>
              </a>
              <div class="works-meta">
                <div>
                  <h3>{{ project.name }}</h3>
                  <p>{{ project.subtitle }}</p>
                </div>
                <span class="works-year">{{ project.year }}</span>
              </div>
              <p class="works-role">{{ project.role }}</p>
              <p class="works-result">{{ project.result }}</p>
              <div class="works-tags">
                <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="works-progress" aria-hidden="true">
        <span ref="progressRef"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.works {
  position: relative;
  z-index: 20;
  background: var(--surface);
}

/* Pinned viewport for the horizontal narration */
.works-stage {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  padding: 6.5rem var(--page-pad) 2.2rem;
  overflow: hidden;
}

.works-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--muted);
}

.works-head p {
  margin: 0;
}

.works-head-right {
  display: flex;
  align-items: baseline;
  gap: 2rem;
}

.works-head-right a {
  color: var(--fg);
  transition: opacity 0.3s;
}

.works-head-right a:hover {
  opacity: 0.6;
}

/* ── Horizontal track ── */
.works-track-viewport {
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 0;
}

.works-track {
  display: flex;
  align-items: flex-start;
  gap: 7vw;
  width: max-content;
  padding-inline: var(--page-pad);
  will-change: transform;
}

.works-item {
  width: min(58vw, (100dvh - 320px) * 1.6);
  flex-shrink: 0;
}

.works-item__link {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg);
}

.works-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
}

.works-item__link:hover .works-img {
  transform: scale(1.03);
}

.works-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.1rem;
}

.works-meta h3 {
  margin: 0 0 0.3rem;
  font-family: var(--display);
  font-size: 1.8rem;
  font-weight: 400;
}

.works-meta p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--muted);
}

.works-year {
  font-family: var(--mono);
  font-size: 0.66rem;
  color: var(--muted);
  padding-top: 0.4rem;
}

.works-role {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--fg);
}

/* Under-construction (or any status) badge over the frame */
.works-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.42rem 0.78rem;
  border-radius: 999px;
  font-family: var(--mono);
  font-size: 0.62rem;
  color: var(--fg);
  background: color-mix(in oklch, var(--bg) 86%, transparent);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  pointer-events: none;
}

.works-badge i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: oklch(74% 0.14 75);
  animation: badge-pulse 1.6s ease-in-out infinite;
}

@keyframes badge-pulse {
  50% {
    opacity: 0.3;
  }
}

.works-result {
  max-width: 52ch;
  margin: 0.85rem 0 0;
  font-size: 0.78rem;
  overflow-wrap: anywhere;
  color: var(--muted);
}

.works-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.8rem;
  margin-top: 0.85rem;
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--muted);
}

.works-progress {
  height: 2px;
  background: var(--border);
  margin-top: 2rem;
}

.works-progress span {
  display: block;
  height: 100%;
  background: var(--fg);
  transform: scaleX(0);
  transform-origin: left;
}

/* ── Fallback for touch widths and reduced motion: vertical stack ── */
@media (max-width: 1023px) {
  .works-stage {
    height: auto;
    padding: 8rem var(--page-pad) 6rem;
    overflow: visible;
  }

  .works-track-viewport {
    display: block;
  }

  .works-track {
    flex-direction: column;
    width: 100%;
    gap: 3.2rem;
    transform: none !important;
  }

  .works-item {
    width: 100%;
  }

  .works-progress {
    display: none;
  }
}
</style>
