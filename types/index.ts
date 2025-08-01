export interface User {
  id: string;
  username?: string;
  email?: string;
  name?: string;
  iqScore?: number;
  bio?: string;
  image?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  views: number;
  likesCount: number; // Changed from 'likes' to match Prisma schema
  comments: Comment[];
  isLikedByCurrentUser?: boolean;
  readTime?: number;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  authorId: string;
  likesCount: number;
  isLikedByCurrentUser?: boolean;
}

export type SortOption = 'recent' | 'popular' | 'controversial' | 'oldest';

export interface IQTestResult {
  id: string;
  userId: string;
  score: number;
  completedAt: Date;
  category: 'genius' | 'high' | 'average' | 'low';
}

// For backward compatibility, you can also export this alias
export type PostWithRelations = Post;