import SearchInput from "@/components/SearchInput/SearchInput";
import styles from "./booksPage.module.css";

import { getAuthors, getBooks, type GetBooksOptions } from "@/services/books";
import Filters from "@/components/Filters/Filters";
import BookCard from "@/components/BookCard/BookCard";

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
        <div className={styles.booksSection}>
          {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
              />
          ))}
        </div>
      </div>
    </div>
  );
}
