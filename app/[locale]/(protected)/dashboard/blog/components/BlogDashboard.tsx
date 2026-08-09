"use client";

import { useMemo, useState } from 'react'
import { RichTextEditor } from './RichTextEditor'
import { Sidebar } from './Sidebar'
import { ImageUploadSection } from './ImageUploadSection'
import { Menu, Sun, Moon, BarChart3, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BlogPost, SavePostData } from '@/types/editor'
import { toast } from 'sonner'
import posthog from 'posthog-js'
import { parseEditorPost, publishingStats } from '@/lib/publishing/publishing-core'

async function responseJson(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

type EditorDraft = Pick<SavePostData, 'title' | 'excerpt' | 'headerImage' | 'thumbnail'>;
const emptyDraft: EditorDraft = { title: '', excerpt: '', headerImage: '', thumbnail: '' };

const draftFromPost = (post: BlogPost): EditorDraft => ({
  title: post.title,
  excerpt: post.excerpt || '',
  headerImage: post.headerImage || '',
  thumbnail: post.thumbnail || '',
});

export function BlogDashboard({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [draft, setDraft] = useState<EditorDraft>(emptyDraft)
  const [posts, setPosts] = useState(initialPosts)
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const stats = useMemo(() => publishingStats(posts), [posts])

  const handleSave = async (data: SavePostData) => {
    const saveData = {
      ...data,
      ...draft,
    }

    setIsSaving(true)
    try {
      const editingId = currentPost?.id;
      const response = await fetch(editingId ? `/api/posts/${editingId}` : '/api/posts', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...saveData, status: saveData.status.toUpperCase() }),
      });
      const result = parseEditorPost(await responseJson(response));
      setPosts(current => editingId
        ? current.map(post => post.id === result.id ? result : post)
        : [result, ...current]);
      setCurrentPost(result);
      setDraft(draftFromPost(result));
      posthog.capture('blog_post_saved', {
        post_id: result.id,
        post_status: data.status,
        save_action: currentPost ? 'updated' : 'created',
      })
      toast.success(`Post ${data.status === 'draft' ? 'saved as draft' : 'published'}!`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNewPost = () => {
    setCurrentPost(null)
    setDraft(emptyDraft)
  }

  const handlePostSelect = (post: typeof currentPost) => {
    setCurrentPost(post)
    setDraft(post ? draftFromPost(post) : emptyDraft)
    setSidebarOpen(false)
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-background">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPost={currentPost ?? undefined}
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
                headerImage={draft.headerImage || undefined}
                thumbnail={draft.thumbnail || undefined}
                onHeaderImageChange={(headerImage) => setDraft(current => ({ ...current, headerImage }))}
                onThumbnailChange={(thumbnail) => setDraft(current => ({ ...current, thumbnail }))}
              />

              {/* Title & Subtitle */}
              <div className="space-y-2 rounded-lg border bg-background p-6">
                <Input
                  type="text"
                  value={draft.title}
                  onChange={(event) => setDraft(current => ({ ...current, title: event.target.value }))}
                  placeholder="Post title..."
                  className="h-auto border-none p-0 text-3xl font-bold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Input
                  value={draft.excerpt}
                  onChange={(event) => setDraft(current => ({ ...current, excerpt: event.target.value }))}
                  placeholder="Subtitle..."
                  className="h-auto resize-none border-none p-0 text-lg text-muted-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Rich Text Editor */}
              <RichTextEditor
                key={currentPost?.id || 'new'}
                initialContent={currentPost?.content}
                onSave={handleSave}
                isLoading={isSaving}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
