<script setup lang="ts">
import RedditPost from '@/components/RedditPost.vue'
import SortButton from '@/components/SortButton.vue'
import { RedditSort, type RedditPost as RedditPostType, type RedditResponse } from '@/dto/reddit'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const subreddit = ref<string>(route.params.sub as string)
const posts = ref<RedditPostType[]>([])
const sort = ref<RedditSort>(route.params.sort ? (route.params.sort as RedditSort) : RedditSort.HOT)

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

watch([subreddit, sort], async () => {
  fetchSubredditData()
}, { immediate: true })
</script>

<template>
  <main class="space-y-5 mx-auto max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
    <h2 class="text-2xl font-bold">r/{{ subreddit }}</h2>

    <div class="space-x-4">
      <SortButton label="Hot" @click="sort = RedditSort.HOT;" :active="sort === RedditSort.HOT"></SortButton>
      <SortButton label="New" @click="sort = RedditSort.NEW;" :active="sort === RedditSort.NEW"></SortButton>
      <SortButton label="Top" @click="sort = RedditSort.TOP;" :active="sort === RedditSort.TOP"></SortButton>
    </div>

    <div v-if="posts.length > 0">
      <div v-for="post in posts" :key="post.id" class="border p-4 mb-4 rounded">
        <RedditPost :post="post" />
      </div>
    </div>
    <div v-else>
      <p>No posts found.</p>
    </div>
  </main>
</template>
