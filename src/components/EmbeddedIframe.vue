<script setup lang="ts">
import { computed } from 'vue'

const width = '560px'
const height = '400px'

const props = defineProps<{
  content?: string
}>()

const iframeSrc = computed(() => {
  if (!props.content) return null

  const srcMatch = props.content.match(/src=["']([^"']+)["']/)
  return srcMatch ? srcMatch[1] : null
})

const dimensions = computed(() => {
  if (!props.content) return { width: width, height: height }

  const widthMatch = props.content.match(/width=["']([^"']+)["']/)
  const heightMatch = props.content.match(/height=["']([^"']+)["']/)

  return {
    width: widthMatch ? widthMatch[1] : width,
    height: heightMatch ? heightMatch[1] : height,
  }
})
</script>

<template>
  <div v-if="iframeSrc" class="w-full flex items-center justify-center bg-black">
    <iframe
      :src="iframeSrc"
      :width="dimensions.width"
      :height="dimensions.height"
      frameborder="0"
      scrolling="no"
      allowfullscreen
      style="max-width: 100%; height: auto; aspect-ratio: auto"
    />
  </div>
</template>
