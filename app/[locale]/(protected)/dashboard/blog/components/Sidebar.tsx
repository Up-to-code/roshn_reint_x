'use client'

import { BlogPost, SidebarProps } from '@/types/editor'
import { FileText, Plus, Menu, X, Calendar, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, formatDate } from '@/lib/utils'
import { useState } from 'react'

export function Sidebar({ isOpen, onToggle, currentPost, posts = [], onPostSelect, onNewPost }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:static",
        "w-80 border-r bg-background",
        "transition-transform duration-300 ease-in-out",
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        "flex flex-col"
      )}>
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Blog Posts</h2>
            <p className="text-sm text-muted-foreground">{posts.length} posts</p>
          </div>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            className="size-8 p-0 lg:hidden"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-3 border-b p-4">
          <Button onClick={onNewPost} className="w-full" size="sm">
            <Plus className="mr-2 size-4" />
            New Post
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No posts found</p>
              {searchTerm && (
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search</p>
              )}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => onPostSelect(post)}
                  className={cn(
                    "w-full rounded-lg p-3 text-left transition-colors",
                    "hover:bg-accent focus:bg-accent focus:outline-none",
                    currentPost?.id === post.id
                      ? 'border border-border bg-accent'
                      : ''
                  )}
                >
                  <h3 className="truncate text-sm font-medium text-foreground">
                    {post.title || ''}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {post.excerpt || 'No excerpt'}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={cn(
                      "rounded-full px-2 py-1 text-xs capitalize",
                      getStatusColor(post.status)
                    )}>
                      {post.status}
                    </span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 size-3" />
                      {formatDate(post.updatedAt, 'MMM d, yyyy')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}