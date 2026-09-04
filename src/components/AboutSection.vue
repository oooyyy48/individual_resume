<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Profile } from '@/types'
import { revealLines, fadeUp } from '@/utils/textReveal'

const { profile } = defineProps<{ profile: Profile }>()

const labelRef = ref<HTMLElement | null>(null)
const copyRef = ref<HTMLElement | null>(null)
const experienceRef = ref<HTMLElement | null>(null)
const servicesRef = ref<HTMLElement | null>(null)

let cleanups: Array<() => void> = []

onMounted(() => {
  if (labelRef.value) {
    cleanups.push(fadeUp(labelRef.value, { start: 'top 82%', y: 12 }))
  }
  if (copyRef.value) {
    cleanups.push(revealLines(copyRef.value, { start: 'top 72%', stagger: 0.12, duration: 1.25 }))
  }
  if (servicesRef.value) {
    cleanups.push(
      fadeUp(servicesRef.value.children, { start: 'top 82%', stagger: 0.14, y: 28 }),
    )
  }
  if (experienceRef.value) {
    cleanups.push(fadeUp(experienceRef.value.children, { start: 'top 84%', stagger: 0.12, y: 20 }))
  }
})

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
  cleanups = []
})
</script>

<template>
  <section id="experience" class="about">
    <p ref="labelRef" class="about-label">02 / 经历与能力</p>
    <img
      class="about-ornament about-ornament--right"
      src="/right.avif"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />
    <div class="about-main">
      <p ref="copyRef" class="about-copy">
        我相信持续学习与动手实践，会让每一个模糊的问题逐渐变得<em>清晰</em>。
      </p>

      <div ref="experienceRef" class="experience">
        <article v-for="item in profile.experiences" :key="`${item.period}-${item.organization}`" class="experience-item">
          <span class="experience-period">{{ item.period }}</span>
          <div>
            <h3>{{ item.organization }}</h3>
            <p class="experience-role">{{ item.role }}</p>
            <p>{{ item.description }}</p>
          </div>
        </article>
      </div>

      <div class="skills-heading">
        <span>工作方式</span>
        <span>从想法到可运行的体验</span>
      </div>

      <div ref="servicesRef" class="services">
        <article v-for="skill in profile.skills" :key="skill.index" class="service">
          <span>{{ skill.index }}</span>
          <h3>{{ skill.title }}</h3>
          <p>{{ skill.description }}</p>
          <p class="service-output">{{ skill.outputs }}</p>
          <div class="service-tools">
            <span v-for="tool in skill.tools" :key="tool">{{ tool }}</span>
          </div>
      </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  position: relative;
  z-index: 20;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  padding: 11rem var(--page-pad);
  background: var(--surface);
  border-top: 1px solid var(--border);
  overflow: hidden;
}

.about-ornament {
  position: absolute;
  z-index: 0;
  display: block;
  width: clamp(7rem, 12vw, 12rem);
  height: auto;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

.about-ornament--right {
  top: 10rem;
  right: clamp(0.8rem, 2.4vw, 3rem);
  opacity: 0.62;
  transform: rotate(7deg) scale(0.94);
  transform-origin: center;
}

.about-label {
  position: sticky;
  top: 8rem;
  align-self: start;
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--muted);
}

.about-main {
  grid-column: 2;
  min-width: 0;
  position: relative;
  z-index: 1;
  padding-right: clamp(3rem, 9vw, 8rem);
}

.about-copy {
  max-width: 18ch;
  margin: 0;
  font-family: var(--display);
  font-size: 3.55rem;
  font-weight: 400;
  line-height: 1.17;
}

.about-copy em {
  position: relative;
  font-style: normal;
}

.about-copy em::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0.12em;
  left: 0;
  height: 2px;
  background: var(--fg);
  transform: scaleX(0.2);
  transform-origin: left;
  transition: transform 0.5s var(--ease);
}

.about-copy em:hover::after {
  transform: scaleX(1);
}

.experience {
  display: grid;
  gap: 0;
  margin-top: 7rem;
}

.experience-item {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 2rem;
  padding: 1.2rem 0 1.5rem;
  border-top: 1px solid var(--border);
}

.experience-period {
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--muted);
}

.experience-item h3 {
  margin: 0 0 0.45rem;
  font-family: var(--display);
  font-size: 1.35rem;
  font-weight: 400;
}

.experience-item p {
  max-width: 48ch;
  margin: 0;
  font-size: 0.8rem;
  color: var(--muted);
}

.experience-item .experience-role {
  margin-bottom: 0.65rem;
  color: var(--fg);
}

.skills-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 6rem;
  padding: 1rem 0;
  border-top: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--muted);
}

.services {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 5rem;
}

.service {
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.service span {
  font-family: var(--mono);
  font-size: 0.62rem;
  color: var(--muted);
}

.service h3 {
  margin: 1.5rem 0 0.7rem;
  font-family: var(--display);
  font-size: 1.35rem;
  font-weight: 400;
}

.service p {
  margin: 0;
  font-size: 0.78rem;
  color: var(--muted);
}

.service-output {
  margin-top: 1rem !important;
  color: var(--fg) !important;
}

.service-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.75rem;
  margin-top: 1.25rem;
}

.service-tools span {
  font-size: 0.6rem;
}

@media (max-width: 720px) {
  .about {
    grid-template-columns: 1fr;
    padding-top: 7rem;
    padding-bottom: 7rem;
  }

  .about-label { position: static; }

  .about-main {
    grid-column: 1;
    padding-right: 0;
  }

  .about-ornament--right {
    top: 7.5rem;
    right: -4.8rem;
    width: 6.5rem;
    opacity: 0.3;
    transform: rotate(7deg) scale(0.82);
  }

  .about-copy { font-size: 2.55rem; }

  .services {
    grid-template-columns: 1fr;
    margin-top: 3rem;
  }

  .experience { margin-top: 4rem; }
  .experience-item { grid-template-columns: 1fr; gap: 0.6rem; }
  .skills-heading { margin-top: 4rem; }
}
</style>
