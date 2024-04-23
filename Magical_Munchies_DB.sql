-- ================================================================================

-- Group ID: Sec1-Gr11
-- [6588004] Napatkrit	Asavarojpanich
-- [6588025] Kaninpat	Janthasri
-- [6588037] Jirakit	Kanjanawaraporn
-- [6588058] Natchapol	Mingmahaphan
-- [6588086] Anavinn	Rujithanyapat

-- Selected Business Domain: Bakery
-- Name of Company: Anavinn-Cookie
-- Name of Bakery: Magical Munchies

-- ================================================================================

--
-- RESET: DATABASE
--
DROP DATABASE IF EXISTS `Magical_Munchies`;

-- ================================================================================

--
-- Database: `Magical_Munchies`
-- Description: Use to represent the Magical Munchies database
--
CREATE DATABASE IF NOT EXISTS `Magical_Munchies` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

--
-- Use Magical_Munchies schema
--
USE `Magical_Munchies`;

-- ================================================================================

--
-- Table structure for table `Admin`
--
CREATE TABLE IF NOT EXISTS `Admin` (
    
    `AdminID` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `Fname` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `Lname` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `Proficiency` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `IG` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `PhotoPath` VARCHAR(255) NOT NULL,
    `DOB` DATE,
    `CreatedDate` DATETIME
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Auto assign 'CreatedDate' for Table 'Admin'
--
DELIMITER //

CREATE TRIGGER before_admin_insert
BEFORE INSERT ON `Admin`
FOR EACH ROW
BEGIN
    SET NEW.CreatedDate = NOW();
END;
//

DELIMITER ;


--
-- Dumping data for table 'Admin'
--
INSERT INTO `Admin` (`Fname`, `Lname`, `Proficiency`, `IG`, `PhotoPath`, `DOB`) VALUES
('Napatkrit', 'Asavarojpanich', 'Master of History of Magic', '@napatkrit', '/Image/AdminImage/Kung.png', '2003-11-10'),
('Kaninpat', 'Janthasri', 'Master of Care of Magical Creatures', '@k.n_jt', '/Image/AdminImage/Kan.png', '2003-10-17'),
('Jirakit', 'Kanjanawaraporn', 'Master of Charms', '@barbell_jirakit', '/Image/AdminImage/Barbell.png', '2005-07-04'),
('Natchapol', 'Mingmahaphan', 'Master of Defense Against the Dark Arts', '@nnatcha.g', '/Image/AdminImage/Golf.png', '2004-09-13'),
('Anavinn', 'Rujithanyapat', 'Master of Herbology', '@taiyou.son', '/Image/AdminImage/Son.png', '2004-02-01');

--
-- Table structure for table `LoginInformation`
--
CREATE TABLE IF NOT EXISTS `LoginInformation` (

  `AdminID` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `Username` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  
  FOREIGN KEY `LoginInformation`(`AdminID`) REFERENCES `Admin`(`AdminID`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- SELECT * FROM `Admin`;

--
-- Dumping data for table `LoginInformation`
--
INSERT INTO `LoginInformation` (`Username`, `Password`) VALUES
('Napatkrit Asavarojpanich', '1234'),
('Kaninpat Janthasri', '1234'),
('Jirakit Kanjanawaraporn', '1234'),
('Natchapol Mingmahaphan', '1234'),
('Anavinn Rujithanyapat', '1234');

-- SELECT * FROM `LoginInformation`;

--
-- Table structure for table `Product`
--
CREATE TABLE IF NOT EXISTS `Product` (
    `ProductID` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `Name` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `Flavor` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `Detail` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `Price` DECIMAL(8, 2) NOT NULL,
    `PhotoPath` VARCHAR(255) NOT NULL,
    `CreatedDate` DATETIME,
    `UpdatedDate` DATETIME,
    CONSTRAINT chk_price CHECK (Price >= 0)
);

-- Change delimiter
DELIMITER //

-- Trigger to set CreatedDate as the first time the data is added
CREATE TRIGGER before_product_insert
BEFORE INSERT ON `Product`
FOR EACH ROW
BEGIN
    SET NEW.CreatedDate = NOW();
    SET NEW.UpdatedDate = NOW();
END;
//

-- Trigger to set UpdatedDate as the datetime the data is modified
CREATE TRIGGER before_product_update
BEFORE UPDATE ON `Product`
FOR EACH ROW
BEGIN
    SET NEW.UpdatedDate = NOW();
END;
//

-- Reset delimiter
DELIMITER ;

--
-- Dumping data for table `Product`
--
INSERT INTO `Product` (`Name`, `Flavor`, `Detail`, `Price`, `PhotoPath`) VALUES
('Midnight Rain', 'Dark chocolate', 'Dark chocolate and lavender blend harmoniously to create a rich and soothing flavor reminiscent of a gentle rainfall at midnight.', 3.99, '/Image/ProductImage/Midnight_Rain.png'),
('Sunshine', 'Tangy lemon zest', 'Tangy lemon zest and vibrant orange combine to create a burst of sunshine in every bite, uplifting your spirits and refreshing your palate.', 2.49, '/Image/ProductImage/Sunshine.png'),
('Dragon’s Breath', 'Spicy Cinnamon', 'Spicy cinnamon and smoky chili pepper intertwine to create a dragon-worthy concoction that leaves a lingering warmth on the tongue.', 4.49, '/Image/ProductImage/Dragon\'s_Breath.png'),
('Lamentation Labyrinth', 'Rich dark chocolate', 'Rich dark chocolate infused with hints of blackberry and rosemary creates a complex and enchanting flavor profile that beckons you deeper into the labyrinth of taste.', 2.99, '/Image/ProductImage/Lamentation_Labyrinth.png'),
('Enchanted Forest', 'Matcha green tea', 'Earthy matcha green tea and delicate mint intertwine to create a refreshing and rejuvenating flavor reminiscent of a walk through the enchanted woods.', 3.29, '/Image/ProductImage/Enchanted_Forest.png'),
('La Vie En Rose', 'Delicate rose petals', 'Delicate rose petals and sweet lychee come together in a floral symphony that evokes the romance and elegance of a Parisian garden in full bloom.', 4.49, '/Image/ProductImage/La_Vie_En_Rose.png'),
('Bejeweled', 'Exotic fruit', 'Exotic fruits such as mango, pineapple, and passionfruit combine to create a vibrant and tropical flavor profile that dazzles the palate with every sip.', 3.79, '/Image/ProductImage/Bejeweled.png'),
('SugarRush', 'Decarent caramel', 'Decadent caramel and creamy vanilla swirl together in a whirlwind of sweetness that sends your taste buds soaring to new heights of bliss.', 2.79, '/Image/ProductImage/SugarRush.png'),
('Summer Paradise', 'Juicy pineapple', 'Juicy pineapple and coconut cream blend seamlessly to create a tropical oasis of flavor that transports you to sun-drenched beaches and crystal-clear waters.', 4.29, '/Image/ProductImage/Summer_Paradise.png');

SELECT * FROM Product WHERE ProductID=1;
-- SELECT * FROM LoginInformation WHERE Username = "Natchapol Mingmahaphan" AND Password = "1234"

-- ================================================================================