export type Locale = 'ar' | 'en'

export const defaultLocale: Locale = 'ar'
export const locales: Locale[] = ['ar', 'en']

export const localeNames = {
  ar: 'العربية',
  en: 'English'
}

export const direction = {
  ar: 'rtl',
  en: 'ltr'
}

// Translation keys
export const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.blog': 'المدونة',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    
    // Blog
    'blog.featured': 'المقال المميز',
    'blog.recent': 'المقالات الحديثة',
    'blog.readMore': 'اقرأ المزيد',
    'blog.readTime': 'دقيقة للقراءة',
    'blog.by': 'بواسطة',
    'blog.published': 'نشر في',
    'blog.draft': 'مسودة',
    'blog.views': 'مشاهدات',
    'blog.share': 'شارك المقال',
    'blog.tags': 'الوسوم',
    'blog.related': 'مقالات ذات صلة',
    'blog.newsletter': 'النشرة البريدية',
    'blog.newsletter.title': 'ابقَ على اطلاع',
    'blog.newsletter.subtitle': 'اشترك للحصول على أحدث المقالات والتحديثات',
    'blog.newsletter.placeholder': 'ادخل بريدك الإلكتروني',
    'blog.newsletter.button': 'اشترك',
    'blog.search.placeholder': 'ابحث في المقالات...',
    'blog.search.clear': 'مسح البحث',
    'blog.noResults': 'لا توجد نتائج',
    'blog.noPosts': 'لا توجد مقالات بعد',
    
    // Comments
    'comments.title': 'التعليقات',
    'comments.leave': 'اترك تعليقاً',
    'comments.name': 'اسمك',
    'comments.email': 'بريدك الإلكتروني',
    'comments.message': 'رسالتك',
    'comments.submit': 'أضف التعليق',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'تم بنجاح',
    'common.back': 'رجوع',
    'common.bookmark': 'حفظ',
    'common.like': 'إعجاب',
    'common.copied': 'تم النسخ',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Blog
    'blog.featured': 'Featured Article',
    'blog.recent': 'Recent Articles',
    'blog.readMore': 'Read More',
    'blog.readTime': 'min read',
    'blog.by': 'By',
    'blog.published': 'Published on',
    'blog.draft': 'Draft',
    'blog.views': 'views',
    'blog.share': 'Share Article',
    'blog.tags': 'Tags',
    'blog.related': 'Related Articles',
    'blog.newsletter': 'Newsletter',
    'blog.newsletter.title': 'Stay Updated',
    'blog.newsletter.subtitle': 'Subscribe to get the latest articles and updates',
    'blog.newsletter.placeholder': 'Enter your email',
    'blog.newsletter.button': 'Subscribe',
    'blog.search.placeholder': 'Search articles...',
    'blog.search.clear': 'Clear search',
    'blog.noResults': 'No results found',
    'blog.noPosts': 'No posts yet',
    
    // Comments
    'comments.title': 'Comments',
    'comments.leave': 'Leave a comment',
    'comments.name': 'Your name',
    'comments.email': 'Your email',
    'comments.message': 'Your message',
    'comments.submit': 'Post Comment',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.success': 'Success',
    'common.back': 'Back',
    'common.bookmark': 'Bookmark',
    'common.like': 'Like',
    'common.copied': 'Copied',
  }
}