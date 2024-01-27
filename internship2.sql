-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 26, 2024 at 02:05 PM
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
-- Database: `internship2`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(100) NOT NULL,
  `username` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `role` varchar(55) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `username`, `password`, `role`) VALUES
(1, 'admin', '$2a$12$AE4w2JQSuSF9hzhbwAPsq.mw/6.htCXiYQUlPMrtlp2x.WHqoSs6C', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `employer`
--

CREATE TABLE `employer` (
  `employer_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `subdistrict` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `pcode` varchar(100) NOT NULL,
  `contact_name` varchar(100) NOT NULL,
  `contact_email` varchar(100) NOT NULL,
  `contact_tel` varchar(100) NOT NULL,
  `company_pic` varchar(100) DEFAULT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'notverify',
  `role` varchar(100) DEFAULT 'employer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `employer`
--

INSERT INTO `employer` (`employer_id`, `username`, `password`, `company_name`, `address`, `subdistrict`, `district`, `province`, `country`, `pcode`, `contact_name`, `contact_email`, `contact_tel`, `company_pic`, `status`, `role`) VALUES
(7, 'testemployer', '$2a$10$xCSXDv7Spug.AM4GBFCauuRZFUJpS/PcZxCTctczmDlRRPwRxaCT2', 'Example Company', '123 Main Street', 'Suburb', 'City', 'State', 'Country', '12345', 'John Doe', 'john.doe@example.com', '1234567890', 'https://example.com/company_logo.jpg', 'verified', 'employer'),
(8, 'test10', '$2a$10$s.BP4ncjWW1wfGJpiCteoegAUoGNSuB1XLlc4Rocmfw.hiOKlpRuy', 'Example Company Edit', '123 Main Street', 'Suburb', 'City', 'State', 'Country', '12345', 'John Doe', 'john.doe@example.com', '1234567890', 'https://example.com/company_logo.jpg', 'notverify', 'employer'),
(9, 'wongsakron', '$2a$10$ATSJA43XKXSNVV0jUCIxc.HdbY99RTlPnA2Rlq.ubuAQNCh11l8Yi', 'test', 'test', 'test', 'test', 'bangkok', 'thai', '10222', 'wongsakron', 'test@gmail.com', '0987866360', NULL, 'verified', 'employer'),
(10, 'test', '$2a$10$DZbXqt7xCXzVKFsUlY3eZuK5sJxRn392bfe5d4iuYpTUPrJard98G', 'test grop', 'test', 'test', 'test', 'bangkok', 'test', '10222', 'wongsakron', 'test@gmail.com', '0987866360', NULL, 'verified', 'employer'),
(11, 'test20', '$2a$10$n0caColWMSklCTVL76A4QuzkPeYXIcgLoZTiTeei8/3vpEDegQsrS', 'Example Company', '123 Main Street', 'Suburb', 'City', 'State', 'Country', '12345', 'John Doe', 'john.doe@example.com', '1234567890', 'https://example.com/company_logo.jpg', 'notverify', 'employer'),
(12, 'test30', '$2a$10$NRKfZYV7aUYkfIzuQe5XcebXJXoAv55uptyhaMz0GSwfO6Gt/3xq6', 'test', 'wadawd', 'test', 'wdawd', 'bangkok', 'thai', '10222', 'wongsakron', 'test@gmail.com', '0987866360', NULL, 'notverify', 'employer');

-- --------------------------------------------------------

--
-- Table structure for table `posts_job`
--

CREATE TABLE `posts_job` (
  `job_id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `skill` varchar(255) NOT NULL,
  `work_hours` varchar(255) NOT NULL,
  `salary` varchar(255) NOT NULL,
  `contract` varchar(255) NOT NULL,
  `qualifications` varchar(255) NOT NULL,
  `desc` varchar(1000) NOT NULL,
  `cat` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`cat`)),
  `dateStartPost` date NOT NULL DEFAULT current_timestamp(),
  `dateEndPost` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `posts_job`
--

INSERT INTO `posts_job` (`job_id`, `emp_id`, `job_title`, `location`, `skill`, `work_hours`, `salary`, `contract`, `qualifications`, `desc`, `cat`, `dateStartPost`, `dateEndPost`) VALUES
(1, 8, 'wadwd', 'dawdaw', 'dawda', 'wdawd', 'awdaw', 'dawd', 'wadawd', '<p>awdawd</p>', '\"[\\\"Frontend\\\",\\\"Backend\\\"]\"', '2024-01-23', '2024-01-23'),
(2, 8, 'aswad', 'awd', 'awd', 'awd', 'dwad', 'wd', 'dwdaw', '<p>awd</p>', '\"[\\\"Backend\\\",\\\"Datasci\\\"]\"', '2024-01-26', '2024-01-26'),
(3, 12, 'awda', 'wdaw', 'wdaw', 'wdawd', 'awdw', 'wadaw', 'wadw', '<p>awdawd</p>', '\"[]\"', '2024-01-26', '2024-01-26');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `std_id` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `displayname_th` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `displayname_en` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `department` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `faculty` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `experience` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `skill` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `gpa` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `status` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '1',
  `role` varchar(55) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`std_id`, `displayname_th`, `displayname_en`, `email`, `department`, `faculty`, `experience`, `skill`, `gpa`, `status`, `role`) VALUES
('6310611006', 'edit name', 'wongsakron kongkamud', 'wongsakron.kon@dome.tu.ac.th', 'engineer', 'computer', 'no experience', 'sleep', '5.00', '0', 'student');

-- --------------------------------------------------------

--
-- Table structure for table `studentcsv`
--

CREATE TABLE `studentcsv` (
  `permission_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentcsv`
--

INSERT INTO `studentcsv` (`permission_id`, `username`) VALUES
(155, '6310611006'),
(156, '6310611029'),
(157, '6310611030'),
(158, '6310611031'),
(159, '6310611032'),
(160, '6310611033'),
(161, '6310611034'),
(162, '6310611035'),
(163, '6310611036'),
(164, '6310611037'),
(165, '6310611025'),
(166, '6310611026'),
(167, '6310611027'),
(168, '6310611028'),
(169, '6310611038'),
(170, '6310611039'),
(171, '6310611040'),
(172, '6310611041'),
(173, '6310611042');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `employer`
--
ALTER TABLE `employer`
  ADD PRIMARY KEY (`employer_id`);

--
-- Indexes for table `posts_job`
--
ALTER TABLE `posts_job`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `emp_id` (`emp_id`);

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
-- AUTO_INCREMENT for table `employer`
--
ALTER TABLE `employer`
  MODIFY `employer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `posts_job`
--
ALTER TABLE `posts_job`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `studentcsv`
--
ALTER TABLE `studentcsv`
  MODIFY `permission_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts_job`
--
ALTER TABLE `posts_job`
  ADD CONSTRAINT `fk_posts_employer_id` FOREIGN KEY (`emp_id`) REFERENCES `employer` (`employer_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
