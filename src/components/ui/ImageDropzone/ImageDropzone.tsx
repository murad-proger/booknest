"use client";

import { useEffect, useMemo, useRef, useState, DragEvent, ChangeEvent } from "react";
import styles from "./ImageDropzone.module.css";

type ImageDropzoneProps = {
  files: File[];
  onChange: (files: File[]) => void;
  name?: string;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  hint?: string;
};

function isSameFile(a: File, b: File) {
  return (
    a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
  );
}

export default function ImageDropzone({
  files,
  onChange,
  name,
  multiple = true,
  accept = "image/*",
  disabled = false,
  hint = "Drag & drop images here, or click to browse",
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!name || !inputRef.current) return;

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    inputRef.current.files = dataTransfer.files;
  }, [files, name]);

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const addFiles = (incoming: FileList | File[]) => {
    if (disabled) return;

    const incomingImages = Array.from(incoming).filter((file) =>
      file.type.startsWith("image/")
    );

    if (incomingImages.length === 0) return;

    if (!multiple) {
      onChange(incomingImages.slice(0, 1));
      return;
    }

    const uniqueIncoming = incomingImages.filter(
      (file) => !files.some((existing) => isSameFile(existing, file))
    );

    onChange([...files, ...uniqueIncoming]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      addFiles(event.target.files);
    }
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={[
          styles.dropzone,
          isDragging ? styles.dragging : "",
          disabled ? styles.disabled : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <span className={styles.hint}>{hint}</span>
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className={styles.nativeInput}
          onChange={handleInputChange}
        />
      </div>

      {files.length > 0 && (
        <div className={styles.previews}>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className={styles.previewWrapper}
            >
              {/* Local blob preview: next/image is not needed here */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previews[index]}
                alt={file.name}
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove(index)}
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
