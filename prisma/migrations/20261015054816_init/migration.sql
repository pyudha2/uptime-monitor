-- CreateTable
CREATE TABLE `Monitor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Check` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `monitorId` INTEGER NOT NULL,
    `ip` BOOLEAN NOT NULL,
    `status` INTEGER NULL,
    `ms` INTEGER NULL,
    `at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Check_monitorId_at_idx`(`monitorId`, `at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Check` ADD CONSTRAINT `Check_monitorId_fkey` FOREIGN KEY (`monitorId`) REFERENCES `Monitor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
