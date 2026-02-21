import type { RedditResponse, RedditSort } from '@/dto/reddit'

export const fetchSubredditData = async (
  subreddit: string,
  sort: RedditSort,
): Promise<RedditResponse | null> => {
  try {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/${sort}.json`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return (await response.json()) as RedditResponse
  } catch (error) {
    console.error('Error fetching subreddit data:', error)
  }

  return null;
}
