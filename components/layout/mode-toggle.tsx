"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/shared/icons"
import { cn } from "@/lib/utils"

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "size-9 p-0 transition-colors",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800",
            className
          )}
        >
          <div className="relative size-4">
            <Icons.sun className="absolute inset-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Icons.moon className="absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={cn(
            "flex cursor-pointer items-center gap-3",
            "hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800",
            theme === "light" && "bg-zinc-100 dark:bg-zinc-800"
          )}
        >
          <Icons.sun className="size-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={cn(
            "flex cursor-pointer items-center gap-3",
            "hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800",
            theme === "dark" && "bg-zinc-100 dark:bg-zinc-800"
          )}
        >
          <Icons.moon className="size-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={cn(
            "flex cursor-pointer items-center gap-3",
            "hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800",
            theme === "system" && "bg-zinc-100 dark:bg-zinc-800"
          )}
        >
          <Icons.laptop className="size-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}