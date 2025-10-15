import { create } from 'zustand'
import { BlogPost, PostStatus } from '@/types/editor'

interface BlogStore {
  // State
  posts: BlogPost[]
  currentPost: BlogPost | null
  isLoading: boolean
  isSaving: boolean
  isDeleting: boolean
  stats: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalWords: number
  }
  
  // Actions
  setPosts: (posts: BlogPost[]) => void
  setCurrentPost: (post: BlogPost | null) => void
  addPost: (post: BlogPost) => void
  updatePost: (id: string, updates: Partial<BlogPost>) => void
  deletePost: (id: string) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setDeleting: (deleting: boolean) => void
  updateStats: () => void
  
  // Async Actions
  loadPosts: () => Promise<void>
  loadPost: (id: string) => Promise<BlogPost | null>
  savePost: (postData: Partial<BlogPost>) => Promise<BlogPost | null>
  deletePostById: (id: string) => Promise<boolean>
  duplicatePost: (id: string) => Promise<BlogPost | null>
}

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Helper to convert API post to BlogPost type
const convertToBlogPost = (apiPost: any): BlogPost => ({
  ...apiPost,
  status: apiPost.status.toLowerCase() as PostStatus,
  createdAt: new Date(apiPost.createdAt),
  updatedAt: new Date(apiPost.updatedAt)
})

export const useBlogStore = create<BlogStore>((set, get) => ({
  // Initial state
  posts: [],
  currentPost: null,
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  stats: {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalWords: 0,
  },

  // Actions
  setPosts: (posts) => {
    set({ posts })
    get().updateStats()
  },

  setCurrentPost: (currentPost) => set({ currentPost }),

  addPost: (post) => {
    set((state) => {
      const newPosts = [post, ...state.posts]
      return { posts: newPosts }
    })
    get().updateStats()
  },

  updatePost: (id, updates) => {
    set((state) => {
      const newPosts = state.posts.map(post =>
        post.id === id ? { ...post, ...updates, updatedAt: new Date() } : post
      )
      const newCurrentPost = state.currentPost?.id === id 
        ? { ...state.currentPost, ...updates, updatedAt: new Date() }
        : state.currentPost
      
      return { 
        posts: newPosts, 
        currentPost: newCurrentPost 
      }
    })
    get().updateStats()
  },

  deletePost: (id) => {
    set((state) => {
      const newPosts = state.posts.filter(post => post.id !== id)
      const newCurrentPost = state.currentPost?.id === id ? null : state.currentPost
      return { posts: newPosts, currentPost: newCurrentPost }
    })
    get().updateStats()
  },

  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  setDeleting: (isDeleting) => set({ isDeleting }),

  updateStats: () => {
    const { posts } = get()
    const stats = {
      totalPosts: posts.length,
      publishedPosts: posts.filter(post => post.status === 'published').length,
      draftPosts: posts.filter(post => post.status === 'draft').length,
      totalWords: posts.reduce((total, post) => {
        return total + (post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0)
      }, 0),
    }
    set({ stats })
  },

  // Async Actions
  loadPosts: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/posts')
      const data = await handleApiResponse(response)
      const posts = data.map(convertToBlogPost)
      set({ posts })
      get().updateStats()
    } catch (error) {
      console.error('Failed to load posts:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  loadPost: async (id: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch(`/api/posts/${id}`)
      const data = await handleApiResponse(response)
      const post = convertToBlogPost(data)
      
      // Update current post and also update in posts list if exists
      set((state) => {
        const updatedPosts = state.posts.map(p => p.id === id ? post : p)
        const postExists = state.posts.some(p => p.id === id)
        const newPosts = postExists ? updatedPosts : [post, ...state.posts]
        
        return { 
          currentPost: post,
          posts: newPosts
        }
      })
      
      get().updateStats()
      return post
    } catch (error) {
      console.error('Failed to load post:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  savePost: async (postData) => {
    set({ isSaving: true })
    try {
      const { currentPost } = get()
      const url = currentPost ? `/api/posts/${currentPost.id}` : '/api/posts'
      const method = currentPost ? 'PUT' : 'POST'

      // Convert status to uppercase for Prisma enum
      const status = postData.status ? postData.status.toUpperCase() as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' : 'DRAFT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postData.title || 'Untitled',
          excerpt: postData.excerpt || '',
          content: postData.content || '',
          status: status,
          headerImage: postData.headerImage || '',
          thumbnail: postData.thumbnail || '',
        }),
      })

      const data = await handleApiResponse(response)
      const savedPost = convertToBlogPost(data)
      
      if (currentPost) {
        get().updatePost(currentPost.id, savedPost)
      } else {
        get().addPost(savedPost)
        set({ currentPost: savedPost })
      }
      
      return savedPost
    } catch (error) {
      console.error('Failed to save post:', error)
      throw error
    } finally {
      set({ isSaving: false })
    }
  },

  deletePostById: async (id: string) => {
    set({ isDeleting: true })
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })

      await handleApiResponse(response)
      get().deletePost(id)
      return true
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    } finally {
      set({ isDeleting: false })
    }
  },

  duplicatePost: async (id: string) => {
    set({ isSaving: true })
    try {
      const { posts } = get()
      const originalPost = posts.find(post => post.id === id)
      if (!originalPost) throw new Error('Post not found')

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${originalPost.title} (Copy)`,
          excerpt: originalPost.excerpt,
          content: originalPost.content,
          status: 'DRAFT',
          headerImage: originalPost.headerImage,
          thumbnail: originalPost.thumbnail,
        }),
      })

      const data = await handleApiResponse(response)
      const duplicatedPost = convertToBlogPost(data)
      get().addPost(duplicatedPost)
      return duplicatedPost
    } catch (error) {
      console.error('Failed to duplicate post:', error)
      throw error
    } finally {
      set({ isSaving: false })
    }
  },
}))