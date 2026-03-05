# Next.js

## 1. NextJS Essentials

### 1.1 notFound() Method

The `notFound()` is a built-in Next.js function that allows you to programmatically render a 404 (Not Found) error page. This function is particularly useful when you need to handle dynamic routes or conditional rendering scenarios where requested content doesn't exist.

#### How It Works

- **Location**: The `notFound()` function is imported from the `'next/navigation'` module
- **Purpose**: It triggers the rendering of your custom `not-found.js` component instead of the default error page
- **Usage**: Call `notFound()` in a Server Component when a resource cannot be found (e.g., when a database query returns no results)

#### Example Usage

```javascript
// app/posts/[id]/page.js
import { notFound } from "next/navigation";

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

---

### 1.2 Server Actions

Server Actions are asynchronous functions that run **exclusively on the server**. They allow you to perform data mutations (e.g., form submissions, database writes) directly from Server or Client Components without manually creating API endpoints.

#### How They Get Executed

1. **Definition**: A Server Action is defined by adding the `"use server"` directive either at the top of an `async` function or at the top of a file (to mark all exports in that file as Server Actions).
2. **Invocation from a form**: When used as a `<form>` `action`, Next.js intercepts the form submission, serializes the form data, and sends it to the server over an HTTP `POST` request — no page reload required.
3. **Invocation from client code**: Can also be called directly as a regular async function from a Client Component (e.g., in an event handler).
4. **Execution**: Next.js executes the function on the server, giving it full access to server-only resources (databases, file system, environment variables).
5. **Response**: After execution, Next.js can revalidate cached data and return a response back to the client.

#### Defining a Server Action

**Inline in a Server Component:**

```javascript
// app/meals/share/page.js
export default function ShareMealPage() {
  async function shareMeal(formData) {
    "use server"; // marks this function as a Server Action

    const meal = {
      title: formData.get("title"),
      summary: formData.get("summary"),
      instructions: formData.get("instructions"),
    };

    await saveMeal(meal); // runs on the server
  }

  return <form action={shareMeal}>...</form>;
}
```

**In a separate file (recommended for reuse):**

```javascript
// lib/actions.js
"use server"; // all exports in this file are Server Actions

export async function shareMeal(formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
  };

  await saveMeal(meal);
}
```

#### Revalidating Data After a Mutation

After a Server Action mutates data, use `revalidatePath()` to tell Next.js to clear the cache for a specific route so users see fresh data:

```javascript
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function shareMeal(formData) {
  "use server";

  await saveMeal(formData);

  revalidatePath("/meals"); // clears the cache for /meals
  redirect("/meals"); // redirects the user after success
}
```

#### Key Points

- Server Actions require the `"use server"` directive — either per-function or per-file
- They can be used in both **Server Components** (inline) and **Client Components** (imported from a `"use server"` file)
- They have access to **server-only resources**: databases, environment variables, the file system
- Next.js automatically creates a secure **POST endpoint** behind the scenes — you never write the API route manually
- Always **validate and sanitize** input inside a Server Action before using it, as it is a public HTTP endpoint

---

## 2. Routing and Page Rendering

### 2.1 Parallel Routes

Parallel Routes allow you to simultaneously render multiple pages (or "slots") within the same layout. This is useful for building complex UIs like dashboards, modals, or split-screen views where different sections of the page load and update independently.

#### How It Works

Parallel Routes use a special folder convention called **named slots**, defined with the `@` prefix (e.g., `@analytics`, `@team`). Each slot is passed as a prop to the parent layout and rendered independently.

```
app/
  layout.js          ← receives @analytics and @team as props
  page.js
  @analytics/
    page.js          ← rendered in the "analytics" slot
  @team/
    page.js          ← rendered in the "team" slot
```

#### Defining Parallel Routes

**Parent layout receiving slots as props:**

```javascript
// app/layout.js
export default function DashboardLayout({ children, analytics, team }) {
  return (
    <div>
      <div>{children}</div>
      <div>{analytics}</div> {/* renders @analytics/page.js */}
      <div>{team}</div> {/* renders @team/page.js */}
    </div>
  );
}
```

**Each slot is a normal Next.js page:**

```javascript
// app/@analytics/page.js
export default function AnalyticsPage() {
  return <div>Analytics Dashboard</div>;
}
```

#### Benefits

- **Independent loading & streaming**: Each slot can have its own `loading.js` and `error.js`, so one section loading slowly doesn't block others.
- **Conditional rendering**: Slots can be shown or hidden based on authentication state or other conditions without changing the URL.
- **Parallel data fetching**: Each slot fetches its own data independently, improving page performance.
- **Soft navigation**: Navigating within one slot does not affect the other slots — they retain their state.
- **Modal / intercept patterns**: Parallel Routes combine with Intercepting Routes to build URL-addressable modals (e.g., opening a photo in a modal while the background page stays visible).

#### Key Points

- Slot folders (`@slotName`) are **not part of the URL** — they are purely a layout convention
- Each slot must have a `default.js` file as a fallback for when Next.js cannot determine the active state of a slot (e.g., on a hard navigation)
- Parallel Routes work only within the **App Router** (Next.js 13+)
- You can combine them with **Intercepting Routes** (`(.)`, `(..)`) for advanced modal and overlay patterns

---

### 2.2 default.js

The `default.js` file is a special Next.js file that acts as a **fallback UI for a parallel route slot** when Next.js cannot determine which page to render in that slot — most commonly during a full page (hard) navigation.

#### The Problem It Solves

With Parallel Routes, Next.js tracks the active page for each slot during **soft navigations** (client-side route changes). However, on a **hard navigation** (full browser refresh or direct URL visit), Next.js loses that sub-navigation state and cannot match a slot to a specific page. Without a `default.js`, Next.js will render a **404** for the unmatched slot and break the entire layout.

`default.js` prevents this by providing a safe fallback to render instead.

#### How It Works

```
app/
  layout.js
  page.js
  @analytics/
    page.js
    default.js     ← fallback rendered when slot state is unknown
  @team/
    page.js
    [memberId]/
      page.js      ← nested route inside the slot
                   ← no default.js — will cause a 404 on hard navigation
```

When a user visits a URL directly (hard navigation):

1. Next.js renders the root `page.js` for the `children` prop.
2. For each named slot (`@analytics`, `@team`), Next.js checks if there is a matching page for the current URL.
3. If no match is found, it falls back to that slot's `default.js` instead of throwing a 404.

#### Example

```javascript
// app/@analytics/default.js
export default function AnalyticsDefault() {
  // Render a sensible default — could be the same as page.js,
  // a placeholder, or null to render nothing
  return <div>Analytics Overview (default)</div>;
}
```

```javascript
// app/@team/[memberId]/page.js
export default function TeamMemberPage({ params }) {
  return <div>Team Member: {params.memberId}</div>;
  // nested route inside the slot — accessible via soft navigation
  // but on a hard navigation to /some-url, Next.js cannot match this slot
  // and will throw a 404 because there is no default.js fallback
}
```

#### Connection to Parallel Routes

| Scenario                           | Slot         | What Next.js renders                     |
| ---------------------------------- | ------------ | ---------------------------------------- |
| Soft navigation (client-side)      | `@analytics` | The matched `page.js` for the navigation |
| Soft navigation (client-side)      | `@team`      | The matched `page.js` for the navigation |
| Hard navigation / direct URL visit | `@analytics` | `default.js` (fallback) — renders safely |
| Hard navigation / direct URL visit | `@team`      | No `default.js` found → **404 error**    |

`default.js` is essentially the **safety net** of Parallel Routes. Without it, any hard navigation to a route that uses parallel slots will break. It is considered best practice to always add a `default.js` to every `@slot` folder.

#### Key Points

- `default.js` is **only relevant for Parallel Route slots** — it has no effect in regular route segments
- Its content can mirror `page.js`, show a skeleton/placeholder, or simply `return null`
- It is evaluated on **hard navigations and full-page loads only**; soft navigations always use the matched slot page
- Think of it as the parallel-routes equivalent of a `404` safety fallback, but instead of an error it renders graceful content

---

### 2.3 Catch-All and Optional Catch-All (Fallback) Routes

Next.js supports two special dynamic segment conventions that let a single `page.js` file match an **arbitrary number of URL segments**.

#### Catch-All Routes — `[...slug]`

Created by naming a folder `[...slug]`. Matches **one or more** path segments after the base path. The matched segments are available as an array on `params.slug`.

```
app/
  docs/
    [...slug]/
      page.js    ← matches /docs/a, /docs/a/b, /docs/a/b/c, …
```

```javascript
// app/docs/[...slug]/page.js
export default function DocsPage({ params }) {
  // params.slug is an array, e.g. ['a', 'b', 'c'] for /docs/a/b/c
  return <div>Docs: {params.slug.join(" / ")}</div>;
}
```

> `/docs` itself is **not** matched — it requires at least one segment.

#### Optional Catch-All Routes (Fallback) — `[[...slug]]`

Created by wrapping the folder name in **double square brackets**: `[[...slug]]`. Works exactly like `[...slug]` but also matches the **base path with zero segments**.

```
app/
  docs/
    [[...slug]]/
      page.js    ← matches /docs, /docs/a, /docs/a/b, …
```

```javascript
// app/docs/[[...slug]]/page.js
export default function DocsPage({ params }) {
  // params.slug is undefined when visiting /docs (no segments)
  // params.slug is ['a', 'b'] when visiting /docs/a/b
  const segments = params.slug ?? [];
  return <div>Docs: {segments.length ? segments.join(" / ") : "Home"}</div>;
}
```

#### Why Use Catch-All / Optional Catch-All Routes?

| Use case                                                          | Recommended convention |
| ----------------------------------------------------------------- | ---------------------- |
| Documentation pages (`/docs/guide/intro`)                         | `[...slug]`            |
| CMS or blog with deeply nested categories                         | `[...slug]`            |
| A single entry-point page that also handles its own root URL      | `[[...slug]]`          |
| Internationalized routes where the locale prefix is optional      | `[[...slug]]`          |
| Catch-all 404 fallback — handle any unmatched path under a prefix | `[[...slug]]`          |

The **optional** variant (`[[...slug]]`) is commonly called a **fallback route** because it acts as a single catch-all handler for an entire URL subtree, including the root, without needing a separate `page.js` one level up.

#### Key Points

- `params.slug` is always an **array of strings** for `[...slug]`, and **`undefined`** (not an empty array) for `[[...slug]]` when no segments are present — always guard with `?? []`
- Both conventions work in the **App Router** (Next.js 13+) and the legacy **Pages Router** (`pages/docs/[...slug].js`)
- More specific static or dynamic routes always take **priority** over catch-all segments: `/docs/intro` matches `docs/intro/page.js` before `docs/[...slug]/page.js`
- You cannot have both `[...slug]` and `[[...slug]]` under the same parent — they would conflict
