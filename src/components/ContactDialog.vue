<script setup lang="ts">
import { ref } from 'vue'

const dialogRef = ref<HTMLDialogElement | null>(null)
const formRef = ref<HTMLFormElement | null>(null)
const statusText = ref('')
const submitted = ref(false)

const name = ref('')
const email = ref('')
const message = ref('')

function open() {
  dialogRef.value?.showModal()
}

function close() {
  dialogRef.value?.close()
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    close()
  }
}

function handleSubmit() {
  if (!formRef.value?.reportValidity()) return

  submitted.value = true
  statusText.value = '信息已保存在当前页面；补充真实联系邮箱后即可接入发送服务。'
}

defineExpose({ open, close })
</script>

<template>
  <dialog
    ref="dialogRef"
    id="contact-dialog"
    aria-labelledby="dialog-title"
    @click="onBackdropClick"
  >
    <div class="dialog-inner">
      <div class="dialog-head">
        <div>
          <p class="eyebrow">项目交流</p>
          <h2 id="dialog-title">先聊聊你的想法。</h2>
        </div>
        <button
          class="dialog-close"
          type="button"
          aria-label="关闭对话框"
          @click="close"
        >
          ×
        </button>
      </div>

      <form ref="formRef" class="contact-form" @submit.prevent="handleSubmit">
        <label class="field">
          <span>怎么称呼你</span>
          <input v-model="name" name="name" autocomplete="name" required />
        </label>
        <label class="field">
          <span>联系邮箱</span>
          <input v-model="email" name="email" type="email" autocomplete="email" required />
        </label>
        <label class="field">
          <span>项目简介</span>
          <textarea
            v-model="message"
            name="message"
            required
            placeholder="简单介绍目标、时间或当前阶段"
          ></textarea>
        </label>
        <button class="submit-button" type="submit">
          {{ submitted ? '已保存' : '保存交流信息' }}
        </button>
        <p class="form-status" role="status">{{ statusText }}</p>
      </form>
    </div>
  </dialog>
</template>

<style scoped>
dialog {
  width: min(92vw, 34rem);
  padding: 0;
  border: 0;
  color: var(--fg);
  background: var(--surface);
  box-shadow: 0 30px 80px color-mix(in oklch, var(--fg) 30%, transparent);
}

dialog::backdrop {
  background: color-mix(in oklch, var(--fg) 60%, transparent);
  backdrop-filter: blur(8px);
}

.dialog-inner {
  padding: 2rem;
}

.dialog-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.dialog-head h2 {
  margin: 0;
  font-family: var(--display);
  font-size: 2.2rem;
  font-weight: 400;
}

.eyebrow {
  margin: 0 0 0.3rem;
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--muted);
}

.dialog-close {
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  background: transparent;
  font-size: 1.5rem;
  color: inherit;
  border: 0;
  cursor: pointer;
}

.contact-form {
  display: grid;
  gap: 1rem;
  text-align: left;
}

.field {
  display: grid;
  gap: 0.45rem;
  font-size: 0.72rem;
}

.field input,
.field textarea {
  width: 100%;
  min-height: 48px;
  padding: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 0;
  color: var(--fg);
  background: var(--surface);
  font: inherit;
}

.field textarea {
  min-height: 8rem;
  resize: vertical;
}

.submit-button {
  min-height: 50px;
  margin-top: 0.5rem;
  color: var(--surface);
  background: var(--fg);
  border: 0;
  cursor: pointer;
  font: inherit;
}

.form-status {
  min-height: 1.3rem;
  margin: 0;
  font-size: 0.72rem;
  color: var(--muted);
}
</style>
