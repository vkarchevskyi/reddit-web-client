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
}

export interface RedditResponse {
  data: {
    children: {
      data: RedditPost
    }[]
  }
}
