/*
  Warnings:

  - Made the column `artworkId` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "artworkId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Image_artworkId_idx" ON "Image"("artworkId");
