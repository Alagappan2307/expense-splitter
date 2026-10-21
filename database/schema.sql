-- =======================================================================
-- Database Schema for Expense Splitter with Debt Simplification
-- Department of Information Technology - College Project
-- MySQL 8.0+ Schema Definition & Indexing
-- =======================================================================

CREATE DATABASE IF NOT EXISTS `expensesplitter_db`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `expensesplitter_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Groups Table
CREATE TABLE IF NOT EXISTS `groups` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `description` VARCHAR(500),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Group Members (Join Table)
CREATE TABLE IF NOT EXISTS `group_members` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `group_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_group_member_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_group_member_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_group_user` (`group_id`, `user_id`),
    INDEX `idx_gm_group` (`group_id`),
    INDEX `idx_gm_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Expenses Table
CREATE TABLE IF NOT EXISTS `expenses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `group_id` BIGINT NOT NULL,
    `payer_id` BIGINT NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `expense_date` DATE NOT NULL,
    `split_method` VARCHAR(20) NOT NULL DEFAULT 'EQUAL',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_expense_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_expense_payer` FOREIGN KEY (`payer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_expense_group` (`group_id`),
    INDEX `idx_expense_payer` (`payer_id`),
    INDEX `idx_expense_date` (`expense_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Expense Shares Table
CREATE TABLE IF NOT EXISTS `expense_shares` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `expense_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `share_amount` DECIMAL(12, 2) NOT NULL,
    `percentage` DECIMAL(5, 2),
    CONSTRAINT `fk_share_expense` FOREIGN KEY (`expense_id`) REFERENCES `expenses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_share_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_share_expense` (`expense_id`),
    INDEX `idx_share_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Settlements Table
CREATE TABLE IF NOT EXISTS `settlements` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `group_id` BIGINT NOT NULL,
    `from_user_id` BIGINT NOT NULL,
    `to_user_id` BIGINT NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `settled_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `notes` VARCHAR(255),
    CONSTRAINT `fk_settlement_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_settlement_from_user` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_settlement_to_user` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_settlement_group` (`group_id`),
    INDEX `idx_settlement_from` (`from_user_id`),
    INDEX `idx_settlement_to` (`to_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Sample Demo Data
INSERT INTO `users` (`name`, `email`) VALUES
('Alagappan', 'alagappan@college.edu'),
('Arun', 'arun@college.edu'),
('Karthik', 'karthik@college.edu'),
('Kevin', 'kevin@college.edu');

INSERT INTO `groups` (`name`, `description`) VALUES
('FRIENDS', 'College hostel & travel expenses');

INSERT INTO `group_members` (`group_id`, `user_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);
