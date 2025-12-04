# Build Fix: URL Protocol Handling

## 🐛 Issue

The build was failing with the error:
```
[BetterAuthError]: Invalid base URL: roshnreit.com. Please provide a valid base URL.
```

**Root Cause**: The `NEXT_PUBLIC_APP_URL` environment variable was set to `roshnreit.com` without the protocol (`https://` or `http://`). Better Auth requires a complete URL with protocol.

## ✅ Solution

Added URL normalization functions that automatically add the protocol if missing:

### 1. **lib/auth.ts** - Better Auth Configuration
- Added `normalizeBaseURL()` function
- Automatically adds `https://` in production, `http://` in development
- Handles URLs without protocol: `roshnreit.com` → `https://roshnreit.com`

### 2. **lib/utils.ts** - absoluteUrl Function
- Updated to normalize URLs before use
- Ensures protocol is present
- Handles edge cases

### 3. **config/site.ts** - Site Configuration
- Added `normalizeSiteURL()` function
- Normalizes the site URL for OG images and metadata

### 4. **app/[locale]/(marketing)/page.tsx** - Home Page
- Added URL normalization for API calls
- Handles missing protocol in environment variables

## 🔧 How It Works

The normalization function:
1. Checks if URL starts with `http://` or `https://`
2. If not, adds `https://` in production or `http://` in development
3. Returns the normalized URL

**Example:**
```typescript
// Input: "roshnreit.com"
// Output (production): "https://roshnreit.com"
// Output (development): "http://roshnreit.com"
```

## 📝 Environment Variable

You can now set `NEXT_PUBLIC_APP_URL` in two ways:

**Option 1: With protocol (recommended)**
```env
NEXT_PUBLIC_APP_URL=https://roshnreit.com
```

**Option 2: Without protocol (auto-fixed)**
```env
NEXT_PUBLIC_APP_URL=roshnreit.com
```

Both will work correctly! The code will automatically add `https://` in production.

## ✅ Verification

The build should now succeed because:
- ✅ Better Auth receives a valid URL with protocol
- ✅ All URL usages are normalized
- ✅ Production defaults to HTTPS
- ✅ Development defaults to HTTP

## 🚀 Next Steps

1. **Set Environment Variable in Vercel:**
   - Go to your Vercel project settings
   - Add/Update: `NEXT_PUBLIC_APP_URL=roshnreit.com` (or `https://roshnreit.com`)
   - Redeploy

2. **Verify Build:**
   - The build should now complete successfully
   - Better Auth will receive: `https://roshnreit.com`

3. **Test Authentication:**
   - Verify login/logout works correctly
   - Check that redirects work properly

