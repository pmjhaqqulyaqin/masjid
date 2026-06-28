CREATE TABLE `account` (
	`id` varchar(255) NOT NULL,
	`accountId` varchar(255) NOT NULL,
	`providerId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`accessToken` varchar(255),
	`refreshToken` varchar(255),
	`idToken` varchar(255),
	`accessTokenExpiresAt` timestamp,
	`refreshTokenExpiresAt` timestamp,
	`scope` varchar(255),
	`password` varchar(255),
	`createdAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` varchar(5000) NOT NULL,
	`author` varchar(255),
	`image_url` varchar(255),
	`published_at` timestamp DEFAULT (now()),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `donations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255),
	`donor_name` varchar(255),
	`type` varchar(50) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`payment_method` varchar(50) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`proof_url` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `donations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `facilities` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`icon` varchar(50) NOT NULL,
	`description` varchar(1000),
	CONSTRAINT `facilities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `finances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` varchar(50) NOT NULL,
	`category` varchar(100) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`description` varchar(255),
	`date` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `finances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ibadah` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`prayer_type` varchar(50) NOT NULL,
	`time` timestamp NOT NULL,
	`imam_name` varchar(255),
	`muadzin_name` varchar(255),
	`khatib_name` varchar(255),
	`bilal_name` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ibadah_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kajian` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`ustadz_name` varchar(255) NOT NULL,
	`description` varchar(1000),
	`scheduled_at` timestamp NOT NULL,
	`live_stream_url` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `kajian_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`service_type` varchar(100) NOT NULL,
	`form_data` json NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL,
	`ipAddress` varchar(255),
	`userAgent` varchar(255),
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` varchar(255) NOT NULL,
	`value` varchar(1000) NOT NULL,
	CONSTRAINT `settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone_number` varchar(50),
	`phoneNumberVerified` boolean NOT NULL DEFAULT false,
	`emailVerified` boolean NOT NULL,
	`image` varchar(255),
	`role` varchar(50) NOT NULL DEFAULT 'jamaah',
	`createdAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(255) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `donations` ADD CONSTRAINT `donations_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;