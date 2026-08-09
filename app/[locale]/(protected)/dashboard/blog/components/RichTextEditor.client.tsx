'use client'

import { useEffect, useState } from 'react'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Eye, Loader2, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { EditorProps } from '@/types/editor'

import { EditorToolbar } from './EditorToolbar'

export function RichTextEditorClient({
  initialContent = '',
  onContentChange,
  onSave,
  isLoading = false,
}: EditorProps) {
  const [characterCount, setCharacterCount] = useState(0)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full h-auto border' } }),
      Link.configure({
        HTMLAttributes: { class: 'text-blue-600 dark:text-blue-400 underline' },
        openOnClick: false,
      }),
    ],
    content: initialContent || '<p></p>',
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onContentChange?.(currentEditor.getHTML())
      setCharacterCount(currentEditor.getText().length)
    },
    onCreate: ({ editor: currentEditor }) => setCharacterCount(currentEditor.getText().length),
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-6 prose-headings:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed',
      },
    },
  })

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent)
      setCharacterCount(editor.getText().length)
    }
  }, [initialContent, editor])

  const save = (status: 'draft' | 'published') => onSave?.({
    title: '',
    excerpt: '',
    content: editor?.getHTML() || '',
    status,
  })

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="flex-1" />
      <div className="flex items-center justify-between border-t bg-muted/50 p-4">
        <div className="text-sm text-muted-foreground">
          {characterCount} characters • {editor?.getText().trim().split(/\s+/).filter(Boolean).length || 0} words
        </div>
        <div className="flex gap-2">
          <Button onClick={() => save('draft')} variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Draft
          </Button>
          <Button onClick={() => save('published')} size="sm" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Eye className="size-4" />}
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}
