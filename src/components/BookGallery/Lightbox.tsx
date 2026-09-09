"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import styles from "./Lightbox.module.css";

type BookImage = {
  id: number;
  url: string;
};

type Props = {
  images: BookImage[];
  alt: string;
  initialIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
};

export default function Lightbox({ images, alt, initialIndex, onClose, onIndexChange }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const hasMultiple = images.length > 1;

  const goTo = (next: number) => {
    const normalized = (next + images.length) % images.length;
    setIndex(normalized);
    onIndexChange?.(normalized);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index]);

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-describedby={undefined}>
          <Dialog.Title className={styles.srOnly}>{alt}</Dialog.Title>

          <Dialog.Close className={styles.closeButton} aria-label="Close">
            ×
          </Dialog.Close>

          <div className={styles.imageWrapper}>
            <Image
              key={images[index].url}
              src={images[index].url}
              alt={alt}
              fill
              className={styles.image}
              sizes="100vw"
            />
          </div>

          {hasMultiple && (
            <>
              <button type="button" className={`${styles.navButton} ${styles.navPrev}`} onClick={() => goTo(index - 1)} aria-label="Previous image">‹</button>
              <button type="button" className={`${styles.navButton} ${styles.navNext}`} onClick={() => goTo(index + 1)} aria-label="Next image">›</button>
              <div className={styles.counter}>{index + 1} / {images.length}</div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}