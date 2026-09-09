import { notFound } from "next/navigation";
import { getBookById } from "@/services/books";
import BookGallery from "@/components/BookGallery/BookGallery";
import AddToCartButton from "@/components/AddToCartButton/AddToCartButton";
import styles from "./bookDetailsPage.module.css";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBookById(Number(id));

  if (!book) {
    notFound();
  }

  const images = book.images.length > 0
    ? book.images
    : [{ id: 0, url: "/images/no-book-cover.jpg" }];

  return (
    <main className={styles.content}>
      <BookGallery images={images} alt={`${book.author} - ${book.title}`} />

      <div className={styles.info}>
        <h1 className={styles.title}>{book.title}</h1>
        <p className={styles.author}>{book.author}</p>
        <p className={styles.price}>${book.price.toFixed(2)}</p>
        <AddToCartButton id={book.id} />
      </div>
    </main>
  );
}