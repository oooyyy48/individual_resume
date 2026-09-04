<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import * as THREE from 'three'
import { albumPhotos } from '@/data/life'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const selectedPhoto = ref<(typeof albumPhotos)[number] | null>(null)
const errorRef = ref('')

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let helixGroup: THREE.Group | null = null
let frame = 0
let raycaster: THREE.Raycaster | null = null
let pointer = new THREE.Vector2()
let dragging = false
let moved = false
let lastX = 0
let spiralTargetY = 0
let spiralCurrentY = 0
let dragRotationTarget = 0
let dragRotationCurrent = 0
let autoRotation = 0
let reducedMotion = false
const pickTargets: THREE.Object3D[] = []
const clock = new THREE.Clock()
let lastLookX = 0
let lastLookCameraY = 0
let lastLookTargetY = 0
let pageVisible = true

const cylinderRadius = 3.15
const verticalStep = 1.22
const angleStep = Math.PI * 0.64

function resize() {
  if (!renderer || !camera || !canvasRef.value) return
  const host = canvasRef.value.parentElement
  if (!host) return
  const width = Math.max(1, host.clientWidth)
  const height = Math.max(1, host.clientHeight)
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

function clampSpiral(value: number) {
  return THREE.MathUtils.clamp(value, -2.7, 2.7)
}

function updatePointer(event: PointerEvent) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
}

function onPointerDown(event: PointerEvent) {
  dragging = true
  moved = false
  lastX = event.clientX
  updatePointer(event)
  canvasRef.value?.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  updatePointer(event)
  if (!dragging) return
  const dx = event.clientX - lastX
  if (Math.abs(dx) > 2) moved = true
  dragRotationTarget -= dx * 0.006
  lastX = event.clientX
}

function onPointerUp(event: PointerEvent) {
  dragging = false
  if (!moved) pickPhoto()
  if (canvasRef.value?.hasPointerCapture(event.pointerId)) canvasRef.value.releasePointerCapture(event.pointerId)
}

function onWheel(event: WheelEvent) {
  spiralTargetY = clampSpiral(spiralTargetY - event.deltaY * 0.004)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') spiralTargetY = clampSpiral(spiralTargetY - 1.1)
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') spiralTargetY = clampSpiral(spiralTargetY + 1.1)
  if (event.key === 'Escape') selectedPhoto.value = null
}

function pickPhoto() {
  if (!raycaster || !camera) return
  raycaster.setFromCamera(pointer, camera)
  const hit = raycaster.intersectObjects(pickTargets, false)[0]
  if (!hit) return
  const index = hit.object.userData.photoIndex
  if (typeof index === 'number') selectedPhoto.value = albumPhotos[index] ?? null
}

function optimizedTextureUrl(source: string) {
  if (!source.includes('images.pexels.com')) return source
  const separator = source.includes('?') ? '&' : '?'
  return `${source}${separator}auto=compress&cs=tinysrgb&w=1200&q=82`
}

function prepareTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  texture.anisotropy = 1
  texture.needsUpdate = true
  return texture
}

function createPlaceholderTexture(photo: (typeof albumPhotos)[number]) {
  const canvas = document.createElement('canvas')
  canvas.width = 900
  canvas.height = 620
  const context = canvas.getContext('2d')
  if (!context) return null
  context.fillStyle = '#d8cbbb'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#594c43'
  context.font = '34px sans-serif'
  context.fillText('IMAGE UNAVAILABLE', 70, 250)
  context.font = '26px sans-serif'
  context.fillText(photo.caption, 70, 310)
  return new THREE.CanvasTexture(canvas)
}

function addPhoto(photo: (typeof albumPhotos)[number], index: number, texture: THREE.Texture, ratio: number) {
  if (!helixGroup) return
  const height = 2.15
  const width = THREE.MathUtils.clamp(height * ratio, 1.7, 3.55)
  const theta = index * angleStep - Math.PI / 2
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  )
  mesh.position.set(Math.cos(theta) * cylinderRadius, (index - (albumPhotos.length - 1) / 2) * verticalStep, Math.sin(theta) * cylinderRadius)
  mesh.rotation.y = Math.PI / 2 - theta
  mesh.rotation.z = Math.sin(index * 1.7) * 0.018
  mesh.userData.photo = photo
  mesh.userData.photoIndex = index
  helixGroup.add(mesh)
  pickTargets.push(mesh)
}

function animate() {
  if (!pageVisible || !renderer || !scene || !camera || !helixGroup) return
  const delta = Math.min(clock.getDelta(), 0.05)
  spiralCurrentY += (spiralTargetY - spiralCurrentY) * 0.075
  dragRotationCurrent += (dragRotationTarget - dragRotationCurrent) * 0.09
  if (!reducedMotion) autoRotation += delta * 0.045
  helixGroup.position.y = spiralCurrentY
  helixGroup.rotation.y = autoRotation + dragRotationCurrent

  const targetCameraX = reducedMotion ? 0 : pointer.x * 0.62
  const targetCameraY = reducedMotion ? 0.1 : 0.1 + (-pointer.y * 0.24)
  camera.position.x += (targetCameraX - camera.position.x) * 0.045
  camera.position.y += (targetCameraY - camera.position.y) * 0.045
  const lookY = spiralCurrentY * 0.16
  if (Math.abs(camera.position.x - lastLookX) > 0.0005 || Math.abs(camera.position.y - lastLookCameraY) > 0.0005 || Math.abs(lookY - lastLookTargetY) > 0.0005) {
    camera.lookAt(0, lookY, 0)
    lastLookX = camera.position.x
    lastLookCameraY = camera.position.y
    lastLookTargetY = lookY
  }

  renderer.render(scene, camera)
  frame = requestAnimationFrame(animate)
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  pageVisible = !document.hidden
  const canvas = canvasRef.value
  if (!canvas) return
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    const pixelRatioCap = window.innerWidth < 720 ? 1.25 : 1.5
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0xf8f1e7, 8, 21)
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40)
    camera.position.set(0, 0.15, 9.6)
    raycaster = new THREE.Raycaster()

    helixGroup = new THREE.Group()
    scene.add(helixGroup)
    scene.add(new THREE.AmbientLight(0xffffff, 2.4))
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6)
    keyLight.position.set(3, 5, 8)
    scene.add(keyLight)

    const loader = new THREE.TextureLoader()
    albumPhotos.forEach((photo, index) => {
      loader.load(
        optimizedTextureUrl(photo.src),
        (texture) => {
          const prepared = prepareTexture(texture)
          addPhoto(photo, index, prepared, texture.image.width / texture.image.height || 1.5)
        },
        undefined,
        () => {
          const placeholder = createPlaceholderTexture(photo)
          if (placeholder) addPhoto(photo, index, prepareTexture(placeholder), 900 / 620)
          errorRef.value = '部分图片暂时无法加载，已显示占位内容。'
        }
      )
    })

    resize()
    animate()
    window.addEventListener('resize', resize)
    window.addEventListener('keydown', onKeydown)
    document.addEventListener('visibilitychange', onVisibilityChange)
  } catch {
    errorRef.value = '当前浏览器不支持 3D 画廊，请使用支持 WebGL 的浏览器。'
  }
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', resize)
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  helixGroup?.traverse((object) => {
    const mesh = object as THREE.Mesh
    mesh.geometry?.dispose()
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((material) => {
      if (!material) return
      const map = (material as THREE.MeshBasicMaterial).map
      map?.dispose()
      material?.dispose()
    })
  })
  renderer?.dispose()
})

function onVisibilityChange() {
  pageVisible = !document.hidden
  if (pageVisible && renderer) frame = requestAnimationFrame(animate)
  if (!pageVisible) cancelAnimationFrame(frame)
}
</script>

