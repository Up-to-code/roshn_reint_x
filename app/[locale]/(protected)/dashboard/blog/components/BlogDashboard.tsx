"use client";

import { useState, useEffect } from 'react'
import { RichTextEditor } from './RichTextEditor'
import { Sidebar } from './Sidebar'
import { ImageUploadSection } from './ImageUploadSection'
import { Menu, Sun, Moon, Bell, Settings, BarChart3, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SavePostData } from '@/types/editor'
import { toast } from 'sonner'
import { useBlogStore } from '@/store/useBlogStore';
import posthog from 'posthog-js'

export function BlogDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [headerImage, setHeaderImage] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  
  const {
    posts,
    currentPost,
    isLoading,
    isSaving,
    stats,
    setCurrentPost,
    loadPosts,
    savePost
  } = useBlogStore()

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title)
      setExcerpt(currentPost.excerpt)
      setHeaderImage(currentPost.headerImage || '')
      setThumbnail(currentPost.thumbnail || '')
    } else {
      setTitle('')
      setExcerpt('')
      setHeaderImage('')
      setThumbnail('')
    }
  }, [currentPost])

  const handleSave = async (data: SavePostData) => {
    const saveData = {
      ...data,
      title: title || '',
      excerpt: excerpt || '',
      headerImage,
      thumbnail,
    }

    const result = await savePost(saveData)
    
    if (result) {
      posthog.capture('blog_post_saved', {
        post_id: result.id,
        post_status: data.status,
        save_action: currentPost ? 'updated' : 'created',
      })
      toast.success(`Post ${data.status === 'draft' ? 'saved as draft' : 'published'}!`)
    } else {
      toast.error('Failed to save post')
    }
  }

  const handleNewPost = () => {
    setCurrentPost(null)
  }

  const handlePostSelect = (post: typeof currentPost) => {
    setCurrentPost(post)
    setSidebarOpen(false)
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-background">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPost={currentPost}
          posts={posts}
          onPostSelect={handlePostSelect}
          onNewPost={handleNewPost}
          stats={stats}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between border-b bg-background p-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setSidebarOpen(true)}
                variant="ghost"
                size="sm"
                className="lg:hidden"
              >
                <Menu className="size-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Blog Editor</h1>
                <p className="text-sm text-muted-foreground">
                  {currentPost ? `Editing: ${currentPost.title}` : 'Create new post'}
                  {isSaving && ' • Saving...'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BarChart3 className="size-4" />
                  <span>{stats.publishedPosts} published</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span>{stats.draftPosts} drafts</span>
                <div className="h-4 w-px bg-border" />
                <span>{stats.totalWords} words</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleNewPost}
              >
                <Plus className="mr-1 size-4" />
                New Post
              </Button>
              
              <Button variant="ghost" size="sm">
                <Bell className="size-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="size-4" />
              </Button>
              
              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="ghost"
                size="sm"
              >
                {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Image Upload Section */}
              <ImageUploadSection
                headerImage={headerImage}
                thumbnail={thumbnail}
                onHeaderImageChange={setHeaderImage}
                onThumbnailChange={setThumbnail}
              />

              {/* Title & Subtitle */}
              <div className="space-y-2 rounded-lg border bg-background p-6">
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title..."
                  className="h-auto border-none p-0 text-3xl font-bold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Subtitle..."
                  className="h-auto resize-none border-none p-0 text-lg text-muted-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Rich Text Editor */}
              <RichTextEditor
                initialContent={currentPost?.content}
                onSave={handleSave}
                onContentChange={(content) => {
                  // Auto-save functionality can be implemented here
                }}
                isLoading={isSaving}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}