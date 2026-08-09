type PostStatus = 'draft' | 'published' | 'archived'

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string | null
  status: PostStatus
  headerImage?: string | null
  thumbnail?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface EditorProps {
  initialContent?: string
  onSave?: (data: SavePostData) => void
  onContentChange?: (content: string) => void
  isLoading?: boolean
}

export interface SavePostData {
  title: string
  excerpt: string
  content: string
  status: PostStatus
  headerImage?: string
  thumbnail?: string
}

export interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  currentPost?: BlogPost
  posts: BlogPost[]
  onPostSelect: (post: BlogPost) => void
  onNewPost: () => void
  stats: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalWords: number
  }
}

export interface ImageUploadSectionProps {
  headerImage?: string
  thumbnail?: string
  onHeaderImageChange: (url: string) => void
  onThumbnailChange: (url: string) => void
}
