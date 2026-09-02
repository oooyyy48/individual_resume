import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export interface RevealOptions {
  /** ScrollTrigger start, e.g. 'top 75%'. Omit to play immediately (hero). */
  start?: string
  delay?: number
  stagger?: number
  duration?: number
}

const easeOut = gsap.parseEase('power4.out')

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Masked line-by-line text reveal: each measured line slides up out of an
 * overflow-hidden mask. After the animation completes the split is reverted
 * so the text reflows naturally on resizes. Returns a cleanup function.
 */
export function revealLines(el: HTMLElement, opts: RevealOptions = {}): () => void {
  if (prefersReducedMotion()) return () => {}

  let split: SplitText | null = null
  let tween: gsap.core.Tween | null = null
  let cancelled = false

  // Wait for fonts so line breaks are measured correctly
  document.fonts.ready.then(() => {
    if (cancelled) return

    split = new SplitText(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'reveal-line',
    })

    tween = gsap.from(split.lines, {
      yPercent: 115,
      duration: opts.duration ?? 1.15,
      ease: easeOut,
      stagger: opts.stagger ?? 0.09,
      delay: opts.delay ?? 0,
      scrollTrigger: opts.start
        ? { trigger: el, start: opts.start, once: true }
        : undefined,
      onComplete() {
        // Restore un-split text so later resizes can't clip wrapped lines
        split?.revert()
        split = null
      },
    })
  })

  return () => {
    cancelled = true
    tween?.scrollTrigger?.kill()
    tween?.kill()
    split?.revert()
  }
}

export interface FadeUpOptions extends RevealOptions {
  y?: number
}

/**
 * Simple rise-and-fade for supporting elements (labels, buttons, ornaments).
 * Returns a cleanup function.
 */
export function fadeUp(
  targets: HTMLElement | Element | ArrayLike<Element>,
  opts: FadeUpOptions = {},
): () => void {
  if (prefersReducedMotion()) return () => {}

  const els = Array.from(targets as ArrayLike<Element>)
  if (els.length === 0) return () => {}

  const tween = gsap.from(els, {
    autoAlpha: 0,
    y: opts.y ?? 24,
    duration: opts.duration ?? 1,
    ease: easeOut,
    stagger: opts.stagger ?? 0.08,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.start
      ? { trigger: els[0] as Element, start: opts.start, once: true }
      : undefined,
  })

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    gsap.set(els, { clearProps: 'opacity,visibility,transform' })
  }
}
