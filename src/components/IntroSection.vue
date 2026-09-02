<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Profile } from '@/types'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { revealLines, fadeUp } from '@/utils/textReveal'

const { profile } = defineProps<{ profile: Profile }>()

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const copyRef = ref<HTMLElement | null>(null)
const noteRef = ref<HTMLElement | null>(null)

let st: ScrollTrigger | null = null
let cleanups: Array<() => void> = []

onMounted(() => {
  if (!sectionRef.value) return

  st = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate(self) {
      sectionRef.value!.style.setProperty('--tear-progress', self.progress.toString())
    },
  })

  if (copyRef.value) {
    cleanups.push(revealLines(copyRef.value, { start: 'top 72%', stagger: 0.12, duration: 1.25 }))
  }
  if (noteRef.value) {
    cleanups.push(fadeUp(noteRef.value, { start: 'top 78%', delay: 0.4, y: 12 }))
  }
})

onUnmounted(() => {
  st?.kill()
  cleanups.forEach((fn) => fn())
  cleanups = []
})
</script>

<template>
  <!-- This section provides the scroll distance for the cover to slide up -->
  <section id="about" ref="sectionRef" class="intro-scroll">
    <!-- Fixed-height spacer → the actual scrolling room for the cover to reveal -->
    <div class="intro-cover">
      <div class="intro-tear" aria-hidden="true"></div>

      <div class="intro-body">
        <p class="intro-label">01 / 关于我</p>
        <p ref="copyRef" class="intro-copy">
          {{ profile.bio }}
        </p>
        <span ref="noteRef" class="intro-note">继续向下了解我的经历与能力</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* This section creates the scroll distance so the cover can push up and reveal hero */
.intro-scroll {
  position: relative;
  z-index: 10;
  height: 120vh;
  margin-top: 100vh;
  margin-top: 100dvh;
  pointer-events: none;
}

/* The white cover — sticky so it always fills the viewport as we scroll past it */
.intro-cover {
  position: sticky;
  top: 0;
  display: grid;
  place-items: center;
  height: 100vh;
  height: 100dvh;
  padding: 8rem var(--page-pad) 4rem;
  text-align: center;
  background: var(--surface);
  overflow: visible;
  pointer-events: auto;
}

/* ── Wave edge at top of cover ── */
.intro-tear {
  position: absolute;
  top: 1px; /* overlap the cover by a hair to avoid a seam */
  left: 0;
  width: 100%;
  height: 160px;
  transform: translateY(-100%);
  pointer-events: none;
  background: url('/whiteWaves.webp') no-repeat center top;
  background-size: auto 200%;
}

.intro-body {
  position: relative;
  z-index: 1;
}

.intro-label {
  margin: 0 0 2rem;
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--muted);
}

.intro-copy {
  max-width: 22ch;
  margin: 0 auto;
  font-family: var(--display);
  font-size: 3.8rem;
  font-weight: 400;
  line-height: 1.16;
}

.intro-note {
  display: block;
  margin-top: 2.5rem;
  font-family: var(--mono);
  font-size: 0.66rem;
  color: var(--muted);
}

@media (max-width: 720px) {
  .intro-scroll {
    height: 90vh;
  }

  .intro-cover {
    padding: 5rem var(--page-pad) 3rem;
  }

  .intro-tear {
    height: 100px;
  }

  .intro-copy {
    font-size: 2.5rem;
  }
}
</style>
