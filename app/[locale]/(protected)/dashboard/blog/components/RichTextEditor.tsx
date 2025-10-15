'use client'

import dynamic from 'next/dynamic'
import { EditorProps } from '@/types/editor'

function EditorSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-background">
      <div className="border-b bg-background p-3">
        <div className="flex flex-wrap items-center gap-1">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="size-8 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      </div>
      <div className="min-h-[500px] bg-background p-6">
        <div className="space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t bg-muted/50 p-4">
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        <div className="flex gap-3">
          <div className="h-9 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

const RichTextEditorClient = dynamic(
  () => import('./RichTextEditor.client.tsx').then(mod => mod.RichTextEditorClient),
  {
    ssr: false,
    loading: () => <EditorSkeleton />
  }
)

export function RichTextEditor(props: EditorProps) {
  return <RichTextEditorClient {...props} />
}