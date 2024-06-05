-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2024 at 09:48 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `internship4`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(55) NOT NULL DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `username`, `password`, `role`) VALUES
(1, 'admin', '$2a$12$AE4w2JQSuSF9hzhbwAPsq.mw/6.htCXiYQUlPMrtlp2x.WHqoSs6C', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `apply`
--

CREATE TABLE `apply` (
  `apply_id` int(11) NOT NULL,
  `std_id` varchar(100) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `job_id` int(11) DEFAULT NULL,
  `position` varchar(255) NOT NULL,
  `date_apply` datetime NOT NULL DEFAULT current_timestamp(),
  `academic_year` varchar(50) NOT NULL,
  `status` varchar(100) DEFAULT 'รอการตอบรับ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `apply`
--

INSERT INTO `apply` (`apply_id`, `std_id`, `employer_id`, `job_id`, `position`, `date_apply`, `academic_year`, `status`) VALUES
(110, '6210612717', 13, 43, 'datasci', '2024-05-27 00:00:00', '2566', 'รอการตอบรับ'),
(112, '6310611028', 14, 41, 'full stack', '2024-05-27 00:00:00', '2566', 'ผ่าน'),
(113, '6310611030', 17, 39, 'mobile dev', '2024-05-27 00:00:00', '2566', 'ผ่าน'),
(114, '6310611025', 13, 43, 'Application Developer', '2024-05-27 00:00:00', '2566', 'รอการตอบรับ'),
(119, '6310611006', 13, 43, 'Data Sci', '2024-06-05 07:46:03', '2566', 'ผ่าน');

-- --------------------------------------------------------

--
-- Table structure for table `confirm`
--

CREATE TABLE `confirm` (
  `confirm_id` int(11) NOT NULL,
  `std_id` varchar(100) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `position` varchar(255) NOT NULL,
  `date_confirm` datetime NOT NULL DEFAULT current_timestamp(),
  `date_gen_doc` datetime DEFAULT NULL,
  `require_doc` int(10) NOT NULL DEFAULT 0,
  `status` varchar(100) DEFAULT 'รอดำเนินเอกสาร',
  `academic_year` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `confirm`
--

INSERT INTO `confirm` (`confirm_id`, `std_id`, `employer_id`, `job_id`, `position`, `date_confirm`, `date_gen_doc`, `require_doc`, `status`, `academic_year`) VALUES
(71, '6310611028', 13, 43, 'Application Developer', '2024-05-27 00:00:00', '2024-05-01 02:49:59', 0, 'ดำเนินเอกสารเสร็จสิ้น', '2566'),
(72, '6310611030', 17, 39, 'mobile dev', '2024-05-27 00:00:00', '2024-06-04 21:49:40', 0, 'ดำเนินเอกสารเสร็จสิ้น', '2566'),
(77, '6310611006', 13, 43, 'Data Sci', '2024-06-05 07:46:27', NULL, 0, 'รอดำเนินเอกสาร', '2566');

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `doc_id` int(11) NOT NULL,
  `std_id` varchar(100) NOT NULL,
  `report_pdf` varchar(255) DEFAULT NULL,
  `date_upload_report_pdf` datetime DEFAULT NULL,
  `report_docx` varchar(255) DEFAULT NULL,
  `date_upload_report_docx` datetime DEFAULT NULL,
  `timestamp_pdf` varchar(255) DEFAULT NULL,
  `date_upload_timestamp_pdf` datetime DEFAULT NULL,
  `present_pdf` varchar(255) DEFAULT NULL,
  `date_upload_present_pdf` datetime DEFAULT NULL,
  `present_ppt` varchar(255) DEFAULT NULL,
  `date_upload_present_ppt` datetime DEFAULT NULL,
  `academic_year` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`doc_id`, `std_id`, `report_pdf`, `date_upload_report_pdf`, `report_docx`, `date_upload_report_docx`, `timestamp_pdf`, `date_upload_timestamp_pdf`, `present_pdf`, `date_upload_present_pdf`, `present_ppt`, `date_upload_present_ppt`, `academic_year`) VALUES
(22, '6210612716', '6210612716/reportPdf.pdf', '2024-05-25 02:13:19', '6210612716/reportPdf.docx', '2024-05-25 02:13:37', NULL, NULL, '6210612716/presentPdf.pdf', '2024-05-26 02:13:53', '6210612716/reportPptx.pptx', '2024-05-26 02:14:31', '2566'),
(23, '6210612717', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2566'),
(24, '6310611025', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2566'),
(25, '6310611028', '6310611028/reportFinalPdf.pdf', '2024-05-15 02:21:34', '6310611028/reportFinalDocx.docx', '2024-05-15 02:21:55', '6310611028/timestampPdf.pdf', '2024-05-15 02:15:02', NULL, NULL, NULL, NULL, '2566'),
(26, '6310611030', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2566'),
(27, '6310611032', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2566'),
(28, '6310611037', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2566'),
(33, '6310611006', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2566');

-- --------------------------------------------------------

--
-- Table structure for table `edit_courtesy`
--

CREATE TABLE `edit_courtesy` (
  `edit_id` int(11) NOT NULL,
  `std_id` varchar(100) NOT NULL,
  `number_courtesy` varchar(100) NOT NULL,
  `number_letter` varchar(100) DEFAULT NULL,
  `date_courtesy` varchar(100) NOT NULL,
  `date_letter` varchar(100) DEFAULT NULL,
  `name_to` varchar(100) NOT NULL,
  `academic_year` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `edit_courtesy`
--

INSERT INTO `edit_courtesy` (`edit_id`, `std_id`, `number_courtesy`, `number_letter`, `date_courtesy`, `date_letter`, `name_to`, `academic_year`) VALUES
(124, '6310611030', '๓๓', '๓๘', '๓  มิถุนายน  ๒๕๖๗', '๓  มิถุนายน  ๒๕๖๗', 'Narong Srisai', '2566'),
(125, '6310611037', '๔๕', '๔๖', '๔  มิถุนายน  ๒๕๖๗', '๔  มิถุนายน  ๒๕๖๗', 'นางมาลี ช่อบุผา', '2566');

-- --------------------------------------------------------

--
-- Table structure for table `employee_tu`
--

CREATE TABLE `employee_tu` (
  `emp_tu_id` varchar(100) NOT NULL,
  `displayname_th` varchar(100) NOT NULL,
  `displayname_en` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `organization` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL DEFAULT 'employee'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `employee_tu`
--

INSERT INTO `employee_tu` (`emp_tu_id`, `displayname_th`, `displayname_en`, `email`, `department`, `organization`, `role`) VALUES
('head', 'เอกวัต', 'akekawat', 'wongsakron.kon@gmail.com', 'computer', 'computer', 'head'),
('secretary', 'พาษิศ', 'pasit', '6310611006@student.tu.ac.th', 'computer', 'computer', 'secretary'),
('snawin', 'นาวิน สมญาติ', 'Nawin  Somyat', 'snawin@tu.ac.th', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', 'employee'),
('teacher', 'พิตตัย', 'pittai', 'pittai@tu.ac.th', 'computer', 'computer', 'teacher');

-- --------------------------------------------------------

--
-- Table structure for table `employer`
--

CREATE TABLE `employer` (
  `employer_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(100) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `subdistrict` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `pcode` varchar(100) NOT NULL,
  `contact_name` varchar(100) NOT NULL,
  `contact_email` varchar(100) NOT NULL,
  `contact_tel` varchar(100) NOT NULL,
  `about` text DEFAULT NULL,
  `company_pic` varchar(100) DEFAULT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'notverify',
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `role` varchar(100) DEFAULT 'employer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `employer`
--

INSERT INTO `employer` (`employer_id`, `username`, `email`, `password`, `company_name`, `address`, `subdistrict`, `district`, `province`, `pcode`, `contact_name`, `contact_email`, `contact_tel`, `about`, `company_pic`, `status`, `verified`, `role`) VALUES
(7, 'testemployer', '', '$2a$10$xCSXDv7Spug.AM4GBFCauuRZFUJpS/PcZxCTctczmDlRRPwRxaCT2', 'Example Company', '123 Main Street', 'Suburb', 'City', 'State', '12345', 'John Doe', 'john.doe@example.com', '1234567890', NULL, 'https://example.com/company_logo.jpg', 'verified', 0, 'employer'),
(8, 'test10', '', '$2a$10$s.BP4ncjWW1wfGJpiCteoegAUoGNSuB1XLlc4Rocmfw.hiOKlpRuy', 'Example Company Edit2', '123 Main Street', 'Suburb', 'City', 'State', '12345', 'John Doe', 'john.doe@example.com', '1234567890', NULL, 'https://example.com/company_logo.jpg', 'notverify', 0, 'employer'),
(9, 'wongsakron', '', '$2a$10$ATSJA43XKXSNVV0jUCIxc.HdbY99RTlPnA2Rlq.ubuAQNCh11l8Yi', 'test', 'test', 'test', 'test', 'bangkok', '10222', 'wongsakron', 'test@gmail.com', '0987866360', NULL, NULL, 'verified', 0, 'employer'),
(10, 'test', '', '$2a$10$DZbXqt7xCXzVKFsUlY3eZuK5sJxRn392bfe5d4iuYpTUPrJard98G', 'test grop', 'test', 'test', 'test', 'bangkok', '10222', 'wongsakron', 'test@gmail.com', '0987866360', NULL, NULL, 'verified', 0, 'employer'),
(11, 'test20', '', '$2a$10$FajEUqso/KF.ml4e6oz2teiHR7u4AWSRz5D8MpD9T3DJzd24nnEHq', 'Example Company', '123 Main Street', 'Suburb', 'City', 'State', '12345', 'John Doe', 'john.doe@example.com', '1234567890', NULL, 'https://example.com/company_logo.jpg', 'notverify', 0, 'employer'),
(12, 'test30', '', '$2a$10$NRKfZYV7aUYkfIzuQe5XcebXJXoAv55uptyhaMz0GSwfO6Gt/3xq6', 'test', 'wadawd', 'test', 'wdawd', 'bangkok', '10222', 'wongsakron', 'test@gmail.com', '0987866360', NULL, NULL, 'notverify', 0, 'employer'),
(13, 'company1', 'wongsakron.kon@gmail.com', '$2a$10$Ih9DPIUSAPZxAQHClY1WYuBbWFfmvcc1ZgzP1WlWmfr6HLvs5f0xG', 'Tech Solutions Co., Ltd.', '88/42 Sukhumvit Road', 'Khlong Toei Nuea', 'Watthana', 'Bangkok', '10110', 'Siri Wong', 'siri.wong@example.com', '0823456789', 'Tech Solutions Co., Ltd. is a leading technology company specializing in innovative software solutions and IT services. We are committed to delivering high-quality products to meet the evolving needs of our clients.', 'company1/placeholder.png', 'verified', 1, 'employer'),
(14, 'company2', '', '$2a$10$QBHrphR1ZdeBLaukoS3Qm.FbjH9Weq1oETGMW/f9b0firAeIbujKS', 'Design Hub Ltd.', '55/18 Ratchadaphisek Road', 'Chom Phon', 'Chatuchak', 'Bangkok', '10900', 'Aom Kittisak', 'aom.kittisak@example.com', '0929876543', 'Design Hub Ltd. is a creative design agency specializing in user-centric designs for web and mobile applications. Our talented team of designers is dedicated to delivering visually appealing and intuitive solutions.', '2566/company2/d-logo-design_-company-logo-template-9f05290d585ddf676efe71f2197a3d3f_screen.jpg', 'verified', 1, 'employer'),
(15, 'company3', 'marwin.ror@gmail.com', '$2a$10$IyKuur14AbgY7lEeE.adzefV6KTY0HdXuXJO5pH.A6zi73HpZj7AK', 'Networking Solutions Co., Ltd.', '120/15 Phahonyothin Road', 'Phaya Thai', 'Samsen Nai', 'Bangkok', '10400', 'Nat Kanya', 'nat.kanya@example.com', '0821234567', 'Networking Solutions Co., Ltd. is a leading provider of network infrastructure solutions. We specialize in designing and implementing robust and secure networks to meet the connectivity needs of businesses.', '2566/company3/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg', 'verified', 0, 'employer'),
(16, 'company4', '', '$2a$10$QOFyJOI1cU4XsmC3B6pm/.83RxFqSKNdbFtOzD8bSjdy47XNsnHli', 'Marketing Plus Co., Ltd.', '30/14 Silom Road', 'Silom', 'Bang Rak', 'Bangkok', '10500', 'Mike Phongchai', 'mike.phongchai@example.com', '0923456789', 'Marketing Plus Co., Ltd. is a dynamic marketing agency specializing in strategic marketing solutions. Our team is passionate about creating impactful campaigns to elevate brands and drive business success.', '2566/company4/free-company-logo-design-template-f02206903dcc70505736cca7fd9c5104_screen.jpg', 'verified', 0, 'employer'),
(17, 'company5', '', '$2a$10$ppm/rR2frTvsGChHFlS5U.I6nWDkBMt6ibwaFascMKo5rEymfmW..', 'Finance Solutions Ltd.', '75/21 Charoen Krung Road', 'Wat Phraya Krai', 'Bang Kho Laem', 'Bangkok', '10120', 'Nina Somchai', 'nina.somchai@example.com', '0829876543', 'Finance Solutions Ltd. is a reputable financial consulting firm providing expert analysis and solutions. Our dedicated team is committed to helping businesses achieve financial success and stability.', '2566/company5/House-Agent-Broker-Business-Logo-Template.png', 'verified', 0, 'employer'),
(44, 'company8', 'wongsakronkongkamud@gmail.com', '$2a$10$36Jz1os0sWLZBYDizKXULeAD1mB.5m5zYTSgxSeEdv/8Is2G1ul2O', 'test verify', 'test', 'ท่าแร้ง', 'บางเขน', 'กรุงเทพมหานคร', '10220', 'test verify', 'wongsakronkongkamud@gmail.com', '0881519423', NULL, NULL, 'notverify', 0, 'employer');

-- --------------------------------------------------------

--
-- Table structure for table `emp_eval`
--

CREATE TABLE `emp_eval` (
  `emp_eval_id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `supervisor_name` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `fax` varchar(20) DEFAULT NULL,
  `intern_full_name` varchar(255) DEFAULT NULL,
  `std_id` varchar(20) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `intern_job_description` text DEFAULT NULL,
  `start_internship_date` date DEFAULT NULL,
  `end_internship_date` date DEFAULT NULL,
  `student_evaluation` varchar(255) DEFAULT NULL,
  `character_questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`character_questions`)),
  `knowledge_questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`knowledge_questions`)),
  `attitude_questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attitude_questions`)),
  `work_ability_questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`work_ability_questions`)),
  `other_radio_questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`other_radio_questions`)),
  `academic_year` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emp_question`
--

CREATE TABLE `emp_question` (
  `emp_question_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `additional_courses` text DEFAULT NULL,
  `important_student_traits` text DEFAULT NULL,
  `outstanding_traits_students` text DEFAULT NULL,
  `improvement_students` text DEFAULT NULL,
  `academic_year` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `emp_question`
--

INSERT INTO `emp_question` (`emp_question_id`, `email`, `additional_courses`, `important_student_traits`, `outstanding_traits_students`, `improvement_students`, `academic_year`) VALUES
(1, 'test@gmail.com', '1234', '1234', '1234', '1234', '2566'),
(2, 'test@gmail.com', 'test', 'test', 'test', 'test', '2566'),
(3, 'test@gmail.com', 'test', 'test', 'test', 'test', '2566'),
(4, 'test@gmail.com', 'test', 'test', 'test', 'test', '2566'),
(5, 'test@gmail.com', 'test', 'test', 'test', 'test', '2566');

-- --------------------------------------------------------

--
-- Table structure for table `file_student`
--

CREATE TABLE `file_student` (
  `file_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `file_student`
--

INSERT INTO `file_student` (`file_id`, `name`, `file_type`, `file_url`) VALUES
(1, 'demo3.png', 'image/png', 'http://localhost:5000/api/images/demo3.png'),
(2, 'demo3.png', 'image/png', 'uploads/demo3.png'),
(3, 'demo3.png', 'image/png', 'uploads/demo3.png'),
(5, '6310611006_resume.pdf', 'application/pdf', 'uploads/2566/documentStudent/resume/6310611006_resume.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `gen_document`
--

CREATE TABLE `gen_document` (
  `gen_id` int(11) NOT NULL,
  `std_id` varchar(100) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `doc_nonlicense` varchar(100) NOT NULL,
  `courtesy_license` varchar(100) NOT NULL,
  `intern_letter` varchar(100) DEFAULT NULL,
  `date_gen` datetime NOT NULL DEFAULT current_timestamp(),
  `academic_year` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `gen_document`
--

INSERT INTO `gen_document` (`gen_id`, `std_id`, `employer_id`, `doc_nonlicense`, `courtesy_license`, `intern_letter`, `date_gen`, `academic_year`) VALUES
(98, '6310611028', 13, '6310611028/doc_nonlicense', '6310611028/courtesy_license', '6310611028/intern_letter', '2024-05-27 02:10:53', '2566'),
(101, '6310611030', 17, '6310611030/doc_nonlicense_6310611030.pdf', '6310611030/courtesy_license_6310611030.pdf', '6310611030/letter_license_6310611030.pdf', '2024-06-04 14:49:40', '2566');

-- --------------------------------------------------------

--
-- Table structure for table `gen_document_self`
--

CREATE TABLE `gen_document_self` (
  `gen_self_id` int(11) NOT NULL,
  `std_id` varchar(100) NOT NULL,
  `self_enroll_id` int(11) NOT NULL,
  `doc_nonlicense` varchar(100) DEFAULT NULL,
  `doc_nonlicense_courtesy` varchar(255) DEFAULT NULL,
  `doc_nonlicense_letter` varchar(255) DEFAULT NULL,
  `courtesy_license` varchar(100) DEFAULT NULL,
  `intern_letter` varchar(100) DEFAULT NULL,
  `date_gen` datetime NOT NULL DEFAULT current_timestamp(),
  `academic_year` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `gen_document_self`
--

INSERT INTO `gen_document_self` (`gen_self_id`, `std_id`, `self_enroll_id`, `doc_nonlicense`, `doc_nonlicense_courtesy`, `doc_nonlicense_letter`, `courtesy_license`, `intern_letter`, `date_gen`, `academic_year`) VALUES
(33, '6210612716', 17, '2566/6210612716/doc_nonlicense_6210612716.pdf', '2566/6210612716/doc_nonlicense_courtesy_6210612716.pdf', '2566/6210612716/doc_nonlicense_letter_6210612716.pdf', '2566/6210612716/courtesy_license_6210612716.pdf', '2566/6210612716/letter_license_6210612716.pdf', '2024-05-10 17:14:16', '2566'),
(34, '6310611037', 25, '6310611037/doc_nonlicense_6310611037.pdf', '6310611037/doc_nonlicense_courtesy_6310611037.pdf', '6310611037/doc_nonlicense_letter_6310611037.pdf', '6310611037/courtesy_license_6310611037.pdf', '6310611037/letter_license_6310611037.pdf', '2024-06-04 15:03:25', '2566');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `news_id` int(11) NOT NULL,
  `topic` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `cover_img` varchar(255) DEFAULT NULL,
  `images` varchar(255) DEFAULT NULL,
  `postedTime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`news_id`, `topic`, `detail`, `cover_img`, `images`, `postedTime`) VALUES
(46, 'Healthy Recipes', '<p>A collection of easy and nutritious recipes for a balanced diet.</p>', 'teacher/360_F_314816591_yBAWvMvnpTW05AP0q4DCs5B6y2gnL9xA.jpg', 'teacher/istockphoto-1148091793-612x612.jpg,teacher/istockphoto-1283633982-612x612.jpg', '2024-05-14 00:00:00'),
(47, 'Fashion Trends', '<p>Latest trends in fashion for the upcoming season with style tips.</p>', 'teacher/360_F_496443587_rE7ZXJBTL0CZfLtRWYpAAzf0DidaWaQj.jpg', '', '2024-05-14 00:00:00'),
(48, 'Book Review', '<p>In-depth review of the bestselling novel \"The Great Adventure.\"</p>', 'teacher/feverfew-4743930_640.jpg', '', '2024-05-14 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `posts_job`
--

CREATE TABLE `posts_job` (
  `job_id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `subdistrict` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `pcode` varchar(255) NOT NULL,
  `contact_email` varchar(255) NOT NULL,
  `contact_tel` varchar(255) NOT NULL,
  `work_hours` varchar(255) NOT NULL,
  `salary` varchar(255) NOT NULL,
  `welfare` varchar(255) DEFAULT NULL,
  `qualifications` varchar(255) NOT NULL,
  `desc` text NOT NULL,
  `other` text DEFAULT NULL,
  `cat` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`cat`)),
  `cat_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `count_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `name_to` varchar(100) NOT NULL,
  `dateStartPost` datetime NOT NULL DEFAULT current_timestamp(),
  `dateEndPost` datetime NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `posts_job`
--

INSERT INTO `posts_job` (`job_id`, `emp_id`, `job_title`, `location`, `district`, `subdistrict`, `province`, `pcode`, `contact_email`, `contact_tel`, `work_hours`, `salary`, `welfare`, `qualifications`, `desc`, `other`, `cat`, `cat_values`, `count_values`, `name_to`, `dateStartPost`, `dateEndPost`, `status`) VALUES
(37, 16, 'Web Development Intern', 'Bangkok, Thailand', 'บางกะปิ', 'หัวหมาก', 'กรุงเทพมหานคร', '10240', 'careers@webstar.co.th', '+66 2 234 5678', 'Monday to Friday, 9:00 AM to 6:00 PM', '450 THB per Day', '- Free lunch\n- health insurance\n- flexible work hours', '- Currently enrolled in a Bachelor\'s degree in Computer Engineering, Computer Science, or related field.\n- Familiarity with HTML, CSS, JavaScript, or other web development tools.\n- Strong communication skills and willingness to learn.', '<ul><li><strong>Assist in front-end and back-end development tasks</strong></li><li><strong>Work on web design and user interface</strong></li><li><strong>Collaborate with senior developers on projects</strong></li></ul>', '', '\"[\\\"Back-End\\\",\\\"Front-End\\\"]\"', '{\"Back-End\":2,\"Front-End\":2}', '{\"Back-End\":2,\"Front-End\":2}', 'Somchai Jaidee', '2024-01-31 00:00:00', '2024-05-31 00:00:00', 'active'),
(38, 16, 'Data Science Intern', 'Bangkok, Thailand', 'บางกะปิ', 'หัวหมาก', 'กรุงเทพมหานคร', '10240', 'careers@webstar.co.th', '+66 2 234 5678', 'Monday to Friday, 9:00 AM to 6:00 PM', '500 THB per Day', '- Free lunch\n- health insurance\n- flexible work hours', '- Currently enrolled in a Bachelor\'s degree in Computer Engineering or related field.\n- Familiarity with data analysis and visualization tools\n- Good problem-solving and analytical skills', '<ul><li><strong>Support data analysis and data preparation</strong></li><li><strong>Assist in creating visualizations and reports</strong></li><li><strong>Collaborate with data scientists on research and analysis projects</strong></li></ul>', '', '\"[\\\"Data Scientist\\\"]\"', '{\"Data Scientist\":2}', '{\"Data Scientist\":1}', 'Somchai Jaidee', '2024-01-31 00:00:00', '2024-06-20 00:00:00', 'active'),
(39, 17, 'Mobile App Development Intern', 'Bangkok, Thailand', 'จตุจักร', 'ลาดยาว', 'กรุงเทพมหานคร', '10900', 'hr@appmasters.co.th', '+66 38 456 789', 'Monday to Friday, 9:30 AM to 6:30 PM', '450 THB per Day', '- Free snacks\n- training sessions\n- team-building activities', '- Currently pursuing a degree in Computer Science or Engineering.\n- Basic knowledge of mobile app development (iOS or Android).\n- Strong programming skills.', '<ul><li><strong>Assist in the development of mobile applications</strong></li><li><strong>Collaborate with designers and other developers</strong></li><li><strong>Participate in <em>code reviews</em> and <em>testing</em></strong></li></ul>', '', '\"[\\\"Mobile App Developer\\\"]\"', '{\"Mobile App Developer\":3}', '{\"Mobile App Developer\":3}', 'Narong Srisai', '2024-02-01 00:00:00', '2024-06-20 00:00:00', 'active'),
(40, 17, 'Cloud Computing Intern', 'Bangkok, Thailand', 'จตุจักร', 'ลาดยาว', 'กรุงเทพมหานคร', '10900', 'hr@appmasters.co.th', '+66 38 456 789', '', '450 THB per Day', '- Free snacks\n- training sessions\n- mentorship from senior engineers', '- Currently pursuing a degree in Computer Engineering or a related field.\n- Familiarity with cloud platforms such as AWS, Azure, or Google Cloud.\n- Good problem-solving and communication skills.', '<ul><li><strong>Assist in managing cloud infrastructure</strong></li><li><strong>Participate in <em>cloud deployment</em> and <em>maintenance tasks</em></strong></li><li><strong>Collaborate with senior engineers on cloud projects</strong></li></ul>', '', '\"[\\\"Cloud Engineer\\\"]\"', '{\"Cloud Engineer\":1}', '{\"Cloud Engineer\":1}', 'Narong Srisai', '2024-02-01 00:00:00', '2024-06-20 00:00:00', 'active'),
(41, 14, 'Full-Stack Intern', 'Bangkok, Thailand', 'หลักสี่', 'ทุ่งสองห้อง', 'กรุงเทพมหานคร', '10210', 'jobs@creativestudio.co.th', '+66 43 123 987', 'Monday to Friday, 9:00 AM to 5:00 PM', '600 THB per Day', '- Free Snacks', '- Currently enrolled in a Bachelor\'s degree in Computer Engineering, Computer Science, or related field\n- Familiarity with HTML, CSS, JavaScript, Node.js, React, etc.\n- Strong communication skills and willingness to learn.', '<ul><li><strong>Assist in front-end and back-end development tasks</strong></li><li><strong>Work on web design, user interface, database</strong></li><li><strong>Collaborate with senior developers on projects</strong></li></ul>', '', '\"[\\\"Full-Stack\\\"]\"', '{\"Full-Stack\":2}', '{\"Full-Stack\":1}', 'Wong Kananan', '2024-02-02 00:00:00', '2024-06-20 00:00:00', 'active'),
(42, 15, 'Network Engineering Intern', 'Bangkok', 'คันนายาว', 'รามอินทรา', 'กรุงเทพมหานคร', '10230', 'careers@networkspecialists.co.th', '+66 76 123 789', 'Monday to Friday, 8:00 AM to 5:00 PM', '550 THB per Day', '', '- Currently pursuing a degree in Computer Engineering or related field.\n- Understanding of network protocols and security.\n- Good problem-solving and communication skills.', '<ul><li><strong>Assist in maintaining network infrastructure.</strong></li><li><strong>Help troubleshoot network issues and perform diagnostics.</strong></li><li><strong>Collaborate with senior engineers on projects and tasks.</strong></li></ul>', '', '\"[\\\"Network Engineer\\\"]\"', '{\"Network Engineer\":1}', '{\"Network Engineer\":1}', 'Manee Meena', '2024-02-03 00:00:00', '2024-06-20 00:00:00', 'active'),
(43, 13, 'Application Developerzzz', 'Bangkok, Thailand', 'บางรัก', 'สีลม', 'กรุงเทพมหานคร', '10500', 'internship@solutionsmart.co.th', '+66 2 987 6543', 'Monday to Friday, 9:00 AM to 6:00 PM', '500 THB per Day', '- Transportation allowance\n- mentorship from senior IT professionals\n- free snacks and beverages', '- Currently enrolled in a degree in Computer Engineering, Information Technology, or a related field.\n- Familiarity with Python, Java, C#, .NET, or other IT solutions.\n- Strong analytical and problem-solving skills.\n- Good communication and teamwork skill', '<ul><li><strong>Support the IT team in delivering solutions for clients.</strong></li><li><strong>Assist in troubleshooting and resolving IT issues.</strong></li><li><strong>Collaborate with senior IT specialists on projects.</strong></li><li><strong>Work on various IT tasks such as software updates, network maintenance, and user support.</strong></li></ul>', '', '\"[\\\"Data Sci\\\",\\\"Application Developer\\\"]\"', '{\"Data Sci\":6,\"Application Developer\":2}', '{\"Data Sci\":4,\"Application Developer\":2}', 'Somchai Jairak', '2024-02-04 00:00:00', '2024-06-20 00:00:00', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `reset_tokens`
--

CREATE TABLE `reset_tokens` (
  `token` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `expires_at` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `reset_tokens`
--

INSERT INTO `reset_tokens` (`token`, `created_at`, `expires_at`, `user_id`) VALUES
('6f4270a31c04264415f1371dcb30ebc6074e458d56d129d10147ac11246d5da8', '2024-05-19T06:18:15.969Z', '2024-05-20T06:18:15.969Z', 43),
('240e3acc739222f8e3a5a6c4227dd8018999b4b133d91ebfdeb94bf1d52144e0', '2024-05-19T08:51:35.616Z', '2024-05-20T08:51:35.616Z', 44);

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `schedule_id` int(11) NOT NULL,
  `detail` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`schedule_id`, `detail`) VALUES
(5, '<p><strong><u><span style=\"font-size: 16px;font-family: Arial\">กำหนดการวิชา วพ</span></u></strong><span style=\"font-size: 16px\"><strong><u>.402โครงงานทางด้านวิศวกรรมคอมพิวเตอร์2 ประจำภาคการศึกษาที่2/2566</u></strong></span></p><table><tbody><tr><td><p style=\"text-align:center\"><strong><span style=\"font-size: 16px;font-family: Arial\">กำหนดการ</span></strong></p></td><td><p style=\"text-align:center\"><strong><span style=\"font-size: 16px;font-family: Arial\">รายละเอียดงาน</span></strong></p></td></tr><tr><td><p><strong><span style=\"font-size: 16px;font-family: Arial\">23 ก.พ. 67</span></strong></p></td><td><p><span style=\"font-size: 16px;font-family: Arial\"><strong>ส่งรายงานความคืบหน้าครั้งที่   2 (Progress Report 2)</strong></span></p><p style=\"margin-left:1.0in\"><span style=\"font-size: 16px;font-family: Arial\">ให้ตัวแทนนักศึกษาของแต่ละกลุ่มโครงงาน   นำรายงานไปให้อาจารย์ที่ปรึกษาลงนามรับรอง</span><span style=\"font-size: 16px;font-family: Arial\">และส่งรายงานแบบออนไลน์ในรูปแบบไฟล์</span><span style=\"font-size: 16px;font-family: Arial\">pdf</span><span style=\"font-size: 16px;font-family: Arial\">(ไม่ต้องส่งฉบับกระดาษที่ภาควิชา)   ภายในวันที่</span><span style=\"font-size: 16px;font-family: Arial\">23 ก.พ. 67โดยส่งได้ที่</span></p><p style=\"margin-left:1.0in;text-align:justify\"><span style=\"font-size: 16px;font-family: Arial\"><a href=\"https://docs.google.com/forms/d/e/1FAIpQLSeAueuYyZU_88riMtzP1od5iOA46vlsZAbu923gXYdjs0RyHw/viewform\">แบบฟอร์มส่งรายงานความคืบหน้าโครงงาน2</a></span></p><p style=\"margin-left:1.0in;text-align:justify\"><span style=\"font-size: 16px;font-family: Arial\">*** ก่อนส่ง   ให้ตรวจสอบรหัสโครงงานของนักศึกษาจาก<a href=\"http://taweesak.ece.engr.tu.ac.th/cn-projects/cn-project-list.pdf\">ไฟล์นี้</a>ก่อน   ในการส่งรายงานความคืบหน้าครั้งที่   2   นักศึกษาจะต้องตั้งชื่อไฟล์รายงานในรูปแบบ   รหัสโครงงาน-progress2.pdf   เช่น   ถ้ารหัสโครงงานของนักศึกษา   คือ CNP01 ให้ตั้งชื่อไฟล์ว่า   CNP01-progress2.pdf</span></p><p style=\"margin-left:1.0in;text-align:justify\"><span style=\"font-size: 16px;font-family: Arial\">นักศึกษาสามารถศึกษาวิธีการเขียนรายงานความคืบหน้าครั้งที่   </span><span style=\"font-size: 16px;font-family: Arial\">2 ได้จาก<a href=\"http://taweesak.ece.engr.tu.ac.th/cn-projects/cn-project-manual-66.pdf\">คู่มือในการทำโครงงาน</a></span></p></td></tr><tr><td><p><strong><span style=\"font-size: 16px;font-family: Arial\">21 เม.ย.   67</span></strong></p></td><td><p><strong><span style=\"font-size: 16px;font-family: Arial\">ส่งโปสเตอร์สรุปเกี่ยวกับโครงงานที่ทำ</span></strong></p><p style=\"margin-left:1.0in\"><span style=\"font-size: 16px;font-family: Arial\">ให้ตัวแทนนักศึกษาของแต่ละกลุ่มโครงงาน   จัดทำโปสเตอร์ขนาด   </span><span style=\"font-size: 16px;font-family: Arial\">90   ซม. * 95 ซม.   เพื่อสรุปเกี่ยวกับโครงงานที่ทำ   ในรูปแบบไฟล์</span><span style=\"font-size: 16px;font-family: Arial\">pdf</span><span style=\"font-size: 16px;font-family: Arial\">   และส่งโปสเตอร์แบบออนไลน์</span><span style=\"font-size: 16px;font-family: Arial\">ภายในวันที่</span><span style=\"font-size: 16px;font-family: Arial\">21 เม.ย.   67</span><span style=\"font-size: 16px;font-family: Arial\">โดยส่งได้ที่</span></p><p style=\"margin-left:1.0in;text-align:justify\"><span style=\"font-size: 16px;font-family: Arial\"><a href=\"https://docs.google.com/forms/d/e/1FAIpQLSd3bpITxheLXaouHnatFq_cGq4kckaRz2oXZP70WsOLyXSghQ/viewform\">แบบฟอร์มส่งโปสเตอร์โครงงาน</a></span></p><p style=\"margin-left:1.0in;text-align:justify\"><span style=\"font-size: 16px;font-family: Arial\">*** ก่อนส่ง   ให้ตรวจสอบรหัสโครงงานของนักศึกษาจาก<a href=\"http://taweesak.ece.engr.tu.ac.th/cn-projects/cn-project-list.pdf\">ไฟล์นี้</a>ก่อน   ในการส่งข้อเสนอโปสเตอร์โครงงาน   นักศึกษาจะต้องตั้งชื่อไฟล์ในรูปแบบ   รหัสโครงงาน-poster.pdf   เช่น   ถ้ารหัสโครงงานของนักศึกษา   คือ CNP01 ให้ตั้งชื่อไฟล์ว่า   CNP01-poster.pdf</span></p><p style=\"margin-left:1.0in;text-align:justify\"><span style=\"font-size: 16px\">นักศึกษาสามารถดูตัวอย่างของโปสเตอร์โครงงานได้จาก</span><a href=\"https://drive.google.com/drive/folders/14oseE3HKWWo5SeapexJUmUPgZikqTqmt\"><span style=\"font-size: 16px;font-family: Arial\">ลิงค์นี้</span></a></p></td></tr></tbody></table>');

-- --------------------------------------------------------

--
-- Table structure for table `self_enroll`
--

CREATE TABLE `self_enroll` (
  `self_enroll_id` int(11) NOT NULL,
  `std_id` varchar(100) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `company_address` varchar(100) NOT NULL,
  `to_who` varchar(100) NOT NULL,
  `tel` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `date_enroll` datetime DEFAULT current_timestamp(),
  `date_gen_doc` datetime DEFAULT NULL,
  `displayname_th` varchar(100) NOT NULL,
  `require_doc` int(11) NOT NULL DEFAULT 0,
  `print` int(10) DEFAULT 0,
  `status` varchar(100) DEFAULT 'รอดำเนินเอกสาร',
  `academic_year` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `self_enroll`
--

INSERT INTO `self_enroll` (`self_enroll_id`, `std_id`, `company_name`, `company_address`, `to_who`, `tel`, `email`, `date_enroll`, `date_gen_doc`, `displayname_th`, `require_doc`, `print`, `status`, `academic_year`) VALUES
(17, '6210612716', 'lovito', 'อาคาร180ปี ลาดพร้าว วังหิน', 'นายมงคล กิต', '0928766663', 'mong.ko@lo.th', '2024-03-28 12:23:48', '2024-05-11 00:14:50', 'ภูชิชย์ กลีบมาลัย', 1, 1, 'ดำเนินเอกสารเสร็จสิ้น', '2566'),
(24, '6310611032', 'Mg solution', '120/220 ลาดพร้าว120 ', 'นายเอกวัตร มงคล', '0887779470', 'aek.ek@mg.th', '2024-05-27 01:58:01', '2024-05-23 02:17:28', 'อลิซ ซาดี', 0, 0, 'ดำเนินเอกสารเสร็จสิ้น', '2566'),
(25, '6310611037', 'SL Tech', 'ตึกช้าง ชั้น70 ลาดพร้าว', 'นางมาลี ช่อบุผา', '0678872224', 'mar.ra@mg.th', '2024-05-27 01:58:01', '2024-06-04 22:03:52', 'มาลิสา งามจิต', 0, 0, 'ดำเนินเอกสารเสร็จสิ้น', '2566');

-- --------------------------------------------------------

--
-- Table structure for table `setup_courtesy`
--

CREATE TABLE `setup_courtesy` (
  `id` int(11) NOT NULL,
  `start_date` varchar(100) NOT NULL,
  `end_date` varchar(100) NOT NULL,
  `end_date_year` varchar(100) NOT NULL,
  `head_name` varchar(100) NOT NULL,
  `signature_img` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `setup_courtesy`
--

INSERT INTO `setup_courtesy` (`id`, `start_date`, `end_date`, `end_date_year`, `head_name`, `signature_img`) VALUES
(46, '๒๕  มีนาคม', '๒๔  พฤษภาคม', '๒๕๖๗', 'รองศาสตราจารย์ วิน  ดีเซล', '2566/admin/signature5.jpg'),
(47, '๑๐  มิถุนายน', '๙  สิงหาคม', '๒๕๖๗', 'รองศาสตรา วิน  ดีเซล', '2566/secretary/siganture.png'),
(48, '๑๐  มิถุนายน', '๙  สิงหาคม', '๒๕๖๗', 'รองศาสตราจารย์ วิน  ดีเซล', '2566/secretary/signature5.jpg'),
(49, '๓  มิถุนายน', '๒  สิงหาคม', '๒๕๖๗', 'รองศาสตราจารย์ วิน  ดีเซลจอน', 'secretary/signature5.jpg'),
(50, '๓  มิถุนายน', '๒  สิงหาคม', '๒๕๖๗', 'รองศาสตราจารย์ วิน  ดีเซลจอน', 'secretary/signature5.jpg'),
(51, '๔  มิถุนายน', '๓  สิงหาคม', '๒๕๖๗', 'รองศาสตราจารย์ วินเเมค   ดีเซล', 'secretary/signature3.png'),
(52, '๔  มิถุนายน', '๓  สิงหาคม', '๒๕๖๗', 'รองศาสตราจารย์ วินเเมค   ดีเซล', 'secretary/signature3.png'),
(53, '๔  มิถุนายน', '๓  สิงหาคม', '๒๕๖๗', 'รองศาสตราจารย์ วินเเมค   ดีเซล', 'secretary/signature4.png'),
(54, '๔  มิถุนายน', '๓  สิงหาคม', '๒๕๖๗', 'รองศาสตราจารย์ วินเเมค   ดีเซล', 'secretary/signature_1710746221495.png');

-- --------------------------------------------------------

--
-- Table structure for table `std_eval`
--

CREATE TABLE `std_eval` (
  `std_eval_id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `std_id` varchar(100) NOT NULL,
  `displayname_th` varchar(255) NOT NULL,
  `std_year` varchar(50) NOT NULL,
  `department` varchar(255) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `company_address` varchar(255) DEFAULT NULL,
  `company_tel` varchar(20) DEFAULT NULL,
  `company_fax` varchar(20) DEFAULT NULL,
  `company_business_type` varchar(255) DEFAULT NULL,
  `std_task` varchar(255) DEFAULT NULL,
  `org_coop` int(11) DEFAULT NULL,
  `work_safety` int(11) DEFAULT NULL,
  `assign_workload` int(11) DEFAULT NULL,
  `guide_concern` int(11) DEFAULT NULL,
  `prior_knowledge` int(11) DEFAULT NULL,
  `apply_knowledge` int(11) DEFAULT NULL,
  `future_placement` int(11) DEFAULT NULL,
  `benefit_intern` int(11) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `academic_year` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `std_eval`
--

INSERT INTO `std_eval` (`std_eval_id`, `email`, `std_id`, `displayname_th`, `std_year`, `department`, `company_name`, `company_address`, `company_tel`, `company_fax`, `company_business_type`, `std_task`, `org_coop`, `work_safety`, `assign_workload`, `guide_concern`, `prior_knowledge`, `apply_knowledge`, `future_placement`, `benefit_intern`, `comments`, `academic_year`) VALUES
(12, 'wongsakron.kon@dome.tu.ac.th', '6110000222', 'วงศกร กองกะมุด', '3', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'Design Hub Ltd.', '55/18 Ratchadaphisek Road', '1', '1', 'test', 'test', 2, 2, 2, 2, 2, 0, 0, 2, 'test', '2566'),
(13, 'wongsakron.kon@dome.tu.ac.th', '6110000222', 'วงศกร กองกะมุด', '3', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'Tech Solutions Co., Ltd.', '88/42 Sukhumvit Road', '1', '1', 'test', 'test', 2, 2, 2, 2, 2, 2, 4, 2, 'test', '2566'),
(15, 'wongsakron.kon@dome.tu.ac.th', '6110000222', 'วงศกร กองกะมุด', '3', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'Design Hub Ltd.', '55/18 Ratchadaphisek Road', '1', '1', 'test', 'test', 2, 2, 2, 2, 2, 0, 0, 2, 'test', '2567'),
(17, 'wongsakron.kon@dome.tu.ac.th', '6110000222', 'วงศกร กองกะมุด', '3', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'Financial Solution', '129/1 Sukhumvit Road', '1', '1', 'test', 'test', 2, 2, 2, 2, 1, 2, 2, 3, 'test', '2566'),
(18, 'wongsakron.kon@dome.tu.ac.th', '6110000222', 'วงศกร กองกะมุด', '3', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'Data Solutions', '123/4 radpraw 101', '1', '1', 'test', 'test', 2, 2, 3, 1, 2, 2, 4, 1, 'test', '2566');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `std_id` varchar(11) NOT NULL,
  `name_title_th` varchar(50) DEFAULT NULL,
  `displayname_th` varchar(100) NOT NULL,
  `name_title_en` varchar(50) DEFAULT NULL,
  `displayname_en` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `department` varchar(100) NOT NULL,
  `faculty` varchar(100) NOT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `skill` varchar(255) DEFAULT NULL,
  `gpa` varchar(50) DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT '0',
  `role` varchar(55) NOT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `std_eval` int(10) DEFAULT 0,
  `emp_eval` varchar(50) DEFAULT 'รอบริษัทประเมิน'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`std_id`, `name_title_th`, `displayname_th`, `name_title_en`, `displayname_en`, `email`, `tel`, `department`, `faculty`, `experience`, `skill`, `gpa`, `status`, `role`, `resume`, `std_eval`, `emp_eval`) VALUES
('6210612716', 'นาย', 'ภูชิชย์ กลีบมาลัย', 'Mr.', 'puchit kleebmalai', 'puchit.kle@dome.tu.ac.th', '0667318899', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', NULL, NULL, NULL, '4', 'student', NULL, 0, 'ผ่าน'),
('6210612717', 'นางสาว', 'กาญดา นิรัน', 'Mis.', 'Kanda Niran', 'kanda.nir@dome.tu.ac.th', '0928862240', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', NULL, NULL, NULL, '1', 'student', NULL, 0, 'รอบริษัทประเมิน'),
('6310611006', 'นาย', 'วงศกร กองกะมุด', 'Mr.', 'wongsakron kongkamud', 'wongsakron.kon@dome.tu.ac.th', '0917855593', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', 'ไม่มี', 'ไม่นอน', '4.0', '2', 'student', '6310611006/resume.pdf', 0, 'รอบริษัทประเมิน'),
('6310611025', 'นาย', 'ไพศาล มาดี', 'Mr.', 'Paisan Madi', 'paisan.mad@dome.tu.ac.th', '0939985594', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', NULL, NULL, NULL, '1', 'student', NULL, 0, 'รอบริษัทประเมิน'),
('6310611028', 'นางสาว', 'อังคณา วงค์วร', 'Mis.', 'Angkana Wongworn', 'angkana.won@dome.tu.ac.th', '0631619992', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', NULL, NULL, NULL, '4', 'student', NULL, 1, 'ไม่ผ่าน'),
('6310611030', 'นางสาว', 'ญาดา นะดี', 'Mis.', 'Yada Nadee', 'yada.nad@dome.tu.ac.th', '091789203', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', 'ไม่มี', 'ไม่นอน', '4.0', '3', 'student', NULL, 0, 'รอบริษัทประเมิน'),
('6310611032', 'นางสาว', 'อลิซ ซาดี', 'Mis.', 'Alice Sadie', 'alice.sad@dome.tu.ac.th', '0881519425', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', NULL, NULL, NULL, '3', 'student', NULL, 0, 'รอบริษัทประเมิน'),
('6310611037', 'นางสาว', 'มาลิสา งามจิต', 'Mis.', 'Malisa Ngamjit', 'malisa.nga@dome.tu.ac.th', '0862471987', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', NULL, NULL, NULL, '3', 'student', NULL, 0, 'รอบริษัทประเมิน'),
('6310611038', 'นาย', 'วันทนา เกิดผล', 'Mr.', 'Wantana Kerdphon', 'wantana.ker@dome.tu.ac.th', '0921789996', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', NULL, NULL, NULL, '0', 'student', NULL, 0, 'รอบริษัทประเมิน'),
('6310611042', 'นาย', 'เอกสิทธิ์ วันทนา', 'Mr.', 'Ekkasit Wantana', 'ekkasit.wan@dome.tu.ac.th', '0667678884', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', NULL, NULL, NULL, '0', 'student', NULL, 0, 'รอบริษัทประเมิน');

-- --------------------------------------------------------

--
-- Table structure for table `studentcsv`
--

CREATE TABLE `studentcsv` (
  `permission_id` int(11) NOT NULL,
  `username` varchar(11) NOT NULL,
  `academic_year` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `studentcsv`
--

INSERT INTO `studentcsv` (`permission_id`, `username`, `academic_year`) VALUES
(309, '6310611006', '2566'),
(310, '6310611025', '2566'),
(311, '6310611026', '2566'),
(312, '6310611027', '2566'),
(313, '6310611028', '2566'),
(314, '6310611029', '2566'),
(315, '6310611030', '2566'),
(316, '6310611031', '2566'),
(317, '6310611032', '2566'),
(318, '6310611033', '2566'),
(319, '6310611034', '2566'),
(320, '6310611035', '2566'),
(321, '6310611036', '2566'),
(322, '6310611037', '2566'),
(323, '6310611038', '2566'),
(324, '6310611039', '2566'),
(325, '6310611040', '2566'),
(326, '6310611041', '2566'),
(327, '6310611042', '2566'),
(345, '6210612716', '2566'),
(347, '6210612717', '2566');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `apply`
--
ALTER TABLE `apply`
  ADD PRIMARY KEY (`apply_id`),
  ADD KEY `fk_apply_employer_id` (`employer_id`),
  ADD KEY `fk_apply_student_id` (`std_id`),
  ADD KEY `fk_apply_post_id` (`job_id`);

--
-- Indexes for table `confirm`
--
ALTER TABLE `confirm`
  ADD PRIMARY KEY (`confirm_id`),
  ADD KEY `fk_apply_employer_id` (`employer_id`),
  ADD KEY `fk_apply_student_id` (`std_id`),
  ADD KEY `fk_apply_post_id` (`job_id`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`doc_id`),
  ADD KEY `fk_doc_std_id` (`std_id`);

--
-- Indexes for table `edit_courtesy`
--
ALTER TABLE `edit_courtesy`
  ADD PRIMARY KEY (`edit_id`),
  ADD KEY `fk_edit_gen_id` (`std_id`);

--
-- Indexes for table `employee_tu`
--
ALTER TABLE `employee_tu`
  ADD PRIMARY KEY (`emp_tu_id`);

--
-- Indexes for table `employer`
--
ALTER TABLE `employer`
  ADD PRIMARY KEY (`employer_id`);

--
-- Indexes for table `emp_eval`
--
ALTER TABLE `emp_eval`
  ADD PRIMARY KEY (`emp_eval_id`);

--
-- Indexes for table `emp_question`
--
ALTER TABLE `emp_question`
  ADD PRIMARY KEY (`emp_question_id`);

--
-- Indexes for table `file_student`
--
ALTER TABLE `file_student`
  ADD PRIMARY KEY (`file_id`);

--
-- Indexes for table `gen_document`
--
ALTER TABLE `gen_document`
  ADD PRIMARY KEY (`gen_id`),
  ADD KEY `fk_gen_doc_std_id` (`std_id`),
  ADD KEY `fk_gen_doc_employer_id` (`employer_id`);

--
-- Indexes for table `gen_document_self`
--
ALTER TABLE `gen_document_self`
  ADD PRIMARY KEY (`gen_self_id`),
  ADD KEY `fk_gen_self_doc_self_enroll_id` (`self_enroll_id`),
  ADD KEY `fk_gen_self_doc_std_id` (`std_id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`news_id`);

--
-- Indexes for table `posts_job`
--
ALTER TABLE `posts_job`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `emp_id` (`emp_id`);

--
-- Indexes for table `reset_tokens`
--
ALTER TABLE `reset_tokens`
  ADD PRIMARY KEY (`user_id`,`token`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`schedule_id`);

--
-- Indexes for table `self_enroll`
--
ALTER TABLE `self_enroll`
  ADD PRIMARY KEY (`self_enroll_id`),
  ADD KEY `fk_self_enroll_std_id` (`std_id`);

--
-- Indexes for table `setup_courtesy`
--
ALTER TABLE `setup_courtesy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `std_eval`
--
ALTER TABLE `std_eval`
  ADD PRIMARY KEY (`std_eval_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`std_id`);

--
-- Indexes for table `studentcsv`
--
ALTER TABLE `studentcsv`
  ADD PRIMARY KEY (`permission_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `apply`
--
ALTER TABLE `apply`
  MODIFY `apply_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `confirm`
--
ALTER TABLE `confirm`
  MODIFY `confirm_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `doc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `edit_courtesy`
--
ALTER TABLE `edit_courtesy`
  MODIFY `edit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- AUTO_INCREMENT for table `employer`
--
ALTER TABLE `employer`
  MODIFY `employer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `emp_eval`
--
ALTER TABLE `emp_eval`
  MODIFY `emp_eval_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `emp_question`
--
ALTER TABLE `emp_question`
  MODIFY `emp_question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `file_student`
--
ALTER TABLE `file_student`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `gen_document`
--
ALTER TABLE `gen_document`
  MODIFY `gen_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `gen_document_self`
--
ALTER TABLE `gen_document_self`
  MODIFY `gen_self_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `news_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `posts_job`
--
ALTER TABLE `posts_job`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `self_enroll`
--
ALTER TABLE `self_enroll`
  MODIFY `self_enroll_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `setup_courtesy`
--
ALTER TABLE `setup_courtesy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `std_eval`
--
ALTER TABLE `std_eval`
  MODIFY `std_eval_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `studentcsv`
--
ALTER TABLE `studentcsv`
  MODIFY `permission_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=348;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `apply`
--
ALTER TABLE `apply`
  ADD CONSTRAINT `fk_apply_employer_id` FOREIGN KEY (`employer_id`) REFERENCES `employer` (`employer_id`),
  ADD CONSTRAINT `fk_apply_post_id` FOREIGN KEY (`job_id`) REFERENCES `posts_job` (`job_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_apply_student_id` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`);

--
-- Constraints for table `confirm`
--
ALTER TABLE `confirm`
  ADD CONSTRAINT `fk_confirm_employer_id` FOREIGN KEY (`employer_id`) REFERENCES `employer` (`employer_id`),
  ADD CONSTRAINT `fk_confirm_post_id` FOREIGN KEY (`job_id`) REFERENCES `posts_job` (`job_id`),
  ADD CONSTRAINT `fk_confirm_student_id` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`);

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `fk_doc_std_id` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`) ON UPDATE CASCADE;

--
-- Constraints for table `edit_courtesy`
--
ALTER TABLE `edit_courtesy`
  ADD CONSTRAINT `fk_edit_gen_id` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`) ON UPDATE CASCADE;

--
-- Constraints for table `gen_document`
--
ALTER TABLE `gen_document`
  ADD CONSTRAINT `fk_gen_doc_employer_id` FOREIGN KEY (`employer_id`) REFERENCES `employer` (`employer_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_gen_doc_std_id` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`) ON UPDATE CASCADE;

--
-- Constraints for table `gen_document_self`
--
ALTER TABLE `gen_document_self`
  ADD CONSTRAINT `fk_gen_self_doc_self_enroll_id` FOREIGN KEY (`self_enroll_id`) REFERENCES `self_enroll` (`self_enroll_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_gen_self_doc_std_id` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`) ON UPDATE CASCADE;

--
-- Constraints for table `posts_job`
--
ALTER TABLE `posts_job`
  ADD CONSTRAINT `fk_posts_employer_id` FOREIGN KEY (`emp_id`) REFERENCES `employer` (`employer_id`) ON UPDATE CASCADE;

--
-- Constraints for table `self_enroll`
--
ALTER TABLE `self_enroll`
  ADD CONSTRAINT `fk_self_enroll_std_id` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
