# Next.js

## 1. NextJS Essentials

### notFound() Method

The `notFound()` is a built-in Next.js function that allows you to programmatically render a 404 (Not Found) error page. This function is particularly useful when you need to handle dynamic routes or conditional rendering scenarios where requested content doesn't exist.

#### How It Works

- **Location**: The `notFound()` function is imported from the `'next/navigation'` module
- **Purpose**: It triggers the rendering of your custom `not-found.js` component instead of the default error page
- **Usage**: Call `notFound()` in a Server Component when a resource cannot be found (e.g., when a database query returns no results)

#### Example Usage

```javascript
// app/posts/[id]/page.js
import { notFound } from 'next/navigation';

export default function PostPage({ params }) {
  const post = getPost(params.id); // Hypothetical function
  
  if (!post) {
    notFound(); // Renders the not-found.js page
  }
  
  return <div>{post.title}</div>;
}
```

#### Key Points

- `notFound()` is a **throw-like function** - it immediately stops rendering and delegates to the nearest `not-found.js` component
- It only works in **Server Components**, not in Client Components
- Each route segment can have its own `not-found.js` file in the directory structure
- The `not-found.js` file must export a default component
- This is the preferred way to handle 404 scenarios in Next.js 13+ (App Router)