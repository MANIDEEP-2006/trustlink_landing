CREATE TABLE `verificationLookup` (
	`id` int AUTO_INCREMENT NOT NULL,
	`verificationId` int NOT NULL,
	`userId` int NOT NULL,
	`verificationCode` varchar(50) NOT NULL,
	`userName` varchar(255) NOT NULL,
	`userEmail` varchar(320),
	`userPhone` varchar(20),
	`status` enum('verified','rejected','expired') NOT NULL DEFAULT 'verified',
	`trustScore` int,
	`documentType` varchar(50),
	`faceMatchScore` decimal(5,2),
	`fraudDetected` boolean DEFAULT false,
	`verifiedAt` timestamp,
	`expiresAt` timestamp,
	`scans` int DEFAULT 0,
	`lastScannedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verificationLookup_id` PRIMARY KEY(`id`),
	CONSTRAINT `verificationLookup_verificationCode_unique` UNIQUE(`verificationCode`)
);
--> statement-breakpoint
ALTER TABLE `qrCodes` ADD `verificationCode` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `phoneNumber` varchar(20);--> statement-breakpoint
ALTER TABLE `verifications` ADD `verificationCode` varchar(50);--> statement-breakpoint
ALTER TABLE `verifications` ADD `validityDays` int DEFAULT 365;--> statement-breakpoint
ALTER TABLE `verifications` ADD `expiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `qrCodes` ADD CONSTRAINT `qrCodes_verificationCode_unique` UNIQUE(`verificationCode`);--> statement-breakpoint
ALTER TABLE `verifications` ADD CONSTRAINT `verifications_verificationCode_unique` UNIQUE(`verificationCode`);