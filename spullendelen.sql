DROP DATABASE IF EXISTS `spullendelen`;
CREATE DATABASE `spullendelen`;
USE `spullendelen`;

--
-- Uncomment de volgende SQL statements om een user in de database te maken
-- Vanwege security mag je die user alleen in je lokale ontwikkeldatabase aanmaken!
-- Op een remote 'productie'-server moet je zorgen voor een ANDER useraccount!
-- Vanuit je (bv. nodejs) applicatie stel je de credentials daarvan in via environment variabelen.
--
-- spullendelenuser aanmaken
DROP USER 'spullendelenuser'@'%';
CREATE USER 'spullendelenuser'@'%' IDENTIFIED BY 'secret';
DROP USER 'spullendelenuser'@'localhost';
CREATE USER 'spullendelenuser'@'localhost' IDENTIFIED BY 'secret';

-- geef rechten aan deze user
GRANT SELECT, INSERT, DELETE, UPDATE ON `spullendelen`.* TO 'spullendelenuser'@'%';
GRANT SELECT, INSERT, DELETE, UPDATE ON `spullendelen`.* TO 'spullendelenuser'@'localhost';

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user` ;
CREATE TABLE IF NOT EXISTS `user` (
	`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`Voornaam` VARCHAR(32) NOT NULL,
	`Achternaam` VARCHAR(32) NOT NULL,
	`Email` VARCHAR(32) NOT NULL,
	`Password` CHAR(64) BINARY NOT NULL,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

-- Voorbeeld insert query. Wanneer je in Nodejs de ? variant gebruikt hoeven de '' niet om de waarden.
-- Zet die dan wel in het array er na, in de goede volgorde.
-- In je Nodejs app zou het password wel encrypted moeten worden.
INSERT INTO `user` (Voornaam, Achternaam, Email, Password) VALUES ('Jan', 'Smit', 'jsmit@server.nl', 'secret');

-- -----------------------------------------------------
-- Table `categorie`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `categorie` ;
CREATE TABLE IF NOT EXISTS `categorie` (
	`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`Naam` VARCHAR(32) NOT NULL,
	`Beschrijving` VARCHAR(256),
	`UserID` INT UNSIGNED NOT NULL,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

ALTER TABLE `categorie` 
ADD CONSTRAINT `fk_spullendelen_user`
FOREIGN KEY (`UserID`) REFERENCES `user` (`ID`)
ON DELETE NO ACTION
ON UPDATE CASCADE;

-- Voorbeeld insert query. Wanneer je in Nodejs de ? variant gebruikt hoeven de '' niet om de waarden.
INSERT INTO `categorie` (`Naam`, `Beschrijving`, `UserID`) VALUES ('Gereedschappen', 'Dingen en diensten die met gereedschappen te maken hebben.', 1);

-- -----------------------------------------------------
-- Table `spullen`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spullen` ;
CREATE TABLE IF NOT EXISTS `spullen` (
	`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`Naam` VARCHAR(32) NOT NULL,
	`Beschrijving` VARCHAR(256) NOT NULL,
	`Merk` VARCHAR(64) NOT NULL,
	`Soort` VARCHAR(32) NOT NULL,
	`Bouwjaar` INT UNSIGNED  NOT NULL,
	`UserID` INT UNSIGNED NOT NULL,
	`categorieID` INT UNSIGNED NOT NULL,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

ALTER TABLE `spullen` 
ADD CONSTRAINT `fk_spullen_user`
FOREIGN KEY (`UserID`) REFERENCES `user` (`ID`)
ON DELETE NO ACTION
ON UPDATE CASCADE
,
ADD CONSTRAINT `fk_spullen_categorie`
FOREIGN KEY (`categorieID`) REFERENCES `categorie` (`ID`)
ON DELETE NO ACTION
ON UPDATE CASCADE;

-- Voorbeeld insert query.
INSERT INTO `spullen` (Naam, Beschrijving, Merk, Soort, Bouwjaar, UserID, categorieID) VALUES 
('Heggeschaar', 'Prima heggeschaar, wordt veel te weinig gebruikt.', 'AEG', 'Electrisch', 2002, 1, 1),
('Boormachine', 'Klopboormachine, komt zelfs door beton.', 'Bosch', 'Klopboor', 20012, 1, 1);
-- Voorbeeld delete query
-- DELETE FROM `spullen` WHERE `Naam` = 'Boormachine';

SELECT * FROM `spullen`;

-- -----------------------------------------------------
-- Table `delers`
-- Bevat de users die spullen delen in een categorie.
-- 
-- -----------------------------------------------------
DROP TABLE IF EXISTS `delers` ;
CREATE TABLE IF NOT EXISTS `delers` (
	`UserID` INT UNSIGNED NOT NULL,
	`categorieID` INT UNSIGNED NOT NULL,
	`spullenID` INT UNSIGNED NOT NULL,
	PRIMARY KEY (`UserID`, `categorieID`, `spullenID`)
) 
ENGINE = InnoDB;

ALTER TABLE `delers` 
ADD CONSTRAINT `fk_delers_user`
FOREIGN KEY (`UserID`) REFERENCES `user` (`ID`)
ON DELETE NO ACTION
ON UPDATE CASCADE
,
ADD CONSTRAINT `fk_delers_categorie`
FOREIGN KEY (`categorieID`) REFERENCES `categorie` (`ID`)
ON DELETE NO ACTION
ON UPDATE CASCADE
,
ADD CONSTRAINT `fk_delers_spullen`
FOREIGN KEY (`spullenID`) REFERENCES `spullen` (`ID`)
ON DELETE NO ACTION
ON UPDATE CASCADE;

-- Voorbeeld insert query.
-- Let op: je kunt je maar 1 keer aanmelden voor een spullen in een huis.
-- Je kunt je natuurlijk wel afmelden en opnieuw aanmelden. .
INSERT INTO `delers` (UserID, categorieID, spullenID) VALUES (1, 1, 1);
-- Voorbeeld van afmelden:
DELETE FROM `delers` WHERE UserID = 1 AND categorieID = 1 AND spullenID = 1;
-- En opnieuw aanmelden:
INSERT INTO `delers` (UserID, categorieID, spullenID) VALUES (1, 1, 1);

-- -----------------------------------------------------
-- View om delers bij een spullen in een categorie in te zien.
-- 
-- -----------------------------------------------------
CREATE OR REPLACE VIEW `view_categorie` AS 
SELECT 
	`categorie`.`ID`,
	`categorie`.`Naam`,
	`categorie`.`Beschrijving`,
	CONCAT(`user`.`Voornaam`, ' ', `user`.`Achternaam`) AS `Beheerder`,
	`user`.`Email`
FROM `categorie`
LEFT JOIN `user` ON `categorie`.`UserID` = `user`.`ID`;

SELECT * FROM `view_categorie`;

-- -----------------------------------------------------
-- View om delers bij een spullen in een categorie in te zien.
-- 
-- -----------------------------------------------------
CREATE OR REPLACE VIEW `view_delers` AS 
SELECT 
	`delers`.`categorieID`,
	`delers`.`spullenID`,
	`user`.`Voornaam`,
	`user`.`Achternaam`,
	`user`.`Email`
FROM `delers`
LEFT JOIN `user` ON `delers`.`UserID` = `user`.`ID`;

-- Voorbeeldquery.
-- SELECT * from `view_delers` WHERE categorieID = 1 AND spullenID = 1; 
SELECT * from `view_delers`; 

