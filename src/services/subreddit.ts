import type { RedditResponse, RedditSort } from '@/dto/reddit'
import { POSTS_PER_PAGE } from '@/constants/pagination'

export const fetchSubredditData = async (
  subreddit: string,
  sort: RedditSort,
  after?: string,
): Promise<RedditResponse | null> => {
  try {
    const url = new URL(`https://www.reddit.com/r/${subreddit}/${sort}.json`)
    url.searchParams.set('limit', POSTS_PER_PAGE.toString())
    if (after) {
      url.searchParams.set('after', after)
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return (await response.json()) as RedditResponse
  } catch (error) {
    console.error('Error fetching subreddit data:', error)
  }

  return null
}
