<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RedditPost } from '@/dto/reddit'
import ArrowUpCircle from './icons/ArrowUpCircle.vue'
import ChatBubbleBottomCenterText from './icons/ChatBubbleBottomCenterText.vue'
import EmbeddedIframe from './EmbeddedIframe.vue'
import ChevronLeft from './icons/ChevronLeft.vue'
import ChevronRight from './icons/ChevronRight.vue'
import { decodeHtmlEntities } from '@/utils/html-decoder'

const props = defineProps<{
  post: RedditPost
}>()

const activeImageIndex = ref(0)
const isVideoPlaying = ref(false)

const galleryItems = computed(() => activePost.value.gallery_data?.items ?? [])
const galleryMetadata = computed(() => activePost.value?.media_metadata ?? {})

const currentGalleryImage = computed(() => {
  const items = galleryItems.value
  if (items.length === 0) return null
  const item = items[activeImageIndex.value]
  const metadata = item ? galleryMetadata.value[item.media_id] : null
  return metadata ? `https://i.redd.it/${metadata.id}.jpg` : null
})

const previewImage = computed(() => {
  const url = activePost.value?.preview?.images?.[activeImageIndex.value]?.source?.url
  return url ? decodeHtmlEntities(url) : undefined
})
const redditVideoUrl = computed(() => activePost.value?.media?.reddit_video?.fallback_url)
const embeddedContent = computed(() => activePost.value?.secure_media_embed?.content)

const hasGallery = computed(() => activePost.value?.is_gallery)
const hasVideo = computed(() => activePost.value?.is_video)
const hasEmbedded = computed(() => activePost.value?.secure_media_embed?.content)
const hasImages = computed(() => activePost.value?.preview?.images && activePost.value?.preview?.images.length > 0)

const mediaCount = computed(() => {
  if (hasGallery.value) {
    return galleryItems.value?.length || 0
  } else if (hasImages.value) {
    return activePost.value?.preview?.images?.length || 0
  }
  return 0
})

const activePost = computed(() => props.post)

const goToNextImage = () => {
  activeImageIndex.value = (activeImageIndex.value + 1) % mediaCount.value
}
const goToPreviousImage = () => {
  activeImageIndex.value = (activeImageIndex.value - 1 + mediaCount.value) % mediaCount.value
}
const openPostLink = () => {
  window.open(`https://reddit.com${activePost.value.permalink}`, '_blank')
}
</script>

<template>
  <div
    class="bg-black/30 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-gray-100 hover:text-gray-400 cursor-pointer line-clamp-2"
            @click="openPostLink">
            {{ post.title }}
          </h2>
          <div class="text-sm text-gray-400 mt-2">
            <span class="text-gray-500">Posted by</span>
            <span class="text-gray-300 font-medium"> u/{{ post.author }}</span>
            <span class="mx-2 text-gray-600">•</span>
            <span class="text-gray-400">in r/{{ post.domain }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasVideo || hasImages || hasGallery || hasEmbedded" class="bg-black relative">
      <div v-if="hasVideo && redditVideoUrl" class="relative w-full bg-black">
        <video :src="redditVideoUrl" controls class="w-full max-h-96 object-contain" @play="isVideoPlaying = true"
          @pause="isVideoPlaying = false" />
      </div>

      <div v-else-if="hasEmbedded" class="relative w-full">
        <EmbeddedIframe :content="embeddedContent" />
      </div>

      <div v-else-if="(hasGallery && currentGalleryImage) || (hasImages && previewImage)" class="relative w-full">
        <img :src="(hasGallery ? currentGalleryImage : previewImage) ?? ''" :alt="post.title"
          class="w-full max-h-96 object-contain" />

        <div v-if="mediaCount > 1" class="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <button
            class="pointer-events-auto bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-colors"
            @click="goToPreviousImage">
            <ChevronLeft class="w-6 h-6" />
          </button>

          <button
            class="pointer-events-auto bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-colors"
            @click="goToNextImage">
            <ChevronRight class="w-6 h-6" />
          </button>
        </div>

        <div v-if="mediaCount > 1"
          class="absolute top-3 right-3 bg-black/75 text-white text-sm px-3 py-1 rounded font-medium">
          {{ activeImageIndex + 1 }} / {{ mediaCount }}
        </div>

        <div v-if="mediaCount > 1"
          class="absolute bottom-2 left-3 bg-black/75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
          {{ mediaCount }}
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-gray-700 flex items-center gap-6 text-sm text-gray-400">
      <div class="flex items-center gap-2 hover:text-blue-400 cursor-pointer">
        <ArrowUpCircle class="w-5 h-5" />
        <span class="font-medium">{{ post.score }}</span>
      </div>

      <div class="flex items-center gap-2 hover:text-blue-400 cursor-pointer">
        <ChatBubbleBottomCenterText class="w-5 h-5" />
        <span class="font-medium">{{ post.num_comments }}</span>
      </div>

      <button class="ml-auto px-3 py-1 rounded bg-gray-600/20 text-white hover:bg-gray-600/30 transition-colors"
        @click="openPostLink">
        View on Reddit
      </button>
    </div>
  </div>
</template>
