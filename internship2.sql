-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 14, 2024 at 09:33 AM
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
  `job_id` int(11) NOT NULL,
  `position` varchar(255) NOT NULL,
  `date_apply` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
  `date_confirm` date NOT NULL DEFAULT current_timestamp(),
  `require_doc` int(10) NOT NULL DEFAULT 0,
  `status` varchar(100) DEFAULT 'รอดำเนินเอกสาร'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `confirm`
--

INSERT INTO `confirm` (`confirm_id`, `std_id`, `employer_id`, `job_id`, `position`, `date_confirm`, `require_doc`, `status`) VALUES
(23, '6310611006', 13, 21, 'Data Engineer', '2024-03-12', 1, 'ดำเนินเอกสารเสร็จสิ้น');

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `doc_id` int(11) NOT NULL,
  `std_id` varchar(100) NOT NULL,
  `report_pdf` varchar(255) DEFAULT NULL,
  `report_docx` varchar(255) DEFAULT NULL,
  `timestamp_pdf` varchar(255) DEFAULT NULL,
  `present_pdf` varchar(255) DEFAULT NULL,
  `present_ppt` varchar(255) DEFAULT NULL,
  `date_upload` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`doc_id`, `std_id`, `report_pdf`, `report_docx`, `timestamp_pdf`, `present_pdf`, `present_ppt`, `date_upload`) VALUES
(1, '6310611006', '2566/6310611006/6210612716_resume.pdf', '2566/6310611006/CNP03-progress1-COVER.docx', '/2566/6310611006/6210612716_resume.pdf', '/2566/6310611006/test_resume.pdf', NULL, '2024-02-19'),
(2, '6310611006', '2566/6310611006/6210612716_resume.pdf', '2566/6310611006/CNP03-progress1-COVER.docx', '', '', NULL, '2024-02-20'),
(3, '6310611006', '', '', '', '', NULL, '2024-02-20'),
(4, '6310611006', '', '', '', '', NULL, '2024-03-11'),
(5, '6310611006', '', '', '', '', NULL, '2024-03-12');

-- --------------------------------------------------------

--
-- Table structure for table `edit_courtesy`
--

CREATE TABLE `edit_courtesy` (
  `edit_id` int(11) NOT NULL,
  `gen_id` int(11) NOT NULL,
  `number` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `name_to` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `edit_courtesy`
--

INSERT INTO `edit_courtesy` (`edit_id`, `gen_id`, `number`, `date`, `name_to`) VALUES
(17, 34, '๕๕', '๑๒  มีนาคม  ๒๕๖๗', 'หัวหน้ากองบุคลากร');

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
  `pcode` varchar(100) NOT NULL,
  `contact_name` varchar(100) NOT NULL,
  `contact_email` varchar(100) NOT NULL,
  `contact_tel` varchar(100) NOT NULL,
  `about` varchar(1000) DEFAULT NULL,
  `company_pic` varchar(100) DEFAULT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'notverify',
  `role` varchar(100) DEFAULT 'employer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `employer`
--

INSERT INTO `employer` (`employer_id`, `username`, `password`, `company_name`, `address`, `subdistrict`, `district`, `province`, `pcode`, `contact_name`, `contact_email`, `contact_tel`, `about`, `company_pic`, `status`, `role`) VALUES
(7, 'testemployer', '$2a$10$xCSXDv7Spug.AM4GBFCauuRZFUJpS/PcZxCTctczmDlRRPwRxaCT2', 'Example Company', '123 Main Street', 'Suburb', 'City', 'State', '12345', 'John Doe', 'john.doe@example.com', '1234567890', NULL, 'https://example.com/company_logo.jpg', 'verified', 'employer'),
(8, 'test10', '$2a$10$s.BP4ncjWW1wfGJpiCteoegAUoGNSuB1XLlc4Rocmfw.hiOKlpRuy', 'Example Company Edit2', '123 Main Street', 'Suburb', 'City', 'State', '12345', 'John Doe', 'john.doe@example.com', '1234567890', NULL, 'https://example.com/company_logo.jpg', 'notverify', 'employer'),
(9, 'wongsakron', '$2a$10$ATSJA43XKXSNVV0jUCIxc.HdbY99RTlPnA2Rlq.ubuAQNCh11l8Yi', 'test', 'test', 'test', 'test', 'bangkok', '10222', 'wongsakron', 'test@gmail.com', '0987866360', NULL, NULL, 'verified', 'employer'),
(10, 'test', '$2a$10$DZbXqt7xCXzVKFsUlY3eZuK5sJxRn392bfe5d4iuYpTUPrJard98G', 'test grop', 'test', 'test', 'test', 'bangkok', '10222', 'wongsakron', 'test@gmail.com', '0987866360', NULL, NULL, 'verified', 'employer'),
(11, 'test20', '$2a$10$n0caColWMSklCTVL76A4QuzkPeYXIcgLoZTiTeei8/3vpEDegQsrS', 'Example Company', '123 Main Street', 'Suburb', 'City', 'State', '12345', 'John Doe', 'john.doe@example.com', '1234567890', NULL, 'https://example.com/company_logo.jpg', 'notverify', 'employer'),
(12, 'test30', '$2a$10$NRKfZYV7aUYkfIzuQe5XcebXJXoAv55uptyhaMz0GSwfO6Gt/3xq6', 'test', 'wadawd', 'test', 'wdawd', 'bangkok', '10222', 'wongsakron', 'test@gmail.com', '0987866360', NULL, NULL, 'notverify', 'employer'),
(13, 'company1', '$2a$10$RSsHvxdBOayQ3/RLltpR1eE5vtZYX7ZBp9Hnp5NsUZhozi3vnGfV2', 'Tech Solutions Co., Ltd.', '88/42 Sukhumvit Road', 'Khlong Toei Nuea', 'Watthana', 'Bangkok', '10110', 'Siri Wong', 'siri.wong@example.com', '+6623456789', 'Tech Solutions Co., Ltd. is a leading technology company specializing in innovative software solutions and IT services. We are committed to delivering high-quality products to meet the evolving needs of our clients.', 'https://images.unsplash.com/photo-1533450718592-29d45635f0a9?q=80&w=2070&auto=format&fit=crop&ixlib=', 'verified', 'employer'),
(14, 'company2', '$2a$10$QBHrphR1ZdeBLaukoS3Qm.FbjH9Weq1oETGMW/f9b0firAeIbujKS', 'Design Hub Ltd.', '55/18 Ratchadaphisek Road', 'Chom Phon', 'Chatuchak', 'Bangkok', '10900', 'Aom Kittisak', 'aom.kittisak@example.com', '+6629876543', 'Design Hub Ltd. is a creative design agency specializing in user-centric designs for web and mobile applications. Our talented team of designers is dedicated to delivering visually appealing and intuitive solutions.', 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=2080&auto=format&fit=crop&ixlib=', 'notverify', 'employer'),
(15, 'company3', '$2a$10$IyKuur14AbgY7lEeE.adzefV6KTY0HdXuXJO5pH.A6zi73HpZj7AK', 'Networking Solutions Co., Ltd.', '120/15 Phahonyothin Road', 'Phaya Thai', 'Samsen Nai', 'Bangkok', '10400', 'Nat Kanya', 'nat.kanya@example.com', '+6621234567', 'Networking Solutions Co., Ltd. is a leading provider of network infrastructure solutions. We specialize in designing and implementing robust and secure networks to meet the connectivity needs of businesses.', 'https://images.unsplash.com/photo-1643270650324-f06418d5081a?q=80&w=1974&auto=format&fit=crop&ixlib=', 'notverify', 'employer'),
(16, 'company4', '$2a$10$QOFyJOI1cU4XsmC3B6pm/.83RxFqSKNdbFtOzD8bSjdy47XNsnHli', 'Marketing Plus Co., Ltd.', '30/14 Silom Road', 'Silom', 'Bang Rak', 'Bangkok', '10500', 'Mike Phongchai', 'mike.phongchai@example.com', '+6623456789', 'Marketing Plus Co., Ltd. is a dynamic marketing agency specializing in strategic marketing solutions. Our team is passionate about creating impactful campaigns to elevate brands and drive business success.', 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2079&auto=format&fit=crop&ixlib=', 'notverify', 'employer'),
(17, 'company5', '$2a$10$ppm/rR2frTvsGChHFlS5U.I6nWDkBMt6ibwaFascMKo5rEymfmW..', 'Finance Solutions Ltd.', '75/21 Charoen Krung Road', 'Wat Phraya Krai', 'Bang Kho Laem', 'Bangkok', '10120', 'Nina Somchai', 'nina.somchai@example.com', '+6629876543', 'Finance Solutions Ltd. is a reputable financial consulting firm providing expert analysis and solutions. Our dedicated team is committed to helping businesses achieve financial success and stability.', 'https://images.unsplash.com/photo-1477238134895-98438ad85c30?q=80&w=2070&auto=format&fit=crop&ixlib=', 'notverify', 'employer');

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
  `courtesy` varchar(100) NOT NULL,
  `courtesy_license` varchar(100) NOT NULL,
  `intern_letter` varchar(100) NOT NULL,
  `date_gen` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `gen_document`
--

INSERT INTO `gen_document` (`gen_id`, `std_id`, `employer_id`, `courtesy`, `courtesy_license`, `intern_letter`, `date_gen`) VALUES
(34, '6310611006', 13, '2566/6310611006/courtesy_6310611006.pdf', '2566/6310611006/courtesy_license_6310611006.pdf', '', '2024-03-12');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `news_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `topic` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `cover_img` varchar(255) DEFAULT NULL,
  `images` varchar(255) DEFAULT NULL,
  `postedTime` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`news_id`, `teacher_id`, `topic`, `detail`, `cover_img`, `images`, `postedTime`) VALUES
(23, 1, 'test1', '<p>test1</p>', 'admin/428699582_930057592119624_6960808521435962269_n.jpg', 'admin/428699582_930057592119624_6960808521435962269_n.jpg,admin/feverfew-4743930_640.jpg', '2024-02-29'),
(24, 1, 'test10', '<p>test10</p>', 'admin/428699582_930057592119624_6960808521435962269_n.jpg', 'admin/428699582_930057592119624_6960808521435962269_n.jpg,admin/feverfew-4743930_640.jpg', '2024-03-03'),
(25, 1, 'test1', '<p>test2</p>', 'admin/428699582_930057592119624_6960808521435962269_n.jpg', 'admin/428699582_930057592119624_6960808521435962269_n.jpg,admin/feverfew-4743930_640.jpg', '2024-03-04'),
(26, 1, 'test1', '<p>test1</p>', 'admin/428699582_930057592119624_6960808521435962269_n.jpg', 'admin/428699582_930057592119624_6960808521435962269_n.jpg,admin/feverfew-4743930_640.jpg', '2024-03-04'),
(27, 1, 'นอนกันดีกว่า', '<h1>นอนหลับอย่างไรให้ได้คุณภาพ</h1><p><br></p><p>ร่างกายของเราทุกคนต้องนอนหลับพักผ่อนตามตารางของนาฬิกาชีวิต แต่จะหลับอย่างไรจึงจะดีต่อสุขภาพมากที่สุด แล้วตื่นมาพร้อมความรู้สึกสดชื่น</p><p>เรื่องของการนอนต้องคำนึง 2 อย่างคือ</p><ol><li>ชั่วโมงการนอน ถ้าจะให้สมบูรณ์แบบควรนอนให้ได้ 7 – 8 ชั่วโมง แต่ละวัยต้องการจำนวนการนอนจะไม่เท่ากัน ชั่วโมงการนอนของเด็ก 11 – 13 ชั่วโมง ผู้ใหญ่ 7 – 8 ชั่วโมง</li><li>คุณภาพการหลับ การหลับอย่างมีคุณภาพ คือ ครบวงจรทุกระยะการหลับ ทั้งหลับตื้น หลับลึก และหลับฝัน ให้ครบทุกระยะเพราะมีความสัมพันธ์กัน</li></ol><h3><span style=\"color: rgb(54, 54, 54);\">วงจรการหลับ 3 ระยะ</span></h3><p>วงจรการนอนหลับในคนปกติทั่วไป มักใช้เวลาตั้งแต่ 30 วินาที – 7 นาที เป็นสภาพที่แม้จะได้รับการกระตุ้นเพียงเล็กน้อยก็จะตื่น จากนั้นเข้าสู่การหลับระยะต่าง ๆ</p><ol><li>หลับตื้น เป็นระยะแรกที่มีการหลับตื้นอย่างแท้จริง แต่ยังไม่มีการฝัน</li><li>หลับลึก ร่างกายจะเข้าสู่โหมดพักผ่อนเมื่อเข้าสู่ระยะหลับลึกเป็นช่วงหลับสนิทที่สุดของการนอนใช้เวลา 30 – 60 นาที ช่วงระยะนี้อุณหภูมิร่างกายและความดันโลหิตจะลดลง อัตราการเต้นของหัวใจลดลงเหลือประมาณ 60 ครั้งต่อนาที โกรทฮอร์โมนจะหลั่งในระยะนี้</li><li>หลับฝันอีกระยะหนึ่งที่สำคัญคือ ช่วงหลับฝันร่างกายจะได้พักผ่อน แต่สมองจะยังตื่นตัวอยู่ นอกจากนี้การหลับฝันยังช่วยจัดระบบความจำในเรื่องของทักษะต่าง ๆ ดังนั้น การนอนหลับที่ดีต้องได้ทั้งชั่วโมงการนอนและคุณภาพการหลับด้วย</li></ol><p>แม้ว่าบางคนนอนหลับเพียง 4 – 5 ชั่วโมง แล้วตื่นมาสดชื่น ต้องดูว่าเป็นแค่หลับตื้นหรือเปล่า เนื่องจากระยะการหลับตื้นทำให้สดชื่นได้ จึงต้องดูว่าความสามารถในเรื่องอื่น ๆ เป็นอย่างไร หากสังเกตว่าตื่นมาสดชื่นแต่ความสามารถในเรื่องอื่น ๆ ลดลง นั่นแสดงว่า ชั่วโมงการนอนไม่เพียงพอ ควรที่จะนอนหลับให้นานกว่านั้น เพื่อให้ได้เปอร์เซ็นต์การนอนของแต่ละระยะให้นานขึ้น</p><p>หรือบางคนนอนมากกว่า 7 – 8 ชั่วโมง แต่ตื่นมาแล้วไม่สดชื่น เป็นไปได้ว่าชั่วโมงการนอนเพียงพอ แต่คุณภาพการนอนไมได้ คือได้แค่หลับตื้นไม่เข้าสู่ระยะหลับลึก ซึ่งต้องไปหาสาเหตุต่อว่า ทำไมไม่สามารถเข้าสู่ระยะหลับลึกได้เป็นเพราะอะไร</p><p><br></p>', 'admin/428699582_930057592119624_6960808521435962269_n.jpg', 'admin/428699582_930057592119624_6960808521435962269_n.jpg,admin/feverfew-4743930_640.jpg', '2024-03-05'),
(28, 1, 'test', '<p>Hello World</p>', 'admin/feverfew-4743930_640.jpg', 'admin/428699582_930057592119624_6960808521435962269_n.jpg,admin/feverfew-4743930_640.jpg', '2024-03-05'),
(29, 1, 'นอนวันละ 8 ชั่วโมง', '<p><span style=\"color: rgb(54, 54, 54);\">ภัยเงียบจากหลับ ๆ ตื่น ๆ</span>บางคนชั่วโมงการนอนหลับสั้น แต่คุณภาพของการหลับได้ ส่วนหนึ่งเกิดจากปัจจัยภายในร่างกายทางด้านพันธุกรรมเข้ามาเกี่ยวข้องและการปรับตัวของร่างกาย</p><p>ส่วนคนที่ชั่วโมงการนอนเยอะ แต่ตื่นมาแล้วกลับไม่สดชื่นนั้น เป็นเพราะนอนได้แค่ระยะหลับตื้นหรือสะดุ้งตื่นเป็นพัก ๆ มีผลทำให้การทำงานของระบบหายใจและหลอดเลือดทำงานหนัก กลายเป็นว่าตื่นมาแล้วรู้สึกเพลียแทนที่จะรู้สึกสดชื่น</p><p>ปัจจุบันผู้ป่วยจำนวนมากที่มารับการตรวจสุขภาพแล้วพบว่า มีปัญหาความผิดปกติในการนอนร่วมด้วยและพบมากขึ้นเรื่อย ๆ ถือเป็นภัยเงียบที่เป็นต้นเหตุสำคัญที่เพิ่มความเสี่ยงต่อการเกิดโรคต่าง ๆ อาทิ ความดันโลหิตสูง เบาหวาน โรคหลอดเลือดสมองอุดตัน โรคหลอดเลือดหัวใจ</p><p>อาการที่อาจเกิดขึ้นจากการนอนหลับไม่เต็มที่ซึ่งพบได้บ่อย เช่น ง่วงและเพลียกลางวัน ประสิทธิภาพความคิดความจำลดลง ลืมง่าย กลางคืนหลับ ๆ ตื่น ๆ นอนกรนร่วมกับหยุดหายใจชั่วขณะ ซึ่งจำเป็นต้องได้รับการวินิจฉัยที่ถูกต้องเพื่อหาสาเหตุที่ทำให้เกิดอาการดังกล่าว</p><p>ฉะนั้นการนอนหลับที่มีคุณภาพไม่ได้ขึ้นอยู่กับเวลาแค่จำนวน 7 – 8 ชั่วโมงเท่านั้น แต่ยังขึ้นอยู่กับระดับความลึกของการนอนหลับ เพื่อให้ร่างกายและสมองได้รับการพักผ่อนอย่างเต็มที่ และเวลาเข้านอน – ตื่นนอนที่เหมาะสม ไม่ควรนอนดึกหรือตื่นสายจนเกินไป</p>', 'admin/Screenshot 2024-02-20 222413.png', 'admin/428699582_930057592119624_6960808521435962269_n.jpg,admin/S__7790739.jpg', '2024-03-05');

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
  `position_num` varchar(255) DEFAULT NULL,
  `work_hours` varchar(255) NOT NULL,
  `salary` varchar(255) NOT NULL,
  `welfare` varchar(255) DEFAULT NULL,
  `qualifications` varchar(255) NOT NULL,
  `desc` varchar(1000) NOT NULL,
  `other` varchar(1000) DEFAULT NULL,
  `cat` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`cat`)),
  `name_to` varchar(100) NOT NULL,
  `dateStartPost` date NOT NULL DEFAULT current_timestamp(),
  `dateEndPost` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `posts_job`
--

INSERT INTO `posts_job` (`job_id`, `emp_id`, `job_title`, `location`, `district`, `subdistrict`, `province`, `pcode`, `contact_email`, `contact_tel`, `position_num`, `work_hours`, `salary`, `welfare`, `qualifications`, `desc`, `other`, `cat`, `name_to`, `dateStartPost`, `dateEndPost`) VALUES
(5, 8, 'Software Engineer2', '123/234 main road 2th funbuilding', 'Example District', 'Example Subdistrict', 'Example Province', '12345', 'example@email.com', '+1234567890', 'SE123', '8:00 - 17:00', '80000', 'candy', 'Bachelor\'s Degree in Computer Science', 'Exciting software engineering opportunity!', '', '\"[\\\"Programming\\\",\\\"Engineering\\\"]\"', '', '2024-01-25', '2024-02-25'),
(6, 13, 'Software Developer', '88/42 Sukhumvit Road', 'Watthana', 'Khlong Toei Nuea', 'Bangkok', '10110', 'devjob@example.com', '+6623456789', '3', '9:00 - 18:00', '300', 'health insurance', 'Bachelor\'s Degree in Computer Science', 'Exciting software development opportunity!', '', '\"[\\\"Programming\\\",\\\"Engineering\\\"]\"', '', '2024-01-25', '2024-02-25'),
(7, 14, 'Web Designer', '55/18 Ratchadaphisek Road', 'Chatuchak', 'Chom Phon', 'Bangkok', '10900', 'designer@example.com', '+6629876543', '2', '10:00 - 19:00', '200', 'flexible work schedule', 'Bachelor\'s Degree in Design', 'Exciting web design opportunity!', '', '\"[\\\"Design\\\",\\\"Web Development\\\"]\"', '', '2024-01-20', '2024-02-20'),
(8, 15, 'Network Engineer', '120/15 Phahonyothin Road', 'Samsen Nai', 'Phaya Thai', 'Bangkok', '10400', 'network@example.com', '+6621234567', '4', '8:30 - 17:30', '400', 'bonus incentives', 'Bachelor\'s Degree in Information Technology', 'Exciting network engineering opportunity!', '', '\"[\\\"IT\\\",\\\"Networking\\\"]\"', '', '2024-01-22', '2024-02-22'),
(9, 16, 'Digital Marketing Specialist', '30/14 Silom Road', 'Bang Rak', 'Silom', 'Bangkok', '10500', 'marketing@example.com', '+6623456789', '2', '9:00 - 18:00', '200', 'health coverage', 'Bachelor\'s Degree in Marketing', 'Exciting digital marketing opportunity!', '', '\"[\\\"Marketing\\\",\\\"Digital Marketing\\\"]\"', '', '2024-01-18', '2024-02-18'),
(10, 17, 'Financial Analyst', '75/21 Charoen Krung Road', 'Bang Kho Laem', 'Wat Phraya Krai', 'Bangkok', '10120', 'finance@example.com', '+6629876543', '3', '8:00 - 17:00', '300', '401(k) matching', 'Bachelor\'s Degree in Finance', 'Exciting financial analysis opportunity!', '', '\"[\\\"Finance\\\",\\\"Analysis\\\"]\"', '', '2024-01-25', '2024-02-25'),
(12, 13, 'testOther', 'thaiBimai', 'บางเขน', 'อนุสาวรีย์', 'กรุงเทพ', '10222', 'test@gmail.com', '0987866360', '5', '12.00 - 13.00', '333', 'ไ่ม่มี', 'ไม่มี', '<p>ทดสอบรายละเอียดงาน</p>', 'คิดไม่ออก', '\"[\\\"Data Engineer\\\",\\\"DepOps\\\",\\\"Data Sci\\\"]\"', 'นายเอกพันธ์', '2024-02-06', '2024-02-06'),
(19, 13, '', '', 'บางเขน', 'อนุสาวรีย์', 'กรุงเทพมหานคร', '10220', '', '', '', '', '', '', '', '', '', '\"[\\\"Data Engineer\\\",\\\"DepOps\\\"]\"', '', '2024-03-05', '2024-03-05'),
(20, 13, 'ไกฟไก', 'ไฟกฟ', 'ถลาง', 'เทพกระษัตรี', 'กรุงเทพมหานคร', '10220', 'wongsakronkongkamud@gmail.com', '0927866309', '6', '122.00', '18998', 'ไม่มี', 'wasdaw', '<p>awdzsxcw</p>', '', '\"[\\\"Front-End\\\",\\\"Network Engineer\\\"]\"', 'นายเอกสิท', '2024-03-11', '2024-03-11'),
(21, 13, 'เว็ปเเอปเดวลอป', 'กรุงเทพ', 'ดงหลวง', 'กกตูม', 'มุกดาหาร', '49140', 'test@test.com', '0927866309', '5', '12:00', '100', 'ไม่มี', '-', '<p>เขียนโค้ดวันละ 5 นาที ที่เหลือนอน</p>', '', '\"[\\\"Data Engineer\\\",\\\"Data Sci\\\",\\\"DepOps\\\"]\"', 'หัวหน้ากองบุคลากร', '2024-03-13', '2024-03-22');

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
  `date_enroll` date DEFAULT current_timestamp(),
  `displayname_th` varchar(100) NOT NULL,
  `require_doc` int(11) NOT NULL DEFAULT 0,
  `status` varchar(100) DEFAULT 'รอดำเนินเอกสาร'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `self_enroll`
--

INSERT INTO `self_enroll` (`self_enroll_id`, `std_id`, `company_name`, `company_address`, `to_who`, `tel`, `email`, `date_enroll`, `displayname_th`, `require_doc`, `status`) VALUES
(9, '6210612716', 'awdawd', 'wdawd', 'awdawddawd', '0927866309', 'puchit.kle@dome.tu.ac.th', '2024-03-12', 'ภูชิชย์ กลีบมาลัย', 0, 'รอดำเนินเอกสาร');

-- --------------------------------------------------------

--
-- Table structure for table `setup_courtesy`
--

CREATE TABLE `setup_courtesy` (
  `id` int(11) NOT NULL,
  `start_date` varchar(100) NOT NULL,
  `end_date` varchar(100) NOT NULL,
  `head_name` varchar(100) NOT NULL,
  `signature_img` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `setup_courtesy`
--

INSERT INTO `setup_courtesy` (`id`, `start_date`, `end_date`, `head_name`, `signature_img`) VALUES
(1, '๕ มิถุนายน', '๘ สิงหาคม', 'รองศาสตราจารย์ ประหยัด จันดารา', NULL),
(2, '๕ มิถุนายน', '๘ สิงหาคม', '2รองศาสตราจารย์ ประหยัด จันดารา', NULL),
(3, '123', '123', '123', NULL),
(4, '123', '123', '123', NULL),
(5, '6 สิงหาคม', '20 ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(6, '๖ มิถุนายน', '๗ สิงหาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(7, '123123', '12312', '3awda', NULL),
(8, '1321', 'sadaw', '123wdad', NULL),
(9, '1321', 'sadaw', '123wdad', NULL),
(10, '1321', 'sadaw', '123wdad', NULL),
(11, '๖ มิถุนายน', '๗ สิงหาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(12, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(13, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(14, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(15, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(16, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(17, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(18, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(19, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(20, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(21, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(22, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', NULL),
(23, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', 'admin/siganture.png'),
(24, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', 'admin/siganture.png'),
(25, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/siganture.png'),
(26, '๖ มิถุนายน', '๒๖ ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/siganture.png'),
(27, '๖ มิถุนายน', '๗ สิงหาคม', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/signature2.png'),
(28, '๖ มิถุนายน', '๗ สิงหาคม', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/siganture.png'),
(29, '6 สิงหาคม', '20 ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/signature2.png'),
(30, '๖ มิถุนายน', '๗ สิงหาคม', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/siganture.png'),
(31, '6 สิงหาคม', '20 ตุลาคม', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/signature3.png'),
(32, '6 สิงหาคม', '๗ สิงหาคม', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/signature4.png'),
(33, '๖ มิถุนายน', '๗ สิงหาคม', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/signature5.jpg'),
(34, '๖ มิถุนายน', '๗ สิงหาคม', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/siganture.png'),
(35, '2024-03-11T17:00:00.000Z', '2024-05-10T17:00:00.000Z', '123', '2566/admin/signature5.jpg'),
(36, '2024-03-11T17:00:00.000Z', '2024-05-10T17:00:00.000Z', 'รองศาสตราจารย์ วิน   ดีเซล', '2566/admin/signature5.jpg'),
(37, '๑๒  มีนาคม', '๑๑  พฤษภาคม', '3awda', '2566/admin/signature3.png'),
(38, '๑๒  มีนาคม', '๑๑  พฤษภาคม}', 'รองศาสตรา วิน  ดีเซล', '2566/admin/signature5.jpg'),
(39, '๕  มิถุนายน', '๔  สิงหาคม}', 'รองศาสตรา วิน  ดีเซล', '2566/admin/signature5.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `std_id` varchar(11) NOT NULL,
  `displayname_th` varchar(100) NOT NULL,
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
  `resume` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`std_id`, `displayname_th`, `displayname_en`, `email`, `tel`, `department`, `faculty`, `experience`, `skill`, `gpa`, `status`, `role`, `resume`) VALUES
('6210612716', 'ภูชิชย์ กลีบมาลัย', 'puchit kleebmalai', 'puchit.kle@dome.tu.ac.th', NULL, 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', NULL, NULL, NULL, '0', 'student', NULL),
('6310611006', 'วงศกร กองกะมุด', 'wongsakron kongkamud', 'wongsakron.kon@dome.tu.ac.th', '091111199999', 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์', 'คณะวิศวกรรมศาสตร์', 'ไม่มี', 'ไม่นอน', '4.0', '2', 'student', '2566/6310611006/6310611006_resume.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `studentcsv`
--

CREATE TABLE `studentcsv` (
  `permission_id` int(11) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `studentcsv`
--

INSERT INTO `studentcsv` (`permission_id`, `username`) VALUES
(175, '6310611006');

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
  ADD KEY `fk_edit_gen_id` (`gen_id`);

--
-- Indexes for table `employer`
--
ALTER TABLE `employer`
  ADD PRIMARY KEY (`employer_id`);

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
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`news_id`),
  ADD KEY `fk_news_id_techer_id` (`teacher_id`);

--
-- Indexes for table `posts_job`
--
ALTER TABLE `posts_job`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `emp_id` (`emp_id`);

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
  MODIFY `apply_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `confirm`
--
ALTER TABLE `confirm`
  MODIFY `confirm_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `doc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `edit_courtesy`
--
ALTER TABLE `edit_courtesy`
  MODIFY `edit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `employer`
--
ALTER TABLE `employer`
  MODIFY `employer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `file_student`
--
ALTER TABLE `file_student`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `gen_document`
--
ALTER TABLE `gen_document`
  MODIFY `gen_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `news_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `posts_job`
--
ALTER TABLE `posts_job`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `self_enroll`
--
ALTER TABLE `self_enroll`
  MODIFY `self_enroll_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `setup_courtesy`
--
ALTER TABLE `setup_courtesy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `studentcsv`
--
ALTER TABLE `studentcsv`
  MODIFY `permission_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `apply`
--
ALTER TABLE `apply`
  ADD CONSTRAINT `fk_apply_employer_id` FOREIGN KEY (`employer_id`) REFERENCES `employer` (`employer_id`),
  ADD CONSTRAINT `fk_apply_post_id` FOREIGN KEY (`job_id`) REFERENCES `posts_job` (`job_id`),
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
  ADD CONSTRAINT `fk_edit_gen_id` FOREIGN KEY (`gen_id`) REFERENCES `gen_document` (`gen_id`) ON UPDATE CASCADE;

--
-- Constraints for table `gen_document`
--
ALTER TABLE `gen_document`
  ADD CONSTRAINT `fk_gen_doc_employer_id` FOREIGN KEY (`employer_id`) REFERENCES `employer` (`employer_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_gen_doc_std_id` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`) ON UPDATE CASCADE;

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `fk_news_id_techer_id` FOREIGN KEY (`teacher_id`) REFERENCES `admin` (`admin_id`) ON UPDATE CASCADE;

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
