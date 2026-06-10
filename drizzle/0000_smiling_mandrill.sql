CREATE TABLE `adminLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`targetType` varchar(50),
	`targetId` int,
	`details` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`verificationId` int NOT NULL,
	`userId` int NOT NULL,
	`documentType` varchar(50) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` int,
	`mimeType` varchar(50),
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fraudDetectionResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`verificationId` int NOT NULL,
	`documentId` int,
	`isFraudulent` boolean DEFAULT false,
	`fraudType` varchar(100),
	`confidence` decimal(5,2),
	`detectedIssues` longtext,
	`recommendations` text,
	`analyzedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fraudDetectionResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ocrResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`verificationId` int NOT NULL,
	`fullName` varchar(255),
	`dateOfBirth` varchar(50),
	`documentNumber` varchar(100),
	`expiryDate` varchar(50),
	`issuingCountry` varchar(100),
	`gender` varchar(20),
	`address` text,
	`extractedData` longtext,
	`confidence` decimal(5,2),
	`processedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ocrResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qrCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`verificationId` int NOT NULL,
	`userId` int NOT NULL,
	`qrCodeData` text NOT NULL,
	`qrCodeUrl` text,
	`expiresAt` timestamp,
	`scans` int DEFAULT 0,
	`lastScannedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `qrCodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `selfies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`verificationId` int NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` int,
	`mimeType` varchar(50),
	`faceEmbedding` longtext,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `selfies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trustScoreBreakdown` (
	`id` int AUTO_INCREMENT NOT NULL,
	`verificationId` int NOT NULL,
	`documentQualityScore` int,
	`ocrAccuracyScore` int,
	`faceMatchScore` int,
	`fraudDetectionScore` int,
	`documentValidityScore` int,
	`totalTrustScore` int,
	`calculatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trustScoreBreakdown_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `verificationHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`verificationId` int NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`details` text,
	`ipAddress` varchar(50),
	`userAgent` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verificationHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('pending','processing','verified','rejected','failed') NOT NULL DEFAULT 'pending',
	`trustScore` int DEFAULT 0,
	`documentType` varchar(50),
	`faceMatchScore` decimal(5,2),
	`fraudDetectionResult` varchar(50),
	`fraudConfidence` decimal(5,2),
	`ocrData` longtext,
	`qrCode` text,
	`verificationId` varchar(100),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `verifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `verifications_verificationId_unique` UNIQUE(`verificationId`)
);
