export default function BlogPostPage({ params }) {
  return (
    <main>
      <h1>Blog Post: {params.slug}</h1>
    </main>
  );
}
