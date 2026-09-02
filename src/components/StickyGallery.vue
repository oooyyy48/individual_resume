<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { Project } from '@/types'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  projects: Project[]
}>()

const emit = defineEmits<{
  (e: 'card-mouseenter'): void
  (e: 'card-mouseleave'): void
}>()

const sectionRef = ref<HTMLElement | null>(null)
const wrapperRefs = ref<(HTMLElement | null)[]>([])
const reducedMotion = useReducedMotion()

let sts: ScrollTrigger[] = []
let cols = 1

function setWrapperRef(index: number) {
  return (el: Element | ComponentPublicInstance | null) => {
    if (!wrapperRefs.value) wrapperRefs.value = []
    wrapperRefs.value[index] = el as HTMLElement | null
  }
}

// Current grid column count (3 → desktop, 2 → tablet/mobile)
function measureCols() {
  const grid = sectionRef.value?.querySelector('.works-grid')
  if (grid) {
    cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length
  }
}

// Slide direction per card: outer columns drift horizontally, middle stays put.
function dirFor(index: number) {
  const col = index % cols
  return col === 0 ? -1 : col === cols - 1 ? 1 : 0
}

function createTriggers() {
  measureCols()

  const easeOut = gsap.parseEase('power2.out')

  // Each outer-column card slides in from its side and settles when its center
  // reaches the viewport center, then stays put. Outer columns settle slightly
  // later than the middle one. Scrolling up reverses the motion.
  wrapperRefs.value.forEach((wrapper, i) => {
    if (!wrapper) return

    const dir = dirFor(i)
    if (dir === 0) return // middle column scrolls naturally, no slide

    sts.push(
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top bottom',
        // Outer columns finish arriving a bit after the middle column
        end: 'center center+=12%',
        onUpdate(self) {
          const p = Math.min(1, Math.max(0, self.progress))
          gsap.set(wrapper, { xPercent: dir * 60 * (1 - easeOut(p)) })
        },
      }),
    )
  })
}

function killTriggers() {
  sts.forEach((st) => st.kill())
  sts = []
  // Reset any offsets so cards sit flush when motion is reduced
  wrapperRefs.value.forEach((wrapper) => {
    if (!wrapper) return
    gsap.set(wrapper, { clearProps: 'transform' })
  })
}

onMounted(() => {
  if (!sectionRef.value) return

  // No scroll-driven motion for users who prefer reduced motion
  if (!reducedMotion.value) {
    createTriggers()
  }

  // Column count can change at breakpoints → recompute before each refresh
  ScrollTrigger.addEventListener('refreshInit', measureCols)

  watch(reducedMotion, (reduced) => {
    if (reduced) {
      killTriggers()
    } else {
      createTriggers()
      ScrollTrigger.refresh()
    }
  })
})

onUnmounted(() => {
  ScrollTrigger.removeEventListener('refreshInit', measureCols)
  killTriggers()
})
</script>

<template>
  <section id="works" ref="sectionRef" class="works">
    <div class="works-head">
      <p class="works-label">03 / 精选作品</p>
      <p class="works-note">用几个真实项目，说明我如何工作。</p>
    </div>
    <div class="works-grid">
      <article
        v-for="(project, i) in projects"
        :key="project.id"
        :ref="setWrapperRef(i)"
        class="works-item"
      >
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
              class="works-img"
              :src="project.image"
              :alt="project.name"
              loading="lazy"
              decoding="async"
            />
          </a>
          <div class="works-meta">
            <div>
              <h3>{{ project.name }}</h3>
              <p>{{ project.subtitle }}</p>
            </div>
            <span>{{ project.year }}</span>
          </div>
          <p class="works-result">{{ project.result }}</p>
          <div class="works-tags">
            <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.works {
  position: relative;
  z-index: 20;
  padding: 8rem var(--page-pad) 12rem;
  background: var(--surface);
}

.works-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 2rem;
  margin-bottom: 3rem;
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--muted);
}

.works-head p { margin: 0; }

/* 3-column grid */
.works-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5.2rem 2.6rem;
}

/* Overflow clip wrapper */
.works-item {
  position: relative;
}

/* Inner element */
.works-item__inner {
  width: 100%;
}

.works-item__link {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5.3;
  overflow: hidden;
  background: var(--bg);
}

.works-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
}

.works-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.works-meta h3 {
  margin: 0 0 0.3rem;
  font-family: var(--display);
  font-size: 1.45rem;
  font-weight: 400;
}

.works-meta p,
.works-result {
  margin: 0;
  font-size: 0.75rem;
  color: var(--muted);
}

.works-meta > span {
  font-family: var(--mono);
  font-size: 0.66rem;
  color: var(--muted);
}

.works-result { margin-top: 0.85rem; color: var(--fg); }

.works-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.8rem;
  margin-top: 0.85rem;
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--muted);
}

.works-item__link:hover .works-img {
  transform: scale(1.04);
}

@media (max-width: 1024px) {
  .works-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3rem 1.5rem;
  }
}

@media (max-width: 720px) {
  .works {
    padding-top: 4rem;
    padding-bottom: 6rem;
  }

  .works-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem 1rem;
  }

  .works-item__link { aspect-ratio: 3 / 4; }
  .works-head { display: block; }
  .works-note { margin-top: 0.7rem !important; }
}
</style>