<template>
  <main class="album-page">
    <header class="album-nav">
      <RouterLink class="album-back" to="/">← 返回主页</RouterLink>
      <span class="album-title">05 / 我的相册</span>
      <span class="album-count">{{ String(albumPhotos.length).padStart(2, '0') }} 张记录</span>
    </header>
    <section class="album-stage" aria-label="螺旋 3D 相册墙">
      <div class="album-scene-wrap">
        <canvas
          ref="canvasRef"
          aria-label="可拖拽旋转的螺旋 3D 相册墙，滚轮可上下浏览"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel.prevent="onWheel"
        ></canvas>
        <div class="album-scene-note">拖拽旋转 · 滚轮上下浏览 <span aria-hidden="true">↕</span></div>
        <p v-if="errorRef" class="album-error" role="status">{{ errorRef }}</p>
      </div>
    </section>
    <Transition name="photo-focus">
      <div v-if="selectedPhoto" class="photo-focus" role="dialog" aria-modal="true" @click.self="selectedPhoto = null">
        <button class="photo-close" type="button" aria-label="关闭照片" @click="selectedPhoto = null">×</button>
        <img :src="selectedPhoto.src" :alt="selectedPhoto.alt" referrerpolicy="no-referrer" />
        <p>{{ selectedPhoto.caption }}</p>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.album-page { min-height: 100dvh; color: var(--fg); background: var(--bg); overflow: hidden; }
.album-nav { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; padding: 1.4rem var(--page-pad); font-family: var(--mono); font-size: .68rem; }
.album-title { text-align: center; color: var(--muted); letter-spacing: .08em; }
.album-count { text-align: right; color: var(--muted); }
.album-back { transition: opacity .3s; }
.album-back:hover, .album-back:focus-visible { opacity: .55; }
.album-stage { position: relative; min-height: calc(100dvh - 4.25rem); padding: 0 var(--page-pad) 2rem; }
.album-scene-wrap { position: relative; min-height: 38rem; height: calc(100dvh - 6.3rem); overflow: hidden; background: radial-gradient(circle at 50% 42%, color-mix(in oklch, var(--surface) 86%, transparent), color-mix(in oklch, var(--bg) 58%, transparent) 68%); }
canvas { position: absolute; inset: 0; width: 100%; height: 100%; cursor: grab; touch-action: none; }
canvas:active { cursor: grabbing; }
.album-scene-note { position: absolute; right: 1.5rem; bottom: 1.5rem; font-family: var(--mono); font-size: .62rem; color: var(--muted); pointer-events: none; }
.album-scene-note span { margin-left: .45rem; font-size: .9rem; }
.album-error { position: absolute; left: 1.5rem; bottom: 1.5rem; margin: 0; color: var(--accent); font-family: var(--mono); font-size: .62rem; pointer-events: none; }
.photo-focus { position: fixed; inset: 0; z-index: 20; display: grid; place-items: center; padding: 3rem; background: color-mix(in oklch, var(--fg) 82%, transparent); backdrop-filter: blur(10px); }
.photo-focus img { max-width: min(82vw, 58rem); max-height: 78vh; object-fit: contain; box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 28%); }
.photo-focus p { position: absolute; right: 3rem; bottom: 2rem; left: 3rem; margin: 0; color: var(--surface); font-family: var(--mono); font-size: .7rem; text-align: center; }
.photo-close { position: absolute; top: 1.2rem; right: 1.5rem; width: 3rem; height: 3rem; color: var(--surface); background: transparent; font-size: 2rem; }
.photo-focus-enter-active, .photo-focus-leave-active { transition: opacity .35s; }
.photo-focus-enter-from, .photo-focus-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .photo-focus-enter-active, .photo-focus-leave-active { transition: none; } }
@media (max-width: 720px) {
  .album-nav { grid-template-columns: 1fr auto; padding-top: 1rem; }
  .album-title { display: none; }
  .album-stage { min-height: calc(100dvh - 3.6rem); padding-top: .25rem; }
  .album-scene-wrap { min-height: 30rem; height: calc(100dvh - 5rem); }
  .album-scene-note { right: 1rem; bottom: 1rem; font-size: .58rem; }
  .album-error { left: 1rem; bottom: 2.1rem; font-size: .58rem; }
  .photo-focus { padding: 1.5rem; }
  .photo-focus p { right: 1.5rem; bottom: 1.5rem; left: 1.5rem; }
}
</style>
