<script setup lang="ts">
import RedditPost from '@/components/RedditPost.vue'
import SortButton from '@/components/SortButton.vue'
import { RedditSort, type RedditPost as RedditPostType } from '@/dto/reddit'
import router from '@/router'
import { fetchSubredditData } from '@/services/subreddit'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const subreddit = ref<string>(route.params.sub as string)
const posts = ref<RedditPostType[]>([])
const sort = ref<RedditSort>(route.params.sort ? (route.params.sort as RedditSort) : RedditSort.HOT)
const isLoading = ref(false)
const after = ref<string | null>(null)
const sentinelElement = ref<HTMLElement | null>(null)

const loadMorePosts = async () => {
  if (isLoading.value) return

  isLoading.value = true
  const data = await fetchSubredditData(subreddit.value, sort.value, after.value || undefined)
  isLoading.value = false

  if (data) {
    const newPosts = data.data.children.map((child) => child.data)
    posts.value = [...posts.value, ...newPosts]
    after.value = data.data.after
    console.log(after.value)
  }
}

const resetPosts = async () => {
  posts.value = []
  after.value = null
  await loadMorePosts()
}

watch(
  [subreddit, sort],
  async () => {
    router.push({ name: 'subreddit', params: { sub: subreddit.value, sort: sort.value } })
  },
  { immediate: true },
)

watch(
  route,
  async (newRoute) => {
    subreddit.value = newRoute.params.sub as string
    await resetPosts()
  },
  { immediate: true },
)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && !isLoading.value && after.value !== null) {
      loadMorePosts()
    }
  })

  watch(sentinelElement, (newElement) => {
    if (newElement) {
      observer.observe(newElement)
    }
  })
})
</script>

<template>
  <main class="space-y-5 mx-auto max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
    <h2 class="text-2xl font-bold">r/{{ subreddit }}</h2>

    <div class="space-x-4">
      <SortButton
        label="Hot"
        @click="sort = RedditSort.HOT"
        :active="sort === RedditSort.HOT"
      ></SortButton>
      <SortButton
        label="New"
        @click="sort = RedditSort.NEW"
        :active="sort === RedditSort.NEW"
      ></SortButton>
      <SortButton
        label="Top"
        @click="sort = RedditSort.TOP"
        :active="sort === RedditSort.TOP"
      ></SortButton>
    </div>

    <div v-if="posts.length > 0">
      <div v-for="post in posts" :key="post.id" class="border mb-4 rounded">
        <RedditPost :post="post" />
      </div>

      <div v-if="after !== null" ref="sentinelElement" class="py-8 flex justify-center">
        <div v-if="isLoading" class="text-gray-400">Loading more posts...</div>
      </div>
    </div>
    <div v-else>
      <p>No posts found.</p>
    </div>
  </main>
</template>
