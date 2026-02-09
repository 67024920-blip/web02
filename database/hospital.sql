-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.14.0.7170
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for hospital
DROP DATABASE IF EXISTS `hospital`;
CREATE DATABASE IF NOT EXISTS `hospital` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `hospital`;

-- Dumping structure for table hospital.allergy
DROP TABLE IF EXISTS `allergy`;
CREATE TABLE IF NOT EXISTS `allergy` (
  `HN` varchar(50) DEFAULT NULL,
  `drugID` varchar(50) DEFAULT NULL,
  `Reaction` varchar(50) DEFAULT NULL,
  `Severity` varchar(50) DEFAULT NULL,
  KEY `FK_allergy_drug` (`drugID`),
  KEY `FK_allergy_petient` (`HN`),
  CONSTRAINT `FK_allergy_drug` FOREIGN KEY (`drugID`) REFERENCES `drug` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_allergy_petient` FOREIGN KEY (`HN`) REFERENCES `petient` (`HN`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table hospital.allergy: ~0 rows (approximately)
DELETE FROM `allergy`;

-- Dumping structure for table hospital.appointment
DROP TABLE IF EXISTS `appointment`;
CREATE TABLE IF NOT EXISTS `appointment` (
  `Appointment_ID` varchar(50) DEFAULT NULL,
  `HN` varchar(50) NOT NULL,
  `datetime` date DEFAULT NULL,
  `doc_ID` varchar(50) DEFAULT NULL,
  `reason` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`HN`),
  KEY `FK_appointment_petient` (`HN`) USING BTREE,
  KEY `FK_appointment_history` (`doc_ID`),
  CONSTRAINT `FK_appointment_history` FOREIGN KEY (`doc_ID`) REFERENCES `history` (`doc_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_appointment_petient` FOREIGN KEY (`HN`) REFERENCES `petient` (`HN`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table hospital.appointment: ~0 rows (approximately)
DELETE FROM `appointment`;

-- Dumping structure for table hospital.doctor
DROP TABLE IF EXISTS `doctor`;
CREATE TABLE IF NOT EXISTS `doctor` (
  `ID` varchar(50) NOT NULL,
  `Firstname` varchar(50) NOT NULL,
  `Lastname` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table hospital.doctor: ~5 rows (approximately)
DELETE FROM `doctor`;
INSERT INTO `doctor` (`ID`, `Firstname`, `Lastname`, `phone`) VALUES
	('D001', 'Palee', 'Moli', '0325698452'),
	('D002', 'Rolge', 'Cram', '0648591245'),
	('D003', 'Foklil', 'Vil', '0814657825'),
	('D004', 'Doti', 'Sali', '0425318699'),
	('D005', 'Balit', 'Doy', '0157789635');

-- Dumping structure for table hospital.drug
DROP TABLE IF EXISTS `drug`;
CREATE TABLE IF NOT EXISTS `drug` (
  `ID` varchar(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `dosage` varchar(50) DEFAULT NULL,
  `timing` varchar(50) DEFAULT NULL,
  `treatment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table hospital.drug: ~8 rows (approximately)
DELETE FROM `drug`;
INSERT INTO `drug` (`ID`, `name`, `dosage`, `timing`, `treatment`) VALUES
	('001', 'Paracetamol', '1 เม็ด', 'เว้นทุก 4–6 ชั่วโมง หลังอาหาร หรือเมื่อมีอาการ', 'ปวดหัว ปวดเมื่อย ลดไข้'),
	('002', 'Amoxicillin', '1 เม็ด', 'หลังอาหาร เช้า–กลางวัน–เย็น', 'ติดเชื้อแบคทีเรีย (คออักเสบ แผลติดเชื้อ ฯลฯ)'),
	('003', 'Ibuprofen', '1 เม็ด', 'หลังอาหารทันที', 'ปวด อักเสบ ปวดข้อ ปวดฟัน'),
	('004', 'Omeprazole', '1 เม็ด', 'ก่อนอาหารเช้า 30 นาที', 'กรดไหลย้อน แสบกระเพาะ แผลในกระเพาะ'),
	('005', 'Metformin', '1 เม็ด', 'หลังอาหารเช้า–เย็น', 'ควบคุมระดับน้ำตาลในเลือดของผู้ป่วยโรคเบาหวานชนิดที่ 2'),
	('006', 'Amlodipine', '1 เม็ด', 'เช้าหรือเย็น 1 ครั้งเวลาเดิมทุกวัน', 'ความดันโลหิตสูง'),
	('007', 'Simvastatin', '1 เม็ด', 'ก่อนนอน', 'ไขมันในเลือดสูง'),
	('008', 'Cetirizine', '1 เม็ด', 'เย็นหรือก่อนนอน 1 ตรั้งต่อวัน', 'ภูมิแพ้ คัน น้ำมูกไหล ลมพิษ');

-- Dumping structure for table hospital.history
DROP TABLE IF EXISTS `history`;
CREATE TABLE IF NOT EXISTS `history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `HN` varchar(50) NOT NULL,
  `Date` date NOT NULL,
  `hospital` varchar(50) NOT NULL,
  `doc_id` varchar(50) NOT NULL,
  `symptoms` varchar(200) DEFAULT NULL,
  `Diagnosis` varchar(50) DEFAULT NULL,
  `appointmeny_ID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_history_doctor` (`doc_id`),
  KEY `FK_history_petient` (`HN`),
  CONSTRAINT `FK_history_doctor` FOREIGN KEY (`doc_id`) REFERENCES `doctor` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table hospital.history: ~7 rows (approximately)
DELETE FROM `history`;
INSERT INTO `history` (`id`, `HN`, `Date`, `hospital`, `doc_id`, `symptoms`, `Diagnosis`, `appointmeny_ID`) VALUES
	(1, 'HN00011', '2566-02-09', 'ดอกคำใต้', 'D001', 'ปวดศีรษะข้างเดียว คลื่นไส้', 'ไมเกรน', NULL),
	(2, 'HN00001', '2569-02-05', 'ดอกคำใต้', 'D001', 'ไข้สูง ปวดเมื่อยตัว ไอ', 'ไข้หวัดใหญ่', NULL),
	(3, 'HN00002', '2568-06-02', 'ดอกคำใต้', 'D003', 'จุกแน่นคอ แสบท้อง', 'กรดไหลย้อน', NULL),
	(4, 'HN00005', '2565-08-09', 'ดอกคำใต้', 'D005', 'เวียนหัว ใจสั่น', 'ความดันโลหิตสูง', NULL),
	(5, 'HN0008', '2567-11-05', 'ดอกคำใต้', 'D002', 'ไข้สูง ปวดข้อ', 'ไข้เลือดออก', NULL),
	(6, 'HN00012', '2567-02-09', 'ดอกคำใต้', 'D003', 'คัน ผื่นแดง', 'ผื่นแพ้ผิวหนัง', NULL),
	(7, 'HN00009', '2565-06-26', 'ดอกคำใต้', 'D004', 'ถ่ายบ่อย อ่อนเพลีย', 'ท้องเสีย', NULL);

-- Dumping structure for table hospital.login
DROP TABLE IF EXISTS `login`;
CREATE TABLE IF NOT EXISTS `login` (
  `username` varchar(50) NOT NULL,
  `passwprd` varchar(50) NOT NULL,
  `prefix` varchar(50) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table hospital.login: ~1 rows (approximately)
DELETE FROM `login`;
INSERT INTO `login` (`username`, `passwprd`, `prefix`, `firstname`, `lastname`) VALUES
	('admin', '1234', 'DR.', 'som', 'sri');

-- Dumping structure for table hospital.petient
DROP TABLE IF EXISTS `petient`;
CREATE TABLE IF NOT EXISTS `petient` (
  `HN` varchar(50) NOT NULL,
  `cid` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `s_dis` varchar(50) DEFAULT NULL,
  `dis` varchar(50) DEFAULT NULL,
  `province` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT '',
  `career` varchar(50) DEFAULT NULL,
  `ethnicity` varchar(50) DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `insurance` varchar(50) DEFAULT '',
  `insurance_id` varchar(50) DEFAULT NULL,
  `blood` varchar(50) DEFAULT '',
  `father` varchar(50) DEFAULT NULL,
  `mother` varchar(50) DEFAULT NULL,
  `spouse` varchar(50) DEFAULT NULL,
  `emergency_number` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`HN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table hospital.petient: ~1 rows (approximately)
DELETE FROM `petient`;
INSERT INTO `petient` (`HN`, `cid`, `firstname`, `lastname`, `birthdate`, `s_dis`, `dis`, `province`, `phone`, `career`, `ethnicity`, `religion`, `nationality`, `insurance`, `insurance_id`, `blood`, `father`, `mother`, `spouse`, `emergency_number`) VALUES
	('HN00001', '1592020484235', 'พันธิรา', 'แสงดี', '2510-05-18', 'ท่าจำปี', 'เมืองพะเยา', 'พะเยา', '0579631258', 'เกษตรกร', 'ไทย', 'พุทธ', 'ไทย', '-', NULL, 'O', 'นันตรา แสงดี', 'พัสรา แสงดี', '-', '0457848124');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
