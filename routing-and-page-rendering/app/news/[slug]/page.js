import { DUMMY_NEWS } from "@/dummy-new";

export default function NewsDetailPage({ params }) {
  const newsDetail = DUMMY_NEWS.find((news) => news.slug === params.slug);
  return (
    <article className='news-article'>
      <header>
        <img src={`/images/news/${newsDetail.image}`} alt={newsDetail.title} />
        <h1>{newsDetail.title}</h1>
        <time dateTime={newsDetail.date}>{newsDetail.date}</time>
      </header>
      <p>{newsDetail.content}</p>
    </article>
  );
}
