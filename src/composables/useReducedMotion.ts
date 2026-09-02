import { ref, onMounted, onUnmounted } from 'vue'

let mediaQueryList: MediaQueryList | null = null
let listeners = 0

const reducedMotion = ref(false)

export function useReducedMotion() {
  function handleChange(event: MediaQueryListEvent) {
    reducedMotion.value = event.matches
  }

  onMounted(() => {
    listeners++
    if (!mediaQueryList) {
      mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)')
      reducedMotion.value = mediaQueryList.matches
      mediaQueryList.addEventListener('change', handleChange)
    }
  })

  onUnmounted(() => {
    listeners--
    if (listeners <= 0 && mediaQueryList) {
      mediaQueryList.removeEventListener('change', handleChange)
      mediaQueryList = null
    }
  })

  return reducedMotion
}
