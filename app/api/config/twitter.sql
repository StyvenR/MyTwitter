DROP DATABASE IF EXISTS twitter;
CREATE DATABASE twitter;
USE twitter;

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS follow;
DROP TABLE IF EXISTS tweet;
DROP TABLE IF EXISTS retweet;
DROP TABLE IF EXISTS hashtag;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS block_user;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS bookmark;
DROP TABLE IF EXISTS impression;
DROP TABLE IF EXISTS report;
DROP TABLE IF EXISTS community;
DROP TABLE IF EXISTS user_community;

CREATE TABLE `user` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `role` varchar(255) DEFAULT 'user',
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `username` varchar(255) UNIQUE NOT NULL,
  `display_name` varchar(255),
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthdate` date NOT NULL,
  `phone` varchar(255) NULL,
  `url` varchar(255) NULL,
  `biography` varchar(255) NULL,
  `city` varchar(255) NULL,
  `country` varchar(255) NULL,
  `genre` varchar(255) NULL,
  `picture` varchar(255) NULL,
  `header` varchar(255) NULL,
  `NSFW` boolean DEFAULT false,
  `is_active` boolean DEFAULT true NOT NULL,
  `is_verified` boolean DEFAULT false NOT NULL,
  `ban` varchar(255) DEFAULT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `verified_date` date DEFAULT NULL,
  `inactive_date` date DEFAULT NULL,
  `verification_code` varchar(6) NULL
);

CREATE TABLE `follow` (
  `id_user_follow` integer NOT NULL,
  `id_user_followed` integer NOT NULL,
  PRIMARY KEY (id_user_follow, id_user_followed), -- clé primaire composite
  FOREIGN KEY (id_user_follow) REFERENCES user(id),
  FOREIGN KEY (id_user_followed) REFERENCES user(id)
);

CREATE TABLE `block_user` (
  `id_user` integer NOT NULL,
  `id_blocked_user` integer NOT NULL,
  PRIMARY KEY (id_user, id_blocked_user), -- clé primaire composite
  FOREIGN KEY (id_user) REFERENCES user(id),
  FOREIGN KEY (id_blocked_user) REFERENCES user(id)
);

CREATE TABLE `tweet` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `id_user` integer NOT NULL,
  `reply_to` integer NULL,
  `quote_to` integer NULL,
  `NSFW` boolean DEFAULT false NOT NULL,
  `content` varchar(140) NOT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_pinned` boolean NOT NULL DEFAULT false,
  `is_community` boolean NOT NULL DEFAULT false,
  `media1` varchar(255) NULL,
  `media2` varchar(255) NULL,
  `media3` varchar(255) NULL,
  `media4` varchar(255) NULL,
  FOREIGN KEY (id_user) REFERENCES user(id),
  FOREIGN KEY (reply_to) REFERENCES tweet(id),
  FOREIGN KEY (quote_to) REFERENCES tweet(id)
);

CREATE TABLE `bookmark` (
  `id_tweet` integer NOT NULL,
  `id_user` integer NOT NULL,
  PRIMARY KEY (id_tweet, id_user), -- clé primaire composite
  FOREIGN KEY (id_user) REFERENCES user(id),
  FOREIGN KEY (id_tweet) REFERENCES tweet(id)
);

CREATE TABLE `impression` (
  `id_user` integer NOT NULL,
  `id_tweet` integer NOT NULL,
  PRIMARY KEY (id_user, id_tweet), -- clé primaire composite
  FOREIGN KEY (id_user) REFERENCES user(id),
  FOREIGN KEY (id_tweet) REFERENCES tweet(id)
);

CREATE TABLE `retweet` (
  `id_user` integer NOT NULL,
  `id_tweet` integer NOT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_user, id_tweet), -- clé primaire composite
  FOREIGN KEY (id_user) REFERENCES user(id),
  FOREIGN KEY (id_tweet) REFERENCES tweet(id)
);

CREATE TABLE `hashtag` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `report` (
  `id_tweet` integer NOT NULL,
  `id_user` integer NOT NULL,
  `description` varchar(255) DEFAULT null,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_tweet, id_user), -- clé primaire composite
  FOREIGN KEY (id_tweet) REFERENCES tweet(id),
  FOREIGN KEY (id_user) REFERENCES user(id)
);

CREATE TABLE `likes` (
  `id_user` integer NOT NULL,
  `id_tweet` integer NOT NULL,
  PRIMARY KEY (id_user, id_tweet), -- clé primaire composite
  FOREIGN KEY (id_user) REFERENCES user(id),
  FOREIGN KEY (id_tweet) REFERENCES tweet(id)
);

CREATE TABLE `message` (
  `id` integer PRIMARY KEY,
  `content` varchar(255) NOT NULL,
  `media` varchar(255) NULL,
  `id_sender` integer NOT NULL,
  `id_receiver` integer NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_hidden` boolean NOT NULL DEFAULT false,
  `is_viewed` boolean NOT NULL DEFAULT false,
  FOREIGN KEY (id_sender) REFERENCES user(id),
  FOREIGN KEY (id_receiver) REFERENCES user(id)
);

CREATE TABLE `community` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `biography` varchar(255),
  `id_creator` integer NOT NULL,
  `cover` varchar(255),
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_creator) REFERENCES user(id)
);

CREATE TABLE `user_community` (
  `id_community` integer NOT NULL,
  `id_user` integer NOT NULL,
  `role` varchar(255) DEFAULT 'user',
  PRIMARY KEY (id_community, id_user), -- clé primaire composite
  FOREIGN KEY (id_user) REFERENCES user(id),
  FOREIGN KEY (id_community) REFERENCES community(id)
);



INSERT INTO `user` (firstname, lastname, username, email, password, birthdate, display_name) 
VALUES 
('John', 'Doe', 'johndoe', 'john.doe@example.com', '604081c4e43c8fc4b7c8c03da55534a2ead5bb05', '1990-01-01', 'User_1'), 
('Jane', 'Smith', 'janesmith', 'jane.smith@example.com', '604081c4e43c8fc4b7c8c03da55534a2ead5bb05', '1992-02-02', 'User_2'),  -- password123
('Alice', 'Johnson', 'alicejohnson', 'alice.johnson@example.com', '604081c4e43c8fc4b7c8c03da55534a2ead5bb05', '1993-03-03', 'User_3'),  -- password123
('Bob', 'Brown', 'bobbrown', 'bob.brown@example.com', '604081c4e43c8fc4b7c8c03da55534a2ead5bb05', '1994-04-04', 'User_4'),  -- password123
('Charlie', 'Davis', 'charliedavis', 'charlie.davis@example.com', '604081c4e43c8fc4b7c8c03da55534a2ead5bb05', '1995-05-05', 'User_5'),  -- password123
('David', 'Miller', 'davidmiller', 'david.miller@example.com', '604081c4e43c8fc4b7c8c03da55534a2ead5bb05', '1996-06-06', 'User_6'),  -- password123
('Eve', 'Wilson', 'evewilson', 'eve.wilson@example.com', '604081c4e43c8fc4b7c8c03da55534a2ead5bb05', '1997-07-07', 'User_7'),  -- password123
('Frank', 'Moore', 'frankmoore', 'frank.moore@example.com', '604081c4e43c8fc4b7c8c03da55534a2ead5bb05', '1998-08-08', 'User_8'),  -- password123
('Grace', 'Taylor', 'gracetaylor', 'grace.taylor@example.com', '604081c4e43c8fc4b7c8c03da55534a2ead5bb05', '1999-09-09', 'User_9'),  -- password123
('Hank', 'Anderson', 'hankanderson', 'hank.anderson@example.com', '604081c4e43c8fc4b7c8c03da55534a2ead5bb05', '2000-10-10', 'User_10');  -- password123

INSERT INTO `tweet` (id_user, content, creation_date) VALUES
(1, 'Hello world!', '2023-01-01 10:00:00'),
(2, 'Just had a great lunch!', '2023-01-01 11:00:00'),
(3, 'Excited for the weekend!', '2023-01-01 12:00:00'),
(4, 'Loving the new features!', '2023-01-01 13:00:00'),
(5, 'Happy New Year!', '2023-01-01 14:00:00'),
(6, 'Working on a new project.', '2023-01-01 15:00:00'),
(7, 'Just finished a great book.', '2023-01-01 16:00:00'),
(8, 'Enjoying the sunny weather.', '2023-01-01 17:00:00'),
(9, 'Had a productive day!', '2023-01-01 18:00:00'),
(10, 'Looking forward to the holidays.', '2023-01-01 19:00:00'),
(1, 'Trying out a new recipe.', '2023-01-02 10:00:00'),
(2, 'Just watched a great movie.', '2023-01-02 11:00:00'),
(3, 'Feeling motivated today!', '2023-01-02 12:00:00'),
(4, 'Had a great workout.', '2023-01-02 13:00:00'),
(5, 'Learning something new.', '2023-01-02 14:00:00'),
(6, 'Spending time with family.', '2023-01-02 15:00:00'),
(7, 'Enjoying a cup of coffee.', '2023-01-02 16:00:00'),
(8, 'Planning my next trip.', '2023-01-02 17:00:00'),
(9, 'Feeling grateful.', '2023-01-02 18:00:00'),
(10, 'Starting a new hobby.', '2023-01-02 19:00:00');

INSERT INTO `likes` (id_user, id_tweet) VALUES
(1,1),
(2,1),
(3,1),
(4,1);


INSERT INTO `retweet` (id_user, id_tweet, creation_date) VALUES
(1, 2, '2023-01-01 11:30:00'),
(2, 2, '2023-01-01 11:45:00'),
(3, 2, '2023-01-01 12:30:00'),
(4, 2, '2023-01-01 12:45:00'),
(5, 4, '2023-01-01 13:30:00'),
(6, 4, '2023-01-01 13:45:00'),
(7, 5, '2023-01-01 14:30:00'),
(8, 5, '2023-01-01 14:45:00'),
(9, 6, '2023-01-01 15:30:00'),
(10, 6, '2023-01-01 15:45:00'),
(1, 7, '2023-01-01 16:30:00'),
(2, 7, '2023-01-01 16:45:00'),
(3, 8, '2023-01-01 17:30:00'),
(4, 4, '2023-01-01 17:45:00'),
(5, 8, '2023-01-01 18:30:00'),
(6, 8, '2023-01-01 18:45:00'),
(7, 10, '2023-01-01 19:30:00'),
(8, 10, '2023-01-01 19:45:00'),
(9, 1, '2023-01-02 10:30:00'),
(10, 1, '2023-01-02 10:45:00'),
(1, 12, '2023-01-02 11:30:00'),
(2, 12, '2023-01-02 11:45:00'),
(3, 13, '2023-01-02 12:30:00'),
(4, 13, '2023-01-02 12:45:00'),
(5, 14, '2023-01-02 13:30:00'),
(6, 14, '2023-01-02 13:45:00'),
(7, 15, '2023-01-02 14:30:00'),
(8, 6, '2023-01-02 14:45:00'),
(9, 10, '2023-01-02 15:30:00'),
(10, 7, '2023-01-02 15:45:00'),
(1, 17, '2023-01-02 16:30:00'),
(2, 17, '2023-01-02 16:45:00'),
(3, 18, '2023-01-02 17:30:00'),
(4, 18, '2023-01-02 17:45:00'),
(5, 19, '2023-01-02 18:30:00'),
(6, 19, '2023-01-02 18:45:00'),
(7, 20, '2023-01-02 19:30:00'),
(8, 20, '2023-01-02 19:45:00');