/*
  Warnings:

  - You are about to drop the column `artworkId` on the `Material` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_artworkId_fkey";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "artworkId";

-- CreateTable
CREATE TABLE "_ArtworkToMaterial" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArtworkToMaterial_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ArtworkToMaterial_B_index" ON "_ArtworkToMaterial"("B");

-- AddForeignKey
ALTER TABLE "_ArtworkToMaterial" ADD CONSTRAINT "_ArtworkToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtworkToMaterial" ADD CONSTRAINT "_ArtworkToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
