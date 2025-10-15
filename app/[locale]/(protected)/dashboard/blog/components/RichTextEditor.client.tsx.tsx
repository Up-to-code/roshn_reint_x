'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useEffect, useState } from 'react'
import { EditorToolbar } from './EditorToolbar'
import { EditorProps } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { Save, Eye, Loader2 } from 'lucide-react'

export function RichTextEditorClient({ 
  initialContent = '', 
  onContentChange, 
  onSave, 
  isLoading = false 
}: EditorProps) {
  const [mounted, setMounted] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto border',
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline',
        },
        openOnClick: false,
      }),
    ],
    content: '<p></p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      onContentChange?.(content)
      setCharacterCount(editor.getText().length)
    },
    onCreate: ({ editor }) => {
      if (initialContent && initialContent !== '<p></p>') {
        editor.commands.setContent(initialContent)
      }
      setCharacterCount(editor.getText().length)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-6 prose-headings:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed',
      },
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (editor && mounted && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent)
      setCharacterCount(editor.getText().length)
    }
  }, [initialContent, editor, mounted])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="flex-1" />
      <div className="flex items-center justify-between border-t bg-muted/50 p-4">
        <div className="text-sm text-muted-foreground">
          {characterCount} characters • {editor?.getText().split(/\s+/).length || 0} words
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onSave?.({ 
              title: '', 
              excerpt: '', 
              content: editor?.getHTML() || '', 
              status: 'draft' 
            })}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Draft
          </Button>
          <Button
            onClick={() => onSave?.({ 
              title: '', 
              excerpt: '', 
              content: editor?.getHTML() || '', 
              status: 'published' 
            })}
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Eye className="size-4" />}
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}