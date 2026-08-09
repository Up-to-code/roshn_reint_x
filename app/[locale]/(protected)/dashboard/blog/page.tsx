import { BlogDashboard } from './components/BlogDashboard';
import { publishingModule } from '@/lib/publishing/publishing-module';

export default async function BlogEditorPage() {
  return <BlogDashboard initialPosts={await publishingModule.listEditor()} />;
}
