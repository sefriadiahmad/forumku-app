// API Endpoints - placeholder
// TODO: Define all API endpoint constants

export const endpoints = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/users/me',

  // Threads
  THREADS: '/threads',
  THREAD_BY_ID: (id) => `/threads/${id}`,
  THREAD_UPVOTE: (id) => `/threads/${id}/up-vote`,
  THREAD_DOWNVOTE: (id) => `/threads/${id}/down-vote`,
  THREAD_NEUTRAL_VOTE: (id) => `/threads/${id}/neutral-vote`,

  // Comments
  COMMENTS: (threadId) => `/threads/${threadId}/comments`,
  COMMENT_UPVOTE: (threadId, commentId) => `/threads/${threadId}/comments/${commentId}/up-vote`,
  COMMENT_DOWNVOTE: (threadId, commentId) => `/threads/${threadId}/comments/${commentId}/down-vote`,

  // Leaderboard
  LEADERBOARD: '/leaderboards',
}
