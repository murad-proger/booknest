"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./BookGallery.module.css";
import Lightbox from "./Lightbox";

type BookImage = {
  id: number;
  url: string;
};

type Props = {
  images: BookImage[];
  alt: string;
};

export default function BookGallery({ images, alt }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasMultiple = images.length > 1;
  const src = images[activeIndex]?.url ?? "/images/no-book-cover.jpg";

  const goPrev = () => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const goNext = () => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper} onClick={() => setLightboxOpen(true)}>
        <Image
          key={src}
          className={styles.mainImage}
          src={src}
          alt={alt}
          width={480}
          height={600}
        />

        <div className={styles.zoomOverlay}>
          <svg className={styles.zoomIcon} viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navPrev}`}
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navNext}`}
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={`${styles.thumbnail} ${index === activeIndex ? styles.thumbnailActive : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt=""
                width={64}
                height={80}
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={images}
          alt={alt}
          initialIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setActiveIndex}
        />
      )}
    </div>
  );
}