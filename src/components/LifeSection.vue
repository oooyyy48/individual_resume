<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { LifeSection as LifeSectionData } from '@/types'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{ sections: LifeSectionData[] }>()
const router = useRouter()
const activeId = ref<LifeSectionData['id'] | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
let entranceTriggers: ScrollTrigger[] = []

function toggle(section: LifeSectionData) {
  activeId.value = activeId.value === section.id ? null : section.id
  if (activeId.value) {
    nextTick(() => {
      const detail = sectionRef.value?.querySelector(`[data-detail="${section.id}"]`) as HTMLElement | null
      const image = detail?.querySelector('.life-detail-image') as HTMLElement | null
      if (detail) gsap.fromTo(detail, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.65, ease: 'power3.out' })
      if (image) gsap.fromTo(image, { y: -36, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.8, delay: 0.08, ease: 'power3.out' })
    })
  }
}

function goAlbum() { router.push('/album') }

onMounted(() => {
  if (!sectionRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  sectionRef.value.querySelectorAll<HTMLElement>('.life-item').forEach((item, index) => {
    const direction = props.sections[index]?.direction === 'right' ? 80 : -80
    entranceTriggers.push(ScrollTrigger.create({
      trigger: item,
      start: 'top 86%',
      once: true,
      onEnter: () => gsap.fromTo(item, { x: direction, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' }),
    }))
  })
})

onUnmounted(() => entranceTriggers.forEach((trigger) => trigger.kill()))
</script>

<template>
  <section id="life" ref="sectionRef" class="life">
    <div class="life-head">
      <p>05 / 我的生活</p>
      <p>从哪里来，也在向哪里去。</p>
    </div>

    <div class="life-list">
      <article v-for="section in sections" :key="section.id" class="life-item" :class="{ 'is-open': activeId === section.id }">
        <button class="life-summary" type="button" :aria-expanded="activeId === section.id" :aria-controls="`life-detail-${section.id}`" @click="toggle(section)">
          <span class="life-index">{{ section.index }}</span>
          <span class="life-summary-copy">
            <span class="life-title">{{ section.title }}</span>
            <span class="life-summary-text">{{ section.summary }}</span>
          </span>
          <span v-if="section.image" class="life-image-wrap" :class="{ 'is-hidden': activeId === section.id }">
            <img :src="section.image" :alt="`${section.title}简介图片`" loading="lazy" referrerpolicy="no-referrer" />
          </span>
          <span class="life-toggle" aria-hidden="true">{{ activeId === section.id ? '−' : '+' }}</span>
        </button>

        <div v-if="activeId === section.id" :id="`life-detail-${section.id}`" :data-detail="section.id" class="life-detail">
          <div v-if="section.image" class="life-detail-media">
            <img class="life-detail-image" :src="section.image" :alt="`${section.title}详情图片`" referrerpolicy="no-referrer" />
          </div>
          <div class="life-detail-copy">
            <p>{{ section.detail }}</p>
            <ul v-if="section.bullets" class="life-bullets">
              <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
            <div class="life-detail-actions">
              <a v-if="section.link" :href="section.link" target="_blank" rel="noreferrer">了解更多 <span aria-hidden="true">↗</span></a>
              <button v-if="section.id === 'album'" type="button" @click="goAlbum">进入 3D 相册 <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.life { position: relative; z-index: 20; padding: 10rem var(--page-pad) 12rem; background: var(--bg); }
.life-head { display: flex; justify-content: space-between; gap: 2rem; padding-top: 1rem; border-top: 1px solid var(--border); font-family: var(--mono); font-size: .68rem; color: var(--muted); }
.life-head p { margin: 0; }
.life-list { margin-top: 5rem; }
.life-item { border-top: 1px solid var(--border); opacity: 0; }
.life-summary { display: grid; grid-template-columns: 4rem 1fr minmax(10rem, 18rem) 2rem; gap: 2rem; align-items: center; width: 100%; padding: 1.5rem 0; color: var(--fg); background: transparent; text-align: left; }
.life-index, .life-toggle { font-family: var(--mono); font-size: .68rem; color: var(--muted); }
.life-summary-copy { display: grid; gap: .45rem; min-width: 0; }
.life-title { font-family: var(--display); font-size: 2rem; font-weight: 400; }
.life-summary-text { max-width: 42ch; font-size: .8rem; color: var(--muted); }
.life-image-wrap { display: block; aspect-ratio: 16/9; overflow: hidden; transition: opacity .4s var(--ease), transform .65s var(--ease); }
.life-image-wrap.is-hidden { opacity: 0; transform: translateY(1.5rem) scale(.96); }
.life-image-wrap img, .life-detail-image { display: block; width: 100%; height: 100%; object-fit: cover; }
.life-toggle { font-size: 1.2rem; color: var(--fg); text-align: right; }
.life-detail { display: grid; grid-template-columns: minmax(14rem, 28rem) 1fr; gap: 3rem; overflow: hidden; padding: 0 0 2.5rem 6rem; }
.life-detail-media { aspect-ratio: 16/10; overflow: hidden; background: var(--surface); }
.life-detail-copy { max-width: 48ch; padding-top: .3rem; }
.life-detail-copy p { margin: 0; font-size: .9rem; line-height: 1.8; }
.life-bullets { display: grid; gap: .55rem; margin: 1.5rem 0 0; padding-left: 1.1rem; font-size: .8rem; color: var(--muted); }
.life-detail-actions { display: flex; flex-wrap: wrap; gap: 1.2rem; margin-top: 1.8rem; font-family: var(--mono); font-size: .68rem; }
.life-detail-actions a, .life-detail-actions button { padding: .7rem 0; border-bottom: 1px solid var(--fg); background: transparent; color: var(--fg); }
@media (prefers-reduced-motion: reduce) { .life-item { opacity: 1; } .life-image-wrap { transition: none; } }
@media (max-width: 720px) {
  .life { padding-top: 7rem; padding-bottom: 8rem; }
  .life-head { display: block; }
  .life-head p + p { margin-top: .7rem; }
  .life-list { margin-top: 3.5rem; }
  .life-summary { grid-template-columns: 2rem 1fr 1.5rem; gap: 1rem; }
  .life-image-wrap { grid-column: 2; grid-row: 2; width: min(100%, 18rem); }
  .life-toggle { grid-column: 3; grid-row: 1; }
  .life-title { font-size: 1.7rem; }
  .life-detail { grid-template-columns: 1fr; gap: 1.5rem; padding: 0 0 2rem 3rem; }
}
</style>
