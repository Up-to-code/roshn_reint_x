'use client'

import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Strikethrough,
  Code,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EditorToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const toolbarGroups = [
    {
      name: 'Format',
      items: [
        {
          icon: Bold,
          onClick: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive('bold'),
          title: 'Bold',
        },
        {
          icon: Italic,
          onClick: () => editor.chain().focus().toggleItalic().run(),
          isActive: editor.isActive('italic'),
          title: 'Italic',
        },
        {
          icon: Underline,
          onClick: () => editor.chain().focus().toggleUnderline().run(),
          isActive: editor.isActive('underline'),
          title: 'Underline',
        },
        {
          icon: Strikethrough,
          onClick: () => editor.chain().focus().toggleStrike().run(),
          isActive: editor.isActive('strike'),
          title: 'Strikethrough',
        },
      ],
    },
    {
      name: 'Headings',
      items: [
        {
          icon: Heading1,
          onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: editor.isActive('heading', { level: 1 }),
          title: 'Heading 1',
        },
        {
          icon: Heading2,
          onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: editor.isActive('heading', { level: 2 }),
          title: 'Heading 2',
        },
        {
          icon: Heading3,
          onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: editor.isActive('heading', { level: 3 }),
          title: 'Heading 3',
        },
        {
          icon: Pilcrow,
          onClick: () => editor.chain().focus().setParagraph().run(),
          isActive: editor.isActive('paragraph'),
          title: 'Paragraph',
        },
        {
          icon: Code,
          onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          isActive: editor.isActive('codeBlock'),
          title: 'Code Block',
        },
      ],
    },
    {
      name: 'Lists',
      items: [
        {
          icon: List,
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editor.isActive('bulletList'),
          title: 'Bullet List',
        },
        {
          icon: ListOrdered,
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive('orderedList'),
          title: 'Numbered List',
        },
      ],
    },
    {
      name: 'Alignment',
      items: [
        {
          icon: AlignLeft,
          onClick: () => editor.chain().focus().setTextAlign('left').run(),
          isActive: editor.isActive({ textAlign: 'left' }),
          title: 'Align Left',
        },
        {
          icon: AlignCenter,
          onClick: () => editor.chain().focus().setTextAlign('center').run(),
          isActive: editor.isActive({ textAlign: 'center' }),
          title: 'Align Center',
        },
        {
          icon: AlignRight,
          onClick: () => editor.chain().focus().setTextAlign('right').run(),
          isActive: editor.isActive({ textAlign: 'right' }),
          title: 'Align Right',
        },
      ],
    },
    {
      name: 'Blocks',
      items: [
        {
          icon: Quote,
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive('blockquote'),
          title: 'Blockquote',
        },
      ],
    },
    {
      name: 'Media',
      items: [
        {
          icon: Link,
          onClick: addLink,
          isActive: editor.isActive('link'),
          title: 'Add Link',
        },
        {
          icon: Image,
          onClick: addImage,
          isActive: false,
          title: 'Add Image',
        },
      ],
    },
    {
      name: 'History',
      items: [
        {
          icon: Undo,
          onClick: () => editor.chain().focus().undo().run(),
          isActive: false,
          title: 'Undo',
        },
        {
          icon: Redo,
          onClick: () => editor.chain().focus().redo().run(),
          isActive: false,
          title: 'Redo',
        },
      ],
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-background p-3">
      {toolbarGroups.map((group, groupIndex) => (
        <div key={group.name} className="flex items-center gap-1">
          {group.items.map((item, itemIndex) => (
            <Button
              key={item.title}
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className={`size-8 p-0 ${
                item.isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={item.title}
            >
              <item.icon className="size-4" />
            </Button>
          ))}
          {groupIndex < toolbarGroups.length - 1 && (
            <div className="mx-1 h-6 w-px bg-border" />
          )}
        </div>
      ))}
    </div>
  )
}