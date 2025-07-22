export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  iq: number;
  bio: string;
  avatar?: string;
  joinedAt: Date;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  publishedAt: Date;
  readTime: number; // in minutes
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  publishedAt: Date;
  likesCount: number;
  isLiked?: boolean;
}

export type SortOption = 'recent' | 'highest-iq' | 'lowest-iq';

export interface IQTestResult {
  id: string;
  userId: string;
  score: number;
  completedAt: Date;
  category: 'genius' | 'high' | 'average' | 'low';
}