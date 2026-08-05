import SearchInput from "@/сomponents/SearchInput/SearchInput";
import styles from "./booksPage.module.css";

import { getAuthors, getBooks, type GetBooksOptions } from "@/services/books";
import Filters from "@/сomponents/Filters/Filters";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<GetBooksOptions>;
}) {
  const {
    search,
    sort,
    authors,
    priceMin,
    priceMax,
  } = await searchParams;

  const [books, authorsList] = await Promise.all([
    getBooks({
      search,
      sort,
      authors,
      priceMin,
      priceMax,
    }),
    getAuthors()
  ])

  return (
    <div className={styles.bookPage}>
      <h1>
        BoksPage
      </h1>
      <SearchInput />
      <div className={styles.content}>
        <Filters authors={authorsList} />
        <section>
          <h2>All books:</h2>
          <div className={styles.booksSection}>
            {books.map((book) => (
              <div className="book" key={book.id}>
                <img
                  src={
                    book.img
                      ? book.img
                      : "https://img.freepik.com/premium-vector/blank-cover-book-magazine-template_212889-605.jpg"
                  }
                  alt={`${book.author} - ${book.title}`}
                  width={100}
                  height={150}
                />
                <div>title: {book.title}</div>
                <div>author: {book.author}</div>
                <div>price: {book.price}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
