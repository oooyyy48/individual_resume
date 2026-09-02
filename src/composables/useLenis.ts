import { ref, onMounted, onUnmounted, watch } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null
let rafId: number | null = null
let instanceCount = 0

/**
 * Smooth-scroll to an element (e.g. '#works'). Uses Lenis when active so the
 * scroll position stays in sync; falls back to native scrolling otherwise
 * (including when the user prefers reduced motion).
 */
export function scrollToTarget(selector: string) {
  if (lenisInstance) {
    lenisInstance.scrollTo(selector)
    return
  }
  const el = document.querySelector(selector)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

export function useLenis() {
  const scrollY = ref(0)
  const velocity = ref(0)
  const isReady = ref(false)
  const reducedMotion = useReducedMotion()

  function loop(time: number) {
    if (!lenisInstance) return
    lenisInstance.raf(time)
    scrollY.value = lenisInstance.actualScroll
    velocity.value = lenisInstance.velocity
    rafId = requestAnimationFrame(loop)
  }

  function init() {
    if (lenisInstance) return

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
    })

    // Lenis drives the native scroll position, so ScrollTrigger only needs
    // to be told when it changes — no scrollerProxy required.
    lenisInstance.on('scroll', () => {
      ScrollTrigger.update()
    })

    rafId = requestAnimationFrame(loop)
    isReady.value = true
  }

  function destroy() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    lenisInstance?.destroy()
    lenisInstance = null
    isReady.value = false
  }

  function onResize() {
    lenisInstance?.resize()
    ScrollTrigger.refresh()
  }

  onMounted(() => {
    instanceCount++

    // Skip smooth scrolling entirely for users who prefer reduced motion.
    if (!reducedMotion.value) {
      init()
    }

    watch(reducedMotion, (reduced) => {
      if (reduced) {
        destroy()
      } else {
        init()
      }
      ScrollTrigger.refresh()
    })

    window.addEventListener('resize', onResize)

    onUnmounted(() => {
      instanceCount--
      window.removeEventListener('resize', onResize)

      if (instanceCount <= 0) {
        destroy()
        ScrollTrigger.getAll().forEach((st) => st.kill())
      }
    })
  })

  return {
    scrollY,
    velocity,
    isReady,
  }
}
