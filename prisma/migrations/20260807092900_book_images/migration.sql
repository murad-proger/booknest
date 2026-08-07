/*
  Warnings:

  - You are about to drop the column `img` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "img";

-- CreateTable
CREATE TABLE "BookImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "BookImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookImage" ADD CONSTRAINT "BookImage_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
