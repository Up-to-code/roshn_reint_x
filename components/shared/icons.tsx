import {
  Flame,
  LineChart,
  Laptop,
  Home,
  HelpCircle,
  MoreVertical,
  LayoutPanelLeft,
  Copy,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  ArrowRight,
  Plus,
  X,
  Check,
  MessagesSquare,
  Moon,
  SunMedium,
  Loader2,
  Settings,
  Trash2,
  User,
  Briefcase,
  AlertTriangle,
  Search,
  FileText,
  Package,
  File,
  Image,
  Globe,
  Building,
  Users,
} from "lucide-react";
import { LucideProps } from "lucide-react";

export type IconName =
  | "add"
  | "plus"
  | "arrowRight"
  | "arrowUpRight"
  | "chevronLeft"
  | "chevronRight"
  | "bookOpen"
  | "check"
  | "close"
  | "copy"
  | "dashboard"
  | "ellipsis"
  | "gitHub"
  | "google"
  | "help"
  | "home"
  | "laptop"
  | "lineChart"
  | "logo"
  | "media" // 🔹 Media
  | "messages"
  | "moon"
  | "page"
  | "package"
  | "post"
  | "briefcase"
  | "blog" // 🔹 Blog
  | "search"
  | "settings"
  | "spinner"
  | "sun"
  | "trash"
  | "user"
  | "warning"
  | "global"
  | "building"
   | "users"

export const Icons: Record<IconName, React.FC<LucideProps>> = {
  add: Plus,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  bookOpen: BookOpen,
  check: Check,
  close: X,
  copy: Copy,
  dashboard: LayoutPanelLeft,
  ellipsis: MoreVertical,
  gitHub: ({ ...props }) => <svg {...props}></svg>, // placeholder
  google: ({ ...props }) => <svg {...props}></svg>, // placeholder
  help: HelpCircle,
  home: Home,
  laptop: Laptop,
  lineChart: LineChart,
  logo: Flame,
  media: Image, // 🔹 Media
  messages: MessagesSquare,
  moon: Moon,
  page: File,
  package: Package,
  post: FileText,
  briefcase: Briefcase,
  blog: FileText, // 🔹 Blog uses FileText icon
  search: Search,
  settings: Settings,
  spinner: Loader2,
  sun: SunMedium,
  trash: Trash2,
  user: User,
  warning: AlertTriangle,
  global: Globe,
  building: Building,
  plus: Plus,
  users: Users,
};
