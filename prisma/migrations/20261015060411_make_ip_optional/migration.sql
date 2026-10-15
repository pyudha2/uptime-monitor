/*
  Warnings:

  - You are about to alter the column `ip` on the `check` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `check` MODIFY `ip` VARCHAR(191) NULL;
