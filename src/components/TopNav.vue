<script setup lang="ts">
import { ref } from 'vue'
import type { Profile } from '@/types'
import { scrollToTarget } from '@/composables/useLenis'

const { profile } = defineProps<{ profile: Profile }>()

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function go(event: MouseEvent, hash: string) {
  event.preventDefault()
  closeMenu()
  scrollToTarget(hash)
}
</script>

<template>
  <header class="topnav" :class="{ 'menu-open': menuOpen }">
    <a class="brand" href="#hero" aria-label="返回首页" @click="go($event, '#hero')">
      <span class="brand-mark" aria-hidden="true"></span>
      <span>{{ profile.name }} / 个人介绍</span>
    </a>

    <nav
      id="primary-navigation"
      class="nav-links"
      :class="{ 'is-visible': menuOpen }"
      aria-label="主要导航"
    >
      <a href="#about" @click="go($event, '#about')">关于</a>
      <a href="#experience" @click="go($event, '#experience')">经历</a>
      <a href="#works" @click="go($event, '#works')">作品</a>
      <a href="#life" @click="go($event, '#life')">生活</a>
      <a href="#contact" @click="go($event, '#contact')">联系</a>
    </nav>

    <button
      class="menu-toggle"
      type="button"
      :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
      :aria-expanded="menuOpen"
      aria-controls="primary-navigation"
      @click="toggleMenu"
    >
      <span></span>
    </button>
  </header>
</template>

<style scoped>
.topnav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  padding: 1rem var(--page-pad);
  mix-blend-mode: difference;
  color: var(--surface);
  pointer-events: none;
}

.topnav a,
.topnav button {
  pointer-events: auto;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--mono);
  font-size: 0.76rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.brand-mark {
  width: 10px;
  height: 10px;
  border: 1px solid currentColor;
  border-radius: 50%;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.8rem;
  font-size: 0.82rem;
}

.nav-links a {
  position: relative;
  padding: 0.7rem 0;
}

.nav-links a::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0.45rem;
  left: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.45s var(--ease);
}

.nav-links a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  place-items: center;
  background: transparent;
  color: inherit;
}

.menu-toggle span,
.menu-toggle::before {
  content: "";
  position: absolute;
  display: block;
  width: 22px;
  height: 1px;
  background: currentColor;
  transition: transform 0.35s var(--ease);
}

.menu-toggle span {
  transform: translateY(4px);
}

.menu-toggle::before {
  transform: translateY(-4px);
}

@media (max-width: 720px) {
  .topnav {
    min-height: 64px;
  }

  .menu-toggle {
    display: grid;
  }

  .nav-links {
    position: fixed;
    inset: 0;
    z-index: 1;
    display: grid;
    place-content: center;
    gap: 1.5rem;
    color: var(--fg);
    background: var(--bg);
    font-family: var(--display);
    font-size: 2.5rem;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.35s;
  }

  .nav-links.is-visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .brand,
  .menu-toggle {
    position: relative;
    z-index: 2;
  }

  .topnav.menu-open {
    color: var(--fg);
    mix-blend-mode: normal;
  }

  .topnav.menu-open .menu-toggle::before {
    transform: translateY(0) rotate(45deg);
  }

  .topnav.menu-open .menu-toggle span {
    transform: translateY(0) rotate(-45deg);
  }
}
</style>
