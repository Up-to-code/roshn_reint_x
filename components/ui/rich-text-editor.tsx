"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Undo,
  Redo,
  Link,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Columns,
  PanelLeft,
  Eye,
  Maximize2,
  Minimize2,
  Trophy,
  Target,
  Activity
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isRTL?: boolean;
}

type ViewMode = 'edit' | 'preview' | 'split';

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your game plan...", 
  className,
  disabled = false,
  isRTL = false
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFormat, setActiveFormat] = useState<string[]>([]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    updateCounts();
    updateActiveFormats();
  }, [value]);

  const updateCounts = () => {
    const text = editorRef.current?.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    setWordCount(words);
    setCharCount(chars);
  };

  const updateActiveFormats = () => {
    if (typeof document === 'undefined') return;
    
    const formats: string[] = [];
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    setActiveFormat(formats);
  };

  const execCommand = (command: string, value?: string) => {
    if (disabled || typeof document === 'undefined') return;
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
    updateActiveFormats();
  };

  const handleInput = () => {
    if (editorRef.current && !isComposingRef.current) {
      onChange(editorRef.current.innerHTML);
      updateCounts();
      updateActiveFormats();
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    handleInput();
  };

  const insertLink = () => {
    if (typeof window === 'undefined') return;
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const clearFormatting = () => {
    execCommand('removeFormat');
    execCommand('formatBlock', 'div');
    setActiveFormat([]);
  };

  const formatList = (type: 'bullet' | 'number') => {
    const command = type === 'bullet' ? 'insertUnorderedList' : 'insertOrderedList';
    execCommand(command);
  };

  const formatHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toolbarGroups = [
    {
      name: 'Power Tools',
      buttons: [
        { 
          icon: Bold, 
          command: 'bold', 
          title: 'Bold',
          isActive: activeFormat.includes('bold'),
        },
        { 
          icon: Italic, 
          command: 'italic', 
          title: 'Italic',
          isActive: activeFormat.includes('italic'),
        },
        { 
          icon: Underline, 
          command: 'underline', 
          title: 'Underline',
          isActive: activeFormat.includes('underline'),
        },
      ]
    },
    {
      name: 'Headings',
      buttons: [
        { 
          icon: Heading1, 
          command: 'formatBlock', 
          value: 'h1', 
          title: 'Heading 1',
        },
        { 
          icon: Heading2, 
          command: 'formatBlock', 
          value: 'h2', 
          title: 'Heading 2',
        },
        { 
          icon: Heading3, 
          command: 'formatBlock', 
          value: 'h3', 
          title: 'Heading 3',
        },
        { 
          icon: Type, 
          command: 'formatBlock', 
          value: 'p', 
          title: 'Paragraph',
        },
      ]
    },
    {
      name: 'Playbook',
      buttons: [
        { 
          icon: List, 
          action: () => formatList('bullet'), 
          title: 'Bullet List',
        },
        { 
          icon: ListOrdered, 
          action: () => formatList('number'), 
          title: 'Numbered List',
        },
      ]
    },
    {
      name: 'Alignment',
      buttons: [
        { 
          icon: AlignLeft, 
          command: 'justifyLeft', 
          title: 'Align Left',
        },
        { 
          icon: AlignCenter, 
          command: 'justifyCenter', 
          title: 'Align Center',
        },
        { 
          icon: AlignRight, 
          command: 'justifyRight', 
          title: 'Align Right',
        },
      ]
    }
  ];

  const viewModes = [
    { mode: 'edit' as ViewMode, icon: PanelLeft, title: 'Edit' },
    { mode: 'split' as ViewMode, icon: Columns, title: 'Split' },
    { mode: 'preview' as ViewMode, icon: Eye, title: 'Preview' },
  ];

  // Sports dark theme colors
  const sportsTheme = {
    background: 'bg-gray-900',
    border: 'border-orange-500/30',
    toolbar: 'bg-gray-800 border-orange-500/30',
    button: 'text-orange-300 hover:bg-orange-600/20 hover:text-orange-200',
    active: 'bg-orange-500 text-white',
    status: 'bg-gray-800 text-orange-300 border-orange-500/30',
    accent: 'text-orange-400',
  };

  return (
    <div 
      className={cn(
        "overflow-hidden rounded-lg border transition-colors",
        sportsTheme.background,
        sportsTheme.border,
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'relative',
        className
      )}
    >
      {/* Sports Toolbar */}
      <div 
        className={cn(
          "flex items-center justify-between border-b p-3",
          sportsTheme.toolbar,
          sportsTheme.border
        )}
      >
        <div className="flex items-center gap-2">
          {/* Sports Icon */}
          <div className="mr-2 flex items-center gap-2">
            <Trophy className="size-5 text-orange-400" />
            <span className="text-sm font-bold text-orange-300">SPORTS EDITOR</span>
          </div>

          {toolbarGroups.map((group, groupIndex) => (
            <div key={group.name} className="flex items-center gap-1">
              {group.buttons.map((button, btnIndex) => (
                <Button
                  key={`${group.name}-${btnIndex}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => button.action ? button.action() : execCommand(button.command!, button.value)}
                  disabled={disabled}
                  className={cn(
                    "size-8 p-0",
                    sportsTheme.button,
                    button.isActive && sportsTheme.active
                  )}
                  title={button.title}
                >
                  <button.icon className="size-4" />
                </Button>
              ))}
              {groupIndex < toolbarGroups.length - 1 && (
                <div className={cn(
                  "mx-2 h-4 w-px bg-orange-500/30"
                )} />
              )}
            </div>
          ))}
          
          {/* Additional Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={insertLink}
              disabled={disabled}
              className={cn(
                "size-8 p-0",
                sportsTheme.button
              )}
              title="Insert Link"
            >
              <Link className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('undo')}
              disabled={disabled}
              className={cn(
                "size-8 p-0",
                sportsTheme.button
              )}
              title="Undo"
            >
              <Undo className="size-4" />
            </Button>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Sports Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-orange-400" />
              <span className="text-sm text-orange-300">{wordCount} words</span>
            </div>
          </div>

          {/* View Modes */}
          <div className="flex items-center gap-1">
            {viewModes.map(({ mode, icon: Icon, title }) => (
              <Button
                key={mode}
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(mode)}
                className={cn(
                  "size-7 p-0",
                  sportsTheme.button,
                  viewMode === mode && sportsTheme.active
                )}
                title={title}
              >
                <Icon className="size-3.5" />
              </Button>
            ))}
          </div>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className={cn(
              "size-7 p-0",
              sportsTheme.button
            )}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className={cn(
        "flex",
        viewMode === 'split' ? 'flex-row' : 'flex-col'
      )}>
        {/* Editor */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div
            ref={editorRef}
            contentEditable={!disabled}
            onInput={handleInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className={cn(
              "min-h-[400px] p-6 focus:outline-none",
              "prose prose-sm max-w-none",
              "prose-headings:mb-3 prose-headings:mt-4 prose-headings:font-semibold",
              "prose-p:mb-3 prose-p:leading-relaxed",
              "prose-strong:font-semibold",
              "prose-em:italic",
              "prose-blockquote:my-3 prose-blockquote:border-l-2 prose-blockquote:px-4 prose-blockquote:py-1",
              "prose-ol:list-decimal prose-ul:list-disc prose-li:mb-1",
              "prose-a:font-medium prose-a:underline-offset-2",
              "prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs",
              "prose-pre:my-3 prose-pre:rounded prose-pre:p-3",
              disabled && "cursor-not-allowed opacity-50",
              isRTL && "text-right",
              // Sports dark theme prose styles
              "dark:prose-invert",
              "prose-headings:text-orange-300",
              "prose-p:text-gray-300",
              "prose-strong:text-orange-200",
              "prose-em:text-orange-200",
              "prose-blockquote:border-orange-500 prose-blockquote:bg-gray-800",
              "prose-a:text-orange-400",
              "prose-code:bg-gray-800 prose-code:text-orange-300",
              "bg-gray-900 text-gray-100",
              viewMode === 'split' ? 'flex-1 border-r' : 'w-full',
              sportsTheme.border
            )}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            data-placeholder={placeholder}
            suppressContentEditableWarning
          />
        )}

        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={cn(
              "prose prose-sm min-h-[400px] max-w-none p-6",
              "prose-headings:mb-3 prose-headings:mt-4 prose-headings:font-semibold",
              "prose-p:mb-3 prose-p:leading-relaxed",
              "prose-strong:font-semibold",
              "prose-em:italic",
              "prose-blockquote:my-3 prose-blockquote:border-l-2 prose-blockquote:px-4 prose-blockquote:py-1",
              "prose-ol:list-decimal prose-ul:list-disc prose-li:mb-1",
              "prose-a:font-medium prose-a:underline-offset-2",
              "prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs",
              "prose-pre:my-3 prose-pre:rounded prose-pre:p-3",
              isRTL && "text-right",
              // Sports dark theme prose styles
              "dark:prose-invert",
              "prose-headings:text-orange-300",
              "prose-p:text-gray-300",
              "prose-blockquote:border-orange-500 prose-blockquote:bg-gray-800",
              "prose-a:text-orange-400",
              "prose-code:bg-gray-800",
              "bg-gray-800 text-gray-100",
              viewMode === 'split' ? 'flex-1' : 'w-full'
            )}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            dangerouslySetInnerHTML={{ __html: value || `<p class="text-gray-500">${placeholder}</p>` }}
          />
        )}
      </div>

      {/* Sports Status Bar */}
      <div className={cn(
        "flex items-center justify-between border-t px-4 py-2 text-xs",
        sportsTheme.status,
        sportsTheme.border
      )}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="size-3 text-orange-400" />
            <span>{charCount} characters</span>
          </div>
          <button
            onClick={clearFormatting}
            className="text-orange-300 transition-colors hover:text-orange-400"
          >
            Clear formatting
          </button>
        </div>
        
        <div className="text-orange-300">
          {viewMode === 'split' ? 'Split View' : viewMode === 'preview' ? 'Preview' : 'Edit Mode'}
        </div>
      </div>
    </div>
  );
}