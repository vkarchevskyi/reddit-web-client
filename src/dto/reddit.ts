export enum RedditSort {
  HOT = 'hot',
  NEW = 'new',
  TOP = 'top',
  CONTROVERSIAL = 'controversial',
}

export enum RedditTime {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all',
}

export interface RedditPost {
  id: string
  title: string
  author: string
  url: string
  score: number
  num_comments: number
  created_utc: number
  thumbnail: string
  permalink: string
  domain: string
  is_video: boolean
  is_gallery: boolean
  media?: {
    reddit_video?: {
      bitrates_mp4: number[]
      fallback_url: string
      height: number
      width: number
      duration: number
    }
  }
  preview?: {
    images: {
      source: {
        url: string
        width: number
        height: number
      }
      resolutions: {
        url: string
        width: number
        height: number
      }[]
    }[]
  }
  gallery_data?: {
    items: {
      media_id: string
      id: number
    }[]
  }
  media_metadata?: Record<
    string,
    {
      type: string
      id: string
      s?: {
        x: number
        y: number
      }
    }
  >
  secure_media_embed?: {
    content?: string
    width?: number
    height?: number
  }
}

export interface RedditResponse {
  data: {
    after: string
    children: {
      data: RedditPost
    }[]
  }
}
