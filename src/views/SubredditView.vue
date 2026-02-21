<script setup lang="ts">
import SortButton from '@/components/SortButton.vue'
import { RedditSort, type RedditPost, type RedditResponse } from '@/dto/reddit'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const subreddit = ref<string>(route.params.sub as string)
const posts = ref<RedditPost[]>([])
const sort = ref<RedditSort>(RedditSort.HOT)

const fetchSubredditData = async () => {
  try {
    const response = await fetch(`https://www.reddit.com/r/${subreddit.value}/${sort.value}.json`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = await response.json() as RedditResponse;
    posts.value = responseData.data.children.map(child => child.data)
    console.log(posts.value);
  } catch (error) {
    console.error('Error fetching subreddit data:', error)
  }
}

// Watch for changes and refetch
watch([subreddit, sort], async () => {
  fetchSubredditData()
}, { immediate: true })
</script>

<template>
  <main>
    <h2 class="text-2xl font-bold">r/{{ subreddit }}</h2>

    <div>
      <SortButton label="Hot" @click="sort = RedditSort.HOT;"></SortButton>
      <SortButton label="New" @click="sort = RedditSort.NEW;"></SortButton>
      <SortButton label="Top" @click="sort = RedditSort.TOP;"></SortButton>
    </div>

    <div v-if="posts.length > 0">
      <div v-for="post in posts" :key="post.id" class="border p-4 mb-4 rounded">
        <h3 class="text-xl font-semibold">{{ post.title }}</h3>
        <p class="text-gray-600">Posted by {{ post.author }}</p>
      </div>
    </div>
    <div v-else>
      <p>No posts found.</p>
    </div>
  </main>
</template>
