import styles from "./booksPage.module.css"

import { getBooks } from "@/lib/books" 

export default async function BooksPage () {
  const options = {}
  const books = await getBooks(options)

  return (
    <>
      <h1>
        BoksPage
      </h1>
      <section>
        <h2>
          All books:
        </h2>
        <div
          className={styles.booksSection}
        >
          {
            books.map(book => (
              <div
                className="book"
                key={book.id}
              >
                <img
                  src={book.img ? book.img : 'https://img.freepik.com/premium-vector/blank-cover-book-magazine-template_212889-605.jpg'}
                  alt={`${book.author} - ${book.title}`}
                    width={100}
                    height={150}
                />
                <div>title: {book.title}</div>
                <div>author: {book.author}</div>
                <div>price: {book.price}</div>
              </div>
            ))
          }
        </div>
      </section>
    </>
  )
}