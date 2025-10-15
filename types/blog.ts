export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'scheduled';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  featuredImage?: string;
  tags: string[];
  author: string;
  readTime: number;
  views: number;
}

export interface EditorState {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  status: 'draft' | 'published';
  isSaving: boolean;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  monthlyViews: number;
}