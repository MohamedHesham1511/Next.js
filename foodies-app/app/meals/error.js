"use client";

export default function ErrorPage({ error }) {
  return (
    <main className='error'>
      <h1>An error occurred!</h1>
      <p>{error.message}</p>
    </main>
  );
}
