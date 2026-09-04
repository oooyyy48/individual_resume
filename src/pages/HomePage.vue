<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { projects } from '@/data/projects'
import { profile } from '@/data/profile'
import { lifeSections } from '@/data/life'
import { useLenis } from '@/composables/useLenis'
import TopNav from '@/components/TopNav.vue'
import HeroSection from '@/components/HeroSection.vue'
import IntroSection from '@/components/IntroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import StickyGallery from '@/components/StickyGallery.vue'
import LifeSection from '@/components/LifeSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import ProjectCursor from '@/components/ProjectCursor.vue'

useLenis()
const cursorRef = ref<InstanceType<typeof ProjectCursor> | null>(null)
const isFinePointer = ref(false)

function onCardMouseEnter() { cursorRef.value?.show() }
function onCardMouseLeave() { cursorRef.value?.hide() }
function onMouseMove(event: MouseEvent) { cursorRef.value?.onMouseMove(event) }

onMounted(() => {
  isFinePointer.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (isFinePointer.value) window.addEventListener('mousemove', onMouseMove, { passive: true })
})

onUnmounted(() => {
  if (isFinePointer.value) window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <a class="skip-link" href="#content">跳到主要内容</a>
  <TopNav :profile="profile" />
  <main id="content">
    <HeroSection :profile="profile" />
    <IntroSection :profile="profile" />
    <AboutSection :profile="profile" />
    <StickyGallery :projects="projects.slice(0, 4)" @card-mouseenter="onCardMouseEnter" @card-mouseleave="onCardMouseLeave" />
    <LifeSection :sections="lifeSections" />
    <ContactSection :profile="profile" />
  </main>
  <ProjectCursor v-if="isFinePointer" ref="cursorRef" />
</template>
