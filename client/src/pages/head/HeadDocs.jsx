import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faCheck,
	faTimes,
	faPenToSquare,
	faXmark,
	faCheckDouble,
	faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import {
	faCircleCheck,
	faFile,
	faHourglassHalf,
} from "@fortawesome/free-regular-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import {
	customStyles,
	customStyles2,
} from "../../components/dataTableCustomStyles";
import NoTableData from "../../components/NoTableData";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import moment from "moment";
import axios from "axios";
import { format } from "date-fns";
import { th } from "date-fns/locale";

import Loading from "../../components/Loading";

//ใช้วิธี set value ภายใน modal
function HeadDocs() {
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const [dataConcat, setDataConcat] = useState([]);
	const [selfData, setSelfData] = useState([]);
	const [allEditData, setAllEditData] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [selectedItemsSelf, setSelectedItemsSelf] = useState([]);

	const [companyName, setCompanyName] = useState([]);
	
	// set Modal State
	//   const [showPreDataModal, setShowPreDataModal] = useState(false);

	const [MultiCreateModal, setMultiCreateModal] = useState(false);
	const [MultiCreateSelfModal, setMultiCreateSelfModal] = useState(false);

	const [createSelfCourtesyModal, setCreateSelfCourtesyModal] = useState(false);
	const [createSelfLetterModal, setCreateSelfLetterModal] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const [showCourtesyModal, setShowCourtesyModal] = useState(false);
	const [showLetterModal, setShowLetterModal] = useState(false);

	const [editShowModal, setEditShowModal] = useState(false);
	const [editCourtesyShowModal, setEditCourtesyShowModal] = useState(false);
	const [editLetterShowModal, setEditLetterShowModal] = useState(false);

	const [editPreDataModal, setEditPreDataModal] = useState(false);
	const [editPreDataCourtesyModal, setEditPreDataCourtesyModal] =
		useState(false);
	const [editPreDataLetterModal, setEditPreDataLetterModal] = useState(false);

	const [createModal, setCreateModal] = useState(false);
	const [resMultiCreateModal, setResMultiCreateModal] = useState(false);

	const [printStates, setPrintStates] = useState({});
	// set Modal Data
	const [modalData, setModalData] = useState({}); // Store data for the modal fields
	const [editModalData, setEditModalData] = useState({
		std_id: "",
		academic_year: "",
	}); // Store data for the edit
	const [editData, setEditData] = useState({
		number_courtesy: "",
		number_letter: "",
		date_courtesy: "",
		date_letter: "",
		name_to: "",
	}); // Store data for featch Edit

	// use to Re Render
	const [shouldRerender, setShouldRerender] = useState(false);

	// view DOC
	const [showDocModal, setShowDocModal] = useState(false);
	const [viewPdf, setViewPdf] = useState(null);

	const user = useSelector((state) => state.user);

	let found = false; // Flag variable to track if the condition is met
	let found_check = false;

	// Memoized selector function
	const memoizedUserToken = useMemo(() => user.user.token, [user.user.token]);

	const currentDate = new Date();

	const mappedData = data.map((item, index) => ({
		std_id: item.student.std_id,
		company_name: item.employer.company_name,
		displayname_th:
			item.student.name_title_th === null
				? item.student.displayname_th
				: item.student.name_title_th + item.student.displayname_th,
		email: item.student.email,
		tel: item.student.tel,
		date_gen_doc: formatDate(item.date_gen_doc),
		require_doc: item.require_doc,
		status: item.status,
		academic_year: item.academic_year,
	}));
	const mappedDataSelf = selfData.map((item, index) => ({
		self_enroll_id: item.self_enroll_id,
		std_id: item.std_id,
		company_name: item.company_name,
		company_address: item.company_address,
		displayname_th:
			item.student.name_title_th === null
				? item.displayname_th
				: item.student.name_title_th + item.displayname_th,
		email: item.email,
		tel: item.tel,
		date_gen_doc: formatDate(item.date_gen_doc),
		require_doc: item.require_doc,
		print: item.print,
		status: item.status,
		academic_year: item.academic_year,
	}));

	function formatDate(dateString) {
		const date = new Date(dateString);
		const formattedDate = `${date.getUTCFullYear()}-${String(
			date.getUTCMonth() + 1
		).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${String(
			date.getUTCHours()
		).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
		return formattedDate;
	}
	const concatDataFinalShow = mappedData.concat(mappedDataSelf);

	// Function to convert Arabic numerals to Thai numerals
	const arabicToThaiNumerals = (number) => {
		const thaiNumerals = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
		return number.toString().replace(/\d/g, (digit) => thaiNumerals[digit]);
	};
	const thaiMonths = [
		"มกราคม",
		"กุมภาพันธ์",
		"มีนาคม",
		"เมษายน",
		"พฤษภาคม",
		"มิถุนายน",
		"กรกฎาคม",
		"สิงหาคม",
		"กันยายน",
		"ตุลาคม",
		"พฤศจิกายน",
		"ธันวาคม",
	];

	const monthIndex = (inputDate) => {
		const monthI = moment(inputDate, "DD/M/YYYY").format("M") - 1;

		const convertedMonth = thaiMonths[monthI];
		return convertedMonth;
	};
	// Format date with Thai numerals
	// const formattedDate = `${arabicToThaiNumerals(
	// 	currentDate.getDate()
	// )}  ${monthIndex(currentDate.getMonth() + 1)}  ${arabicToThaiNumerals(
	// 	currentDate.getFullYear() + 543
	// )}`;
	const formattedDate = currentDate;

	// Convert Date object to Thai Date again -.-
	const monthIndexToThai = {
		1: "มกราคม",
		2: "กุมภาพันธ์",
		3: "มีนาคม",
		4: "เมษายน",
		5: "พฤษภาคม",
		6: "มิถุนายน",
		7: "กรกฎาคม",
		8: "สิงหาคม",
		9: "กันยายน",
		10: "ตุลาคม",
		11: "พฤศจิกายน",
		12: "ธันวาคม",
	};
	const formatThaiDate = (dateString) => {
		const date = new Date(dateString);
		const thDate = `${arabicToThaiNumerals(date.getDate())}  ${
			monthIndexToThai[date.getMonth() + 1]
		}  ${arabicToThaiNumerals(date.getFullYear() + 543)}`;
		return thDate;
	};

	// Convert Thai Date to Date object
	const thaiToArabicNumerals = (thaiNumeral) => {
		const thaiToArabicMap = {
			"๐": "0",
			"๑": "1",
			"๒": "2",
			"๓": "3",
			"๔": "4",
			"๕": "5",
			"๖": "6",
			"๗": "7",
			"๘": "8",
			"๙": "9",
		};
		return thaiNumeral
			.split("")
			.map((char) => thaiToArabicMap[char] || char)
			.join("");
	};
	const thaiMonthToNumber = {
		มกราคม: "01",
		กุมภาพันธ์: "02",
		มีนาคม: "03",
		เมษายน: "04",
		พฤษภาคม: "05",
		มิถุนายน: "06",
		กรกฎาคม: "07",
		สิงหาคม: "08",
		กันยายน: "09",
		ตุลาคม: "10",
		พฤศจิกายน: "11",
		ธันวาคม: "12",
	};
	const convertThaiDateToDate = (dateStr) => {
		const [day, month, year] = dateStr.split("  ").map((part) => part.trim());
		const arabicDay = thaiToArabicNumerals(day);
		const arabicYear = thaiToArabicNumerals(year);
		const monthNumber = thaiMonthToNumber[month];

		const gregorianYear = parseInt(arabicYear, 10) - 543;

		const dateString = `${gregorianYear}-${monthNumber}-${arabicDay}`;
		return new Date(dateString);
	};

	const renderToolbar = (Toolbar) => (
		<>
			<Toolbar />
			<div
				style={{
					borderTop: "1px solid rgba(0, 0, 0, 0.1)",
					marginTop: "4px",
					padding: "4px",
				}}
			></div>
		</>
	);

	const defaultLayoutPluginInstance = defaultLayoutPlugin({
		renderToolbar,
	});

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const listReqDoc = await axios.get(
					import.meta.env.VITE_APP_API + "/manageDocument",
					{
						headers: {
							authtoken: memoizedUserToken,
						},
					}
				);

				const allSelfEnroll = await axios.get(
					import.meta.env.VITE_APP_API + "/allSelfEnroll",
					{
						headers: {
							authtoken: memoizedUserToken,
						},
					}
				);

				const allEdit = await axios.get(
					import.meta.env.VITE_APP_API + "/showAllEditCourtesy"
				);

				const payloadGenSuccres = { in_system: listReqDoc.data };
				setAllEditData(allEdit.data);
				setSelfData(allSelfEnroll.data);
				// setDataConcat(response.data.concat(selfData));

				setData(listReqDoc.data);

				data.map((item, index) => {
					let payload = {
						std_id: item.student.std_id,
						company_name: item.employer.company_name,
						displayname_th: item.student.displayname_th,
						email: item.student.email,
						tel: item.student.tel,
						require_doc: item.require_doc,
					};
					dataConcat.push(payload);
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		// console.log(dataConcat);

		fetchData();
	}, [memoizedUserToken, shouldRerender]); // Only re-run effect if memoizedUserToken changes

	// pre Create Data and edit if haved data
	const handlePreCreateClick = (std_id, name_to, formattedDate) => {
		try {
			// if ถ้า edit data base ไม่เป็น [] else ใช้กัน []
			if (allEditData.length) {
				// หาตำเเหน่งที่ข้อมูลที่กดเข้ามาตรงกับข้อมูลที่เคยกรอกไหม ถ้าไม่มีจึงสร้างใหม่
				for (let i = 0; i < allEditData.length; i++) {
					// win ลองแก้ได้ไหม - คือถ้าตอนแรก std_id ตรง found = true แต่ถ้าต่อมากดแล้วไม่ตรง found ก็ยังเป็น true
					if (allEditData[i].std_id === std_id) {
						// console.log(allEditData[i].std_id);
						setEditData({
							std_id: allEditData[i].std_id || "",
							number_courtesy:
								thaiToArabicNumerals(allEditData[i].number_courtesy) || "",
							number_letter:
								thaiToArabicNumerals(allEditData[i].number_letter) || "",
							date_courtesy:
								convertThaiDateToDate(allEditData[i].date_courtesy) || "",
							date_letter:
								convertThaiDateToDate(allEditData[i].date_letter) || "",
							name_to: allEditData[i].name_to || "",
						});
						setEditPreDataModal(true);
						found = true;
						console.log("1");
						break;
					} else {
						found = false;
					}
				}
				// allEditData.map((item, i) => {
				// 	if (item.std_id === std_id) {
				// 		console.log(item.std_id);
				// 		// เพิ่ม modal เเต่ state ไม่น่าจำเป็น
				// 		setEditData({
				// 			std_id: item.std_id || "",
				// 			number_courtesy: item.number_courtesy || "",
				// 			number_letter: item.number_letter || "",
				// 			date_courtesy: item.date_courtesy || "",
				// 			date_letter: item.date_letter || "",
				// 			name_to: item.name_to || "",
				// 		});
				// 		setEditPreDataModal(true);
				// 		found = true;
				// 		console.log("1");
				// 	}
				// });
				if (!found) {
					{
						console.log("2");
						setModalData({
							std_id: std_id,
							name_to: name_to,
							date_courtesy: formattedDate,
							date_letter: formattedDate,
						});
						setShowModal(true);
					}
				}
			} else {
				setModalData({
					std_id: std_id,
					name_to: name_to,
					date_courtesy: formattedDate,
					date_letter: formattedDate,
				});
				setShowModal(true);
			}
		} catch (error) {
			console.error(error);
		}
	};
	// pre Create Data and edit if haved data Courtesy
	const handlePreCreateCourtesySelfClick = (std_id, name_to, formattedDate) => {
		try {
			// if ถ้า edit data base ไม่เป็น [] else ใช้กัน []
			if (allEditData.length) {
				// หาตำเเหน่งที่ข้อมูลที่กดเข้ามาตรงกับข้อมูลที่เคยกรอกไหม ถ้าไม่มีจึงสร้างใหม่
				for (let i = 0; i < allEditData.length; i++) {
					if (allEditData[i].std_id === std_id) {
						setEditData({
							std_id: allEditData[i].std_id || "",
							number_courtesy:
								thaiToArabicNumerals(allEditData[i].number_courtesy) || "",
							// number_letter: allEditData[i].number_letter || "กรอกภายหลัง",
							date_courtesy:
								convertThaiDateToDate(allEditData[i].date_courtesy) || "",
							// date_letter: allEditData[i].date_letter || "กรอกภายหลัง",
							name_to: allEditData[i].name_to || "",
						});
						setEditPreDataCourtesyModal(true);
						found = true;
						console.log("1");
						break;
					} else {
						found = false;
					}
				}

				// allEditData.map((item, i) => {
				// 	if (item.std_id === std_id) {
				// 		console.log(item.std_id);
				// 		// เพิ่ม modal เเต่ state ไม่น่าจำเป็น
				// 		setEditData({
				// 			std_id: item.std_id || "",
				// 			number_courtesy: item.number_courtesy || "",
				// 			// number_letter: item.number_letter || "กรอกภายหลัง",
				// 			date_courtesy: item.date_courtesy || "",
				// 			// date_letter: item.date_letter || "กรอกภายหลัง",
				// 			name_to: item.name_to || "",
				// 		});
				// 		setEditPreDataCourtesyModal(true);
				// 		found = true;
				// 		console.log("1");
				// 	}
				// });

				if (!found) {
					{
						console.log("2");
						setModalData({
							std_id: std_id,
							name_to: name_to,
							date_courtesy: formattedDate,
						});
						setShowCourtesyModal(true);
					}
				}
			} else {
				setModalData({
					std_id: std_id,
					name_to: name_to,
					date_courtesy: formattedDate,
				});
				setShowCourtesyModal(true);
			}
		} catch (error) {
			console.error(error);
		}
	};
	// pre Create Data and edit if haved data Lennter
	const handlePreCreateLetterSelfClick = (std_id, name_to, formattedDate) => {
		try {
			// if ถ้า edit data base ไม่เป็น [] else ใช้กัน []
			if (allEditData.length) {
				// หาตำเเหน่งที่ข้อมูลที่กดเข้ามาตรงกับข้อมูลที่เคยกรอกไหม ถ้าไม่มีจึงสร้างใหม่
				for (let i = 0; i < allEditData.length; i++) {
					if (
						allEditData[i].std_id === std_id &&
						allEditData[i].number_letter
					) {
						setEditData({
							std_id: allEditData[i].std_id || "",
							// number_courtesy: allEditData[i].number_courtesy || "",
							number_letter:
								thaiToArabicNumerals(allEditData[i].number_letter) || "",
							// date_courtesy: allEditData[i].date_courtesy || "",
							date_letter:
								convertThaiDateToDate(allEditData[i].date_letter) || "",
							name_to: allEditData[i].name_to || "",
						});
						setEditPreDataLetterModal(true);
						found = true;
						console.log("1");
						break;
					} else {
						found = false;
					}
				}
				// allEditData.map((item, i) => {
				// 	if (item.std_id === std_id && item.number_letter) {
				// 		console.log(item.std_id);
				// 		// เพิ่ม modal เเต่ state ไม่น่าจำเป็น
				// 		setEditData({
				// 			std_id: item.std_id || "",
				// 			// number_courtesy: item.number_courtesy || "",
				// 			number_letter: item.number_letter || "",
				// 			// date_courtesy: item.date_courtesy || "",
				// 			date_letter: item.date_letter || "",
				// 			name_to: item.name_to || "",
				// 		});
				// 		setEditPreDataLetterModal(true);
				// 		found = true;
				// 		console.log("1");
				// 	}
				// });

				if (!found) {
					{
						console.log("2");
						setModalData({
							std_id: std_id,
							name_to: name_to,
							date_letter: formattedDate,
						});
						setShowLetterModal(true);
					}
				}
			} else {
				setModalData({
					std_id: std_id,
					name_to: name_to,
					date_letter: formattedDate,
				});
				setShowLetterModal(true);
			}
		} catch (error) {
			console.error(error);
		}
	};
	// final create DOC
	const handleCreateClick = (std_id, employer_id) => {
		try {
			if (allEditData.length) {
				// หาตำเเหน่งที่ข้อมูลที่กดเข้ามาตรงกับข้อมูลที่เคยกรอกไหม ถ้าไม่มีจึงสร้างใหม่
				for (let i = 0; i < allEditData.length; i++) {
					if (allEditData[i].std_id === std_id) {
						// เพิ่ม modal เเต่ state ไม่น่าจำเป็น
						setEditData({
							std_id: allEditData[i].std_id || "",
							employer_id: employer_id || "",
							number_courtesy: allEditData[i].number_courtesy || "",
							number_letter: allEditData[i].number_letter || "",
							date_courtesy: allEditData[i].date_courtesy || "",
							date_letter: allEditData[i].date_letter || "",
							name_to: allEditData[i].name_to || "",
						});

						setCreateModal(true);
					} else {
						// ค่อยลบ
						null;
					}
				}
			} else {
				// ค่อยลบ
				null;
			}
		} catch (error) {
			console.error(error);
		}
	};

	// ผิดอยู่ self enroll ต้องเขียนเเยกใช้ api อีกตัว ใช้ self_id เเทน employer_id เเละดึงค่าจาก self_id มาใช้ จากนั้นบันทึกลงใน edit DOC ?  ? ?
	const handleCreateSelfCourtesyClick = (std_id, self_enroll_id) => {
		try {
			if (allEditData.length) {
				// หาตำเเหน่งที่ข้อมูลที่กดเข้ามาตรงกับข้อมูลที่เคยกรอกไหม ถ้าไม่มีจึงสร้างใหม่
				for (let i = 0; i < allEditData.length; i++) {
					if (allEditData[i].std_id === std_id) {
						// เพิ่ม modal เเต่ state ไม่น่าจำเป็น
						setEditData({
							std_id: allEditData[i].std_id || "",
							self_enroll_id: self_enroll_id || "",
							number_courtesy: allEditData[i].number_courtesy || "",
							// number_letter: allEditData[i].number_letter || "",
							date_courtesy: allEditData[i].date_courtesy || "",
							// date_letter: allEditData[i].date_letter || "",
							name_to: allEditData[i].name_to || "",
						});

						setCreateSelfCourtesyModal(true);
					} else {
						null;
					}
				}
			} else {
				null;
			}
		} catch (error) {
			console.error(error);
		}
	};
	const handleCreateSelfLetterClick = (std_id, self_enroll_id) => {
		try {
			if (allEditData.length) {
				// หาตำเเหน่งที่ข้อมูลที่กดเข้ามาตรงกับข้อมูลที่เคยกรอกไหม ถ้าไม่มีจึงสร้างใหม่
				for (let i = 0; i < allEditData.length; i++) {
					if (allEditData[i].std_id === std_id) {
						// เพิ่ม modal เเต่ state ไม่น่าจำเป็น
						setEditData({
							std_id: allEditData[i].std_id || "",
							self_enroll_id: self_enroll_id || "",
							// number_courtesy: allEditData[i].number_courtesy || "",
							number_letter: allEditData[i].number_letter || "",
							// date_courtesy: allEditData[i].date_courtesy || "",
							date_letter: allEditData[i].date_letter || "",
							name_to: allEditData[i].name_to || "",
						});

						setCreateSelfLetterModal(true);
					} else {
						null;
					}
				}
			} else {
				null;
			}
		} catch (error) {
			console.error(error);
		}
	};
	// edit Data after Create
	const handleEditCourtesyClick = (std_id, academic_year) => {
		setEditModalData({ std_id: std_id, academic_year: academic_year });
		showDataCourtesy(std_id, academic_year);
	};

	const handleModalClose = () => {
		setShowModal(false); //// win งง
		setShowCourtesyModal(false);
		setShowLetterModal(false);
		setEditShowModal(false);
		setEditCourtesyShowModal(false);
		setEditLetterShowModal(false);
		setEditPreDataModal(false);
		setEditPreDataCourtesyModal(false);
		setEditPreDataLetterModal(false);
		setCreateModal(false);
		setCreateSelfCourtesyModal(false);
		setCreateSelfLetterModal(false);
		setMultiCreateModal(false);
		setMultiCreateSelfModal(false);
		setResMultiCreateModal(false);
	};

	// create pre courtesy data in Modal
    const handlePreCreate = async () => {
        setIsButtonDisabled(true); // Disable the button
        setLoading(true); // Show loader
        try {
            const preCreate = await axios.post(
                import.meta.env.VITE_APP_API + "/preCreateCourtesyOld",
                {
                    std_id: modalData.std_id,
                    number_courtesy: arabicToThaiNumerals(modalData.number_courtesy),
                    number_letter: arabicToThaiNumerals(modalData.number_letter),
                    date_courtesy: formatThaiDate(modalData.date_courtesy),
                    date_letter: formatThaiDate(modalData.date_letter),
                    name_to: modalData.name_to,
                }
            );
            setShowModal(false);
            setShouldRerender(prevState => !prevState);
        } catch (error) {
            // Handle error, you can show an error message or log it
            console.error('Error:', error);
        } finally {
            setIsButtonDisabled(false); // Enable the button
            setLoading(false); // Hide loader
        }
    };
	// create pre courtesy data in Modal
	const handlePreCreateCourtesy = async () => {
		setIsButtonDisabled(true); // Disable the button
		setLoading(true); // Show loader
		try {
		const preCreate = await axios.post(
			import.meta.env.VITE_APP_API + "/preCreateCourtesy",
			{
				std_id: modalData.std_id,
				number_courtesy: arabicToThaiNumerals(modalData.number_courtesy),
				date_courtesy: formatThaiDate(modalData.date_courtesy),
				name_to: modalData.name_to,
			}
		);
		setShowCourtesyModal(false);
		setShouldRerender((prevState) => !prevState);
		}catch (error) {
			// Handle error, you can show an error message or log it
			console.error('Error:', error);
		} finally {
			setIsButtonDisabled(false); // Enable the button
			setLoading(false); // Hide loader
		}
	};
	const handlePreCreateLetter = async () => {
		setIsButtonDisabled(true); // Disable the button
		setLoading(true); // Show loader
		try {
			const preCreate = await axios.put(
				import.meta.env.VITE_APP_API + "/preCreateLetter",
				{
					std_id: modalData.std_id,
					number_letter: arabicToThaiNumerals(modalData.number_letter),
					date_letter: formatThaiDate(modalData.date_letter),
					name_to: modalData.name_to,
				}
			);
			setShowLetterModal(false);
			setShouldRerender((prevState) => !prevState);
		}catch (error) {
			// Handle error, you can show an error message or log it
			console.error('Error:', error);
		} finally {
			setIsButtonDisabled(false); // Enable the button
			setLoading(false); // Hide loader
		}
	};
	// use in Modal for fix DOC after used to create
	const handleEditPreModalSave = async () => {
		setIsButtonDisabled(true); // Disable the button
		setLoading(true); // Show loader
		try {

			const editPreCreate = await axios.put(
				import.meta.env.VITE_APP_API + "/editPreCreateCourtesyOld",
				{
					std_id: editData.std_id,
					number_courtesy: arabicToThaiNumerals(editData.number_courtesy),
					number_letter: arabicToThaiNumerals(editData.number_letter),
					date_courtesy: formatThaiDate(editData.date_courtesy),
					date_letter: formatThaiDate(editData.date_letter),
					name_to: editData.name_to,
				}
			);

			setEditPreDataModal(false);
			setShouldRerender((prevState) => !prevState);
		}catch (error) {
			// Handle error, you can show an error message or log it
			console.error('Error:', error);
		} finally {
			setIsButtonDisabled(false); // Enable the button
			setLoading(false); // Hide loader
		}
	};
	// use in Modal for fix DOC Courtesy after used to create
	const handleEditPreCourtesyModalSave = async () => {
		setIsButtonDisabled(true); // Disable the button
		setLoading(true); // Show loader
		try {
			const editPreCreate = await axios.put(
				import.meta.env.VITE_APP_API + "/editPreCreateCourtesy",
				{
					std_id: editData.std_id,
					number_courtesy: arabicToThaiNumerals(editData.number_courtesy),
					date_courtesy: formatThaiDate(editData.date_courtesy),
					name_to: editData.name_to,
				}
			);

			setEditPreDataCourtesyModal(false);
			setShouldRerender((prevState) => !prevState);
		}catch (error) {
			// Handle error, you can show an error message or log it
			console.error('Error:', error);
		} finally {
			setIsButtonDisabled(false); // Enable the button
			setLoading(false); // Hide loader
		}
	};
	// use in Modal for fix DOC Letter after used to create
	const handleEditPreLetterModalSave = async () => {

		setIsButtonDisabled(true); // Disable the button
		setLoading(true); // Show loader
		try {

			const editPreCreate = await axios.put(
				import.meta.env.VITE_APP_API + "/editPreCreateLetter",
				{
					std_id: editData.std_id,
					number_letter: arabicToThaiNumerals(editData.number_letter),
					date_letter: formatThaiDate(editData.date_letter),
					name_to: editData.name_to,
				}
			);

			setEditPreDataLetterModal(false);
			setShouldRerender((prevState) => !prevState);
		}catch (error) {
			// Handle error, you can show an error message or log it
			console.error('Error:', error);
		} finally {
			setIsButtonDisabled(false); // Enable the button
			setLoading(false); // Hide loader
		}
	};
	// use in Modal for create DOC Final **
	const handleCreateDocSave = async () => {
		const createDoc = await axios.post(
			import.meta.env.VITE_APP_API + `/genPdf`,
			{
				std_id: editData.std_id,
				employer_id: editData.employer_id,
				number_courtesy: editData.number_courtesy,
				number_letter: editData.number_letter,
				date_courtesy: editData.date_courtesy,
				date_letter: editData.date_letter,
				name_to: editData.name_to,
			}
		);

		setCreateModal(false);
		setShouldRerender((prevState) => !prevState); // Trigger a re-render
	};
	// use in Modal for create DOC Self Final **
	const handleCreateDocSelfCourtesySave = async () => {
		const createDoc = await axios.post(
			import.meta.env.VITE_APP_API + `/genPdfSelfCourtesy`,
			{
				std_id: editData.std_id,
				self_enroll_id: editData.self_enroll_id,
				number_courtesy: editData.number_courtesy,
				date_courtesy: editData.date_courtesy,
				name_to: editData.name_to,
			}
		);

		setCreateSelfCourtesyModal(false);
		setShouldRerender((prevState) => !prevState); // Trigger a re-render
	};
	const handleCreateDocSelfLetterSave = async () => {
		const createDoc = await axios.put(
			import.meta.env.VITE_APP_API + `/genPdfSelfLetter`,
			{
				std_id: editData.std_id,
				self_enroll_id: editData.self_enroll_id,
				number_letter: editData.number_letter,
				date_letter: editData.date_letter,
				name_to: editData.name_to,
			}
		);

		setCreateSelfLetterModal(false);
		setShouldRerender((prevState) => !prevState); // Trigger a re-render
	};

	// use in Modal for fix DOC after used to create
	const handleEditModalSave = async () => {
		const editDoc = await axios.put(
			import.meta.env.VITE_APP_API + "/editCourtesyOld",
			{
				std_id: editModalData.std_id,
				number_courtesy: editData.number_courtesy,
				number_letter: editData.number_letter,
				date_courtesy: editData.date_courtesy,
				date_letter: editData.date_letter,
				name_to: editData.name_to,
				academic_year: editData.academic_year,
			}
		);
		setEditShowModal(false);
		setShouldRerender((prevState) => !prevState);
	};
	// use in Modal for fix DOC after used to create Courtesy
	const handleEditCourtesyModalSave = async () => {
		setIsButtonDisabled(true); // Disable the button
		setLoading(true); // Show loader
		try {

			const editDoc = await axios.put(
				import.meta.env.VITE_APP_API + "/editCourtesy",
				{
					std_id: editModalData.std_id,
					number_courtesy: arabicToThaiNumerals(editData.number_courtesy),
					date_courtesy: formatThaiDate(editData.date_courtesy),
					name_to: editData.name_to,
					academic_year: editData.academic_year,
				}
			);
			setEditCourtesyShowModal(false);
			setShouldRerender((prevState) => !prevState);
		}catch (error) {
			// Handle error, you can show an error message or log it
			console.error('Error:', error);
		} finally {
			setIsButtonDisabled(false); // Enable the button
			setLoading(false); // Hide loader
		}
	};

	// use in Modal for fix DOC after used to create Letter
	const handleEditLetterModalSave = async () => {
		const editDoc = await axios.put(
			import.meta.env.VITE_APP_API + "/editLetter",
			{
				std_id: editModalData.std_id,
				number_letter: editData.number_letter,
				date_letter: editData.date_letter,
				name_to: editData.name_to,
				academic_year: editData.academic_year,
			}
		);
		setEditLetterShowModal(false);
		setShouldRerender((prevState) => !prevState);
	};
	// fetch Data from edit DOC that created Courtesy
	const showDataCourtesy = async (std_id, academic_year) => {
		try {
			if (!std_id) {
				console.error("Error: No std_id available for editing.");
				return;
			}

			const response = await axios.get(
				import.meta.env.VITE_APP_API +
					`/showEditCourtesy/${std_id}/${academic_year}`
			);

			setEditData({
				number_courtesy:
					thaiToArabicNumerals(response.data.number_courtesy) || "",
				date_courtesy: convertThaiDateToDate(response.data.date_courtesy) || "",
				name_to: response.data.name_to || "",
				academic_year: academic_year || "",
			});

			setEditCourtesyShowModal(true);
		} catch (error) {
			console.error("Error fetching edit data:", error);
		}
	};

	// fetch Data from Gened DOC with license
	const handleViewCourtesyLic = async (std_id, academic_year) => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + `/getGenDoc/${std_id}/${academic_year}`,
				{}
			);
			if (!response.data) {
				const selfDoc = await axios.get(
					import.meta.env.VITE_APP_API +
						`/getGenDocSelf/${std_id}/${academic_year}`,
					{}
				);
				setViewPdf(
					import.meta.env.VITE_FILE_API +
						`/uploads/${selfDoc.data.courtesy_license}`
				);
				setShowDocModal(true);
			} else {
				setViewPdf(
					import.meta.env.VITE_FILE_API +
						`/uploads/${response.data.courtesy_license}`
				);
				setShowDocModal(true);
			}
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	// fetch Data from Gened DOC with license
	const handleViewCourtesyNonLic = async (std_id, academic_year) => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + `/getGenDoc/${std_id}/${academic_year}`,
				{}
			);
			if (!response.data) {
				const selfDoc = await axios.get(
					import.meta.env.VITE_APP_API +
						`/getGenDocSelf/${std_id}/${academic_year}`,
					{}
				);
				// console.log(selfDoc.doc_nonlicense_courtesy);
				setViewPdf(
					import.meta.env.VITE_FILE_API +
						`/uploads/${selfDoc.data.doc_nonlicense_courtesy}`
				);
				setShowDocModal(true);
			} else {
				setViewPdf(
					import.meta.env.VITE_FILE_API +
						`/uploads/${response.data.courtesy_license}`
				);
				setShowDocModal(true);
			}
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	const handleShowMultiCreateModal = () => {
		setMultiCreateModal(true);
	};
	const handleShowMultiCreateSelfModal = () => {
		setMultiCreateSelfModal(true);
	};

	const handleMultiCreateDoc = async () => {
		try {
			// const response = await axios.post(import.meta.env.VITE_APP_API+"/genMultiCourtesy", { selectedItems });

			// // Handle the response data as needed
			// console.log("Response from server:", response.data);
			if (!selectedItems.length == 0) {
				setMultiCreateModal(false);
				const response = await axios.post(
					import.meta.env.VITE_APP_API + "/genMultiCourtesy",
					{ selectedItems }
				);
				// console.log("Response from server:", response.data);
				setShouldRerender((prevState) => !prevState); // Trigger a re-render
			} else {
				setMultiCreateModal(false);
				setResMultiCreateModal(true);
				setShouldRerender((prevState) => !prevState); // Trigger a re-render
			}
		} catch (error) {
			console.error("Error:", error);
			setMultiCreateModal(false);
		}
	};

	const handleMultiCreateDocSelf = async () => {
		try {
			// Handle the response data as needed
			if (!selectedItemsSelf.length == 0) {
				setMultiCreateSelfModal(false);
				const response = await axios.post(
					import.meta.env.VITE_APP_API + "/genMultiCourtesySelf",
					{ selectedItemsSelf }
				);
				// console.log("Response from server:", response.data);
				setShouldRerender((prevState) => !prevState); // Trigger a re-render
			} else {
				setMultiCreateSelfModal(false);
				setResMultiCreateModal(true);
				setShouldRerender((prevState) => !prevState); // Trigger a re-render
			}
		} catch (error) {
			console.error("Error:", error);
			setMultiCreateSelfModal(false);
		}
	};

	/////////////////////////////////
	///// InRequestLetterTable /////
	///////////////////////////////
	const [tableColOptionsInRequest, setTableColOptionsInRequest] = useState({
		displayname_th: {
			label: "ชื่อ-นามสกุล",
			is_hide: false,
		},
		std_id: {
			label: "เลขทะเบียน",
			is_hide: false,
		},
		email: {
			label: "อีเมล",
			is_hide: true,
		},
		tel: {
			label: "เบอร์โทร",
			is_hide: true,
		},
		company_name: {
			label: "บริษัท/หน่วยงาน",
			is_hide: false,
		},
		require_doc: {
			label: "เอกสารฉบับจริง",
			is_hide: false,
		},
		actions: {
			label: "ACTIONS",
			is_hide: false,
		},
	});
	const handleHideColumnInRequest = (e) => {
		const { name, checked } = e.target;

		setTableColOptionsInRequest({
			...tableColOptionsInRequest,
			[name]: { ...tableColOptionsInRequest[name], is_hide: checked },
		});
	};
	const inRequestLetterData = data
		.filter((item) => item.status === "รอดำเนินเอกสาร") ////
		.map((item) => ({
			id: item.confirm_id,
			confirm_id: item.confirm_id,
			academic_year: item.academic_year,
			std_id: item.std_id,
			displayname_th:
				item.student.name_title_th === null
					? item.student.displayname_th
					: item.student.name_title_th + item.student.displayname_th,
			email: item.student.email,
			tel: item.student.tel,
			employer_id: item.employer_id,
			job_id: item.job_id,
			position: item.position,
			company_name: item.employer.company_name,
			require_doc: item.require_doc,
			date_confirm: item.date_confirm,
			date_gen_doc: formatDate(item.date_gen_doc),
			status: item.status,
			name_to: item.posts_job.name_to,
			// allEditData: allEditData, ///
		}));
	const inRequestLetterDataColumns = useMemo(
		() => [
			{
				name: "id",
				selector: (row) => row.id,
				sortable: true,
				reorder: true,
				omit: true,
			},
			{
				name: <p className="mb-0">ชื่อ-นามสกุล</p>,
				selector: (row) => row.displayname_th,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="mb-0">{row.displayname_th}</p>
					</div>
				),
				omit: tableColOptionsInRequest.displayname_th.is_hide,
			},
			{
				name: <p className="mb-0">เลขทะเบียน</p>,
				selector: (row) => row.std_id,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="mb-0">{row.std_id}</p>
					</div>
				),
				omit: tableColOptionsInRequest.std_id.is_hide,
			},
			{
				name: "อีเมล",
				selector: (row) => row.email,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="mb-0">{row.email}</p>
					</div>
				),
				omit: tableColOptionsInRequest.email.is_hide,
			},
			{
				name: "เบอร์โทร",
				selector: (row) => row.tel,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.tel}</p>
					</div>
				),
				omit: tableColOptionsInRequest.tel.is_hide,
			},
			{
				name: <p className="mb-0">บริษัท/หน่วยงาน</p>,
				selector: (row) => row.company_name,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<Link to={`/employer/${row.employer_id}/profile`} target="_blank">
							{row.company_name}
						</Link>
					</div>
				),
				omit: tableColOptionsInRequest.company_name.is_hide,
			},
			{
				name: <p className="mb-0">เอกสารฉบับจริง</p>,
				selector: (row) => row.require_doc,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						{row.require_doc == 1 ? (
							<p className="mb-0 text-danger">ต้องการ</p>
						) : (
							<p className="mb-0"> - </p>
						)}
					</div>
				),
				omit: tableColOptionsInRequest.require_doc.is_hide,
			},
			{
				cell: (row) => (
					<>
						{allEditData.length == 0 ? (
							// case no data in edit before
							<button
								type="button"
								className={`btn btn-sm btn-outline-primary`}
								onClick={() =>
									handlePreCreateClick(row.std_id, row.name_to, formattedDate)
								}
								title="แก้ไขเอกสาร"
							>
								<FontAwesomeIcon icon={faPenToSquare} />
							</button>
						) : // case used to create edit data and equal std_id
						!allEditData.some((item) => item.std_id === row.std_id) ? (
							// case not equal std_id in edit data base
							<button
								type="button"
								className={`btn btn-sm btn-outline-primary`}
								onClick={() =>
									handlePreCreateClick(row.std_id, row.name_to, formattedDate)
								}
								title="แก้ไขเอกสาร"
							>
								<FontAwesomeIcon icon={faPenToSquare} />
							</button>
						) : (
							allEditData.map((item, index) =>
								item.std_id === row.std_id ? (
									<div key={index}>
										<button
											type="button"
											className={`btn btn-sm btn-outline-dark`}
											onClick={() =>
												handlePreCreateClick(
													row.std_id,
													row.name_to,
													formattedDate
												)
											}
											title="แก้ไขเอกสาร"
										>
											<FontAwesomeIcon icon={faPenToSquare} />
										</button>
										{user.user.role === "head" ? (
											<button
												type="button"
												className={`btn btn-sm btn-success ms-2`}
												onClick={() =>
													handleCreateClick(row.std_id, row.employer_id)
												}
												title="อนุมัติและสร้างเอกสาร"
											>
												<FontAwesomeIcon icon={faCheck} />
											</button>
										) : (
											<></>
										)}
									</div>
								) : null
							)
						)}
					</>
				),
				ignoreRowClick: true,
				omit: tableColOptionsInRequest.actions.is_hide,
			},
		],
		[tableColOptionsInRequest, allEditData]
	);

	// fow table selectableRows
	const [selectedRowsInRequest, setSelectedRowsInRequest] = useState([]);
	const [toggledClearRowsInRequest, setToggleClearRowsInRequest] =
		useState(false);
	const handleClearRowsInRequest = () => {
		setSelectedRowsInRequest([]);
		setToggleClearRowsInRequest(!toggledClearRowsInRequest);
	};
	const handleRowSelectedInRequest = ({
		allSelected,
		selectedCount,
		selectedRows,
	}) => {
		// console.log(selectedRows);

		const selectedStdIds = selectedRows.map((row) => row.std_id);
		const filteredAllEditData = allEditData.filter((item) =>
			selectedStdIds.includes(item.std_id)
		);
		// console.log("Filtered allEditData:", filteredAllEditData);

		const payload = filteredAllEditData.map((item) => {
			const selectedRow = selectedRows.find(
				(row) => row.std_id === item.std_id
			);
			const employer_id = selectedRow ? selectedRow.employer_id : null;
			return {
				std_id: item.std_id,
				employer_id,
				number_courtesy: item.number_courtesy,
				number_letter: item.number_letter,
				date_courtesy: item.date_courtesy,
				date_letter: item.date_letter,
				name_to: item.name_to,
				// checked: true,
			};
		});
		// console.log("Payload to send back to the server:", payload);

		setSelectedItems(payload);

		setSelectedRowsInRequest(selectedRows);
	};
	const rowDisabledInRequest = (row) => {
		// Check if the row's std_id is not found in allEditData
		return !allEditData.some((item) => item.std_id === row.std_id);
	};

	// for table search
	const [selectedSearchFieldInRequest, setSelectedSearchFieldInRequest] =
		useState("all");
	const [searchQueryInRequest, setSearchQueryInRequest] = useState("");
	const fieldsToSearchInRequest = [
		"displayname_th",
		"std_id",
		"email",
		"tel",
		"company_name",
	];
	const filteredDataInRequest = inRequestLetterData.filter((item) => {
		if (selectedSearchFieldInRequest === "all") {
			return fieldsToSearchInRequest.some((field) =>
				item[field]?.toLowerCase().includes(searchQueryInRequest.toLowerCase())
			);
		} else {
			return item[selectedSearchFieldInRequest]
				?.toLowerCase()
				.includes(searchQueryInRequest.trim().toLowerCase());
		}
	});

	const handleSearchFieldChangeInRequest = (e) => {
		const value = e.target.value;
		setSelectedSearchFieldInRequest(value);
		setSearchQueryInRequest("");
	};
	const handleSearchQueryInRequest = (e) => {
		setSearchQueryInRequest(e.target.value);
	};

	////
	const [selfCompanyProfile, setSelfCompanyProfile] = useState({});

	///////////////////////////////////
	///// SelfRequestLetterTable /////
	/////////////////////////////////
	const [tableColOptionsSelfRequest, setTableColOptionsSelfRequest] = useState({
		displayname_th: {
			label: "ชื่อ-นามสกุล",
			is_hide: false,
		},
		std_id: {
			label: "เลขทะเบียน",
			is_hide: false,
		},
		email: {
			label: "อีเมล",
			is_hide: true,
		},
		tel: {
			label: "เบอร์โทร",
			is_hide: true,
		},
		company_name: {
			label: "บริษัท/หน่วยงาน",
			is_hide: false,
		},
		require_doc: {
			label: "เอกสารฉบับจริง",
			is_hide: false,
		},
		status: {
			label: "สถานะ",
			is_hide: false,
		},
		actions1: {
			label: "เอกสาร[1]",
			is_hide: false,
		},
		actions2: {
			label: "เอกสาร[2]",
			is_hide: false,
		},
	});
	const handleHideColumnSelfRequest = (e) => {
		const { name, checked } = e.target;

		setTableColOptionsSelfRequest({
			...tableColOptionsSelfRequest,
			[name]: { ...tableColOptionsSelfRequest[name], is_hide: checked },
		});
	};
	const selfRequestLetterData = selfData
		.filter(
			(item) =>
				item.status === "รอดำเนินเอกสาร" ||
				item.status === "ยังไม่ได้สร้างหนังสือส่งตัว"
		)
		.map((item) => ({
			id: item.self_enroll_id,
			self_enroll_id: item.self_enroll_id,
			academic_year: item.academic_year,
			std_id: item.std_id,
			displayname_th:
				item.student.name_title_th === null
					? item.displayname_th
					: item.student.name_title_th + item.displayname_th,
			email: item.email,
			tel: item.tel,
			company_name: item.company_name,
			company_address: item.company_address,
			require_doc: item.require_doc,
			print: item.print,
			date_enroll: item.date_enroll,
			date_gen_doc: formatDate(item.date_gen_doc),
			to_who: item.to_who,
			status: item.status,
		}));
	const selfRequestLetterDataColumns = useMemo(
		() => [
			{
				name: "id",
				selector: (row) => row.id,
				sortable: true,
				reorder: true,
				omit: true,
			},
			{
				name: <p className="mb-0">ชื่อ-นามสกุล</p>,
				selector: (row) => row.displayname_th,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="mb-0">{row.displayname_th}</p>
					</div>
				),
				omit: tableColOptionsSelfRequest.displayname_th.is_hide,
			},
			{
				name: <p className="mb-0">เลขทะเบียน</p>,
				selector: (row) => row.std_id,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="mb-0">{row.std_id}</p>
					</div>
				),
				omit: tableColOptionsSelfRequest.std_id.is_hide,
			},
			{
				name: "อีเมล",
				selector: (row) => row.email,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="mb-0">{row.email}</p>
					</div>
				),
				omit: tableColOptionsSelfRequest.email.is_hide,
			},
			{
				name: "เบอร์โทร",
				selector: (row) => row.tel,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.tel}</p>
					</div>
				),
				omit: tableColOptionsSelfRequest.tel.is_hide,
			},
			{
				name: <p className="mb-0">บริษัท/หน่วยงาน</p>,
				selector: (row) => row.company_name,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p
							className="mb-0"
							// onClick={() =>
							// 	mappedDataSelf.filter((item) => {
							// 		if (item.self_enroll_id === row.self_enroll_id) {
							// 			setSelfCompanyProfile({
							// 				...selfCompanyProfile,
							// 				company_name: item.company_name,
							// 				company_address: item.company_address,
							// 			});
							// 		}
							// 	})
							// }
						>
							{row.company_name}
						</p>
					</div>
				),
				omit: tableColOptionsSelfRequest.company_name.is_hide,
			},
			{
				name: <p className="mb-0">เอกสารฉบับจริง</p>,
				selector: (row) => row.require_doc,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						{row.require_doc == 1 ? (
							<p className="mb-0 text-danger">ต้องการ</p>
						) : (
							<p className="mb-0"> - </p>
						)}
					</div>
				),
				omit: tableColOptionsSelfRequest.require_doc.is_hide,
			},
			{
				name: <p className="mb-0">สถานะ</p>,
				selector: (row) => row.status,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="mb-0">{row.status}</p>
					</div>
				),
				omit: tableColOptionsSelfRequest.status.is_hide,
			},
			{
				name: (
					<p className="mb-0" title="หนังสือขอความอนุเคราะห์ฝึกงาน">
						เอกสาร[1]
					</p>
				),
				cell: (row) => (
					<>
						{allEditData.length == 0 ? (
							// case no data in edit before
							<button
								type="button"
								className={`btn btn-sm btn-outline-primary`}
								onClick={() =>
									handlePreCreateCourtesySelfClick(
										row.std_id,
										row.to_who,
										formattedDate
									)
								}
								title="แก้ไขเอกสาร"
							>
								<FontAwesomeIcon icon={faPenToSquare} />
							</button>
						) : // case used to create edit data and equal std_id
						!allEditData.some((item) => item.std_id === row.std_id) ? (
							// case not equal std_id in edit data base
							<button
								type="button"
								className={`btn btn-sm btn-outline-primary`}
								onClick={() =>
									handlePreCreateCourtesySelfClick(
										row.std_id,
										row.to_who,
										formattedDate
									)
								}
								title="แก้ไขเอกสาร"
							>
								<FontAwesomeIcon icon={faPenToSquare} />
							</button>
						) : allEditData.some(
								(item) =>
									item.std_id === row.std_id &&
									row.status === "ยังไม่ได้สร้างหนังสือส่งตัว"
						  ) ? (
							<>
								{/* <button
									type="button"
									className={`btn btn-sm btn-outline-primary`}
									onClick={() =>
										handleViewCourtesyNonLic(row.std_id, row.academic_year)
									}
								>
									<FontAwesomeIcon icon={faEye} />
								</button>
								<button
									type="button"
									className={`btn btn-sm btn-outline-primary ms-2`}
									onClick={() =>
										handleViewCourtesyLic(row.std_id, row.academic_year)
									}
								>
									<FontAwesomeIcon icon={faEye} />
								</button> */}
								<div className="my-2">
									<p
										className="a-text mb-2"
										onClick={() =>
											handleViewCourtesyNonLic(row.std_id, row.academic_year)
										}
										title="หนังสือขอความอนุเคราะห์ฝึกงานแบบไม่มีลายเซ็น"
									>
										<FontAwesomeIcon icon={faFile} /> เอกสาร[1.1]
									</p>
									<p
										className="a-text mb-2"
										onClick={() =>
											handleViewCourtesyLic(row.std_id, row.academic_year)
										}
										title="หนังสือขอความอนุเคราะห์ฝึกงานแบบมีลายเซ็น"
									>
										<FontAwesomeIcon icon={faFile} /> เอกสาร[1.2]
									</p>
									<div className="d-flex justify-content-center">
										<button
											type="button"
											className={`btn btn-sm btn-outline-dark`}
											onClick={() => {
												handleEditCourtesyClick(row.std_id, row.academic_year);
											}}
											title="แก้ไขเอกสาร"
										>
											<FontAwesomeIcon icon={faPenToSquare} />
										</button>
									</div>
								</div>
							</>
						) : (
							allEditData.map((item, index) =>
								item.std_id === row.std_id ? (
									<div key={index}>
										<button
											type="button"
											className={`btn btn-sm btn-outline-dark`}
											onClick={() =>
												handlePreCreateCourtesySelfClick(
													row.std_id,
													row.to_who,
													formattedDate
												)
											}
											title="แก้ไขเอกสาร"
										>
											<FontAwesomeIcon icon={faPenToSquare} />
										</button>
										{user.user.role === "head" ? (
											<button
												type="button"
												className={`btn btn-sm btn-success ms-2`}
												onClick={() =>
													handleCreateSelfCourtesyClick(
														row.std_id,
														row.self_enroll_id
													)
												}
												title="อนุมัติและสร้างเอกสาร"
											>
												<FontAwesomeIcon icon={faCheck} />
											</button>
										) : (
											<></>
										)}
									</div>
								) : null
							)
						)}
					</>
				),
				ignoreRowClick: true,
				// allowOverflow: true,
				omit: tableColOptionsSelfRequest.actions1.is_hide,
			},
			{
				name: (
					<p className="mb-0" title="หนังสือส่งตัว">
						เอกสาร[2]
					</p>
				),
				cell: (row) => (
					<>
						{row.status !== "ยังไม่ได้สร้างหนังสือส่งตัว" ? (
							<span>กรุณากดอนุมัติเอกสาร [1] ก่อน</span>
						) : (
							<>
								{allEditData.length == 0 ? (
									// case no data in edit before
									<button
										type="button"
										className={`btn btn-sm btn-outline-primary`}
										onClick={() =>
											handlePreCreateLetterSelfClick(
												row.std_id,
												row.to_who,
												formattedDate
											)
										}
										title="แก้ไขเอกสาร"
									>
										<FontAwesomeIcon icon={faPenToSquare} />
									</button>
								) : // case used to create edit data and equal std_id
								!allEditData.some(
										(item) => item.std_id === row.std_id && item.number_letter
								  ) ? (
									// case not equal std_id in edit data base
									<button
										type="button"
										className={`btn btn-sm btn-outline-primary`}
										onClick={() =>
											handlePreCreateLetterSelfClick(
												row.std_id,
												row.to_who,
												formattedDate
											)
										}
										title="แก้ไขเอกสาร"
									>
										<FontAwesomeIcon icon={faPenToSquare} />
									</button>
								) : (
									allEditData.map((item, index) =>
										item.std_id === row.std_id ? (
											<div key={index}>
												<button
													type="button"
													className={`btn btn-sm btn-outline-dark`}
													onClick={() =>
														handlePreCreateLetterSelfClick(
															row.std_id,
															row.to_who,
															formattedDate
														)
													}
													title="แก้ไขเอกสาร"
												>
													<FontAwesomeIcon icon={faPenToSquare} />
												</button>
												{user.user.role === "head" ? (
													<button
														type="button"
														className={`btn btn-sm btn-success ms-2`}
														onClick={() =>
															handleCreateSelfLetterClick(
																row.std_id,
																row.self_enroll_id
															)
														}
														title="อนุมัติและสร้างเอกสาร"
													>
														<FontAwesomeIcon icon={faCheck} />
													</button>
												) : (
													<></>
												)}
											</div>
										) : null
									)
								)}
							</>
						)}
					</>
				),
				ignoreRowClick: true,
				omit: tableColOptionsSelfRequest.actions2.is_hide,
			},
		],
		[tableColOptionsSelfRequest, allEditData]
	);

	// fow table selectableRows
	const [selectedRowsSelfRequest, setSelectedRowsSelfRequest] = useState([]);
	const [toggledClearRowsSelfRequest, setToggleClearRowsSelfRequest] =
		useState(false);
	const handleClearRowsSelfRequest = () => {
		setSelectedRowsSelfRequest([]);
		setToggleClearRowsSelfRequest(!toggledClearRowsSelfRequest);
	};
	const handleRowSelectedSelfRequest = ({
		allSelected,
		selectedCount,
		selectedRows,
	}) => {
		setSelectedRowsSelfRequest(selectedRows);
	};
	const rowDisabledSelfRequest = (row) => {
		// Check if the row's std_id is not found in allEditData
		return !allEditData.some((item) => item.std_id === row.std_id);
	};

	// for table search
	const [selectedSearchFieldSelfRequest, setSelectedSearchFieldSelfRequest] =
		useState("all");
	const [searchQuerySelfRequest, setSearchQuerySelfRequest] = useState("");
	const fieldsToSearchSelfRequest = [
		"status",
		"displayname_th",
		"std_id",
		"email",
		"tel",
		"company_name",
	];
	const filteredDataSelfRequest = selfRequestLetterData.filter((item) => {
		if (selectedSearchFieldSelfRequest === "all") {
			return fieldsToSearchSelfRequest.some((field) =>
				item[field]
					?.toLowerCase()
					.includes(searchQuerySelfRequest.toLowerCase())
			);
		} else {
			return item[selectedSearchFieldSelfRequest]
				?.toLowerCase()
				.includes(searchQuerySelfRequest.trim().toLowerCase());
		}
	});

	const handleSearchFieldChangeSelfRequest = (e) => {
		const value = e.target.value;
		setSelectedSearchFieldSelfRequest(value);
		setSearchQuerySelfRequest("");
	};
	const handleSearchQuerySelfRequest = (e) => {
		setSearchQuerySelfRequest(e.target.value);
	};

	// console.log(selectedItems);
	// console.log(selectedItemsSelf);
	// console.log(mappedData);
	// console.log(mappedDataSelf);

	const DatePickerModalDataC = () => {
		return (
			<div className="d-flex flex-column mb-2">
				<label htmlFor="dateC">วันที่ออกเอกสารขอความอนุเคราะห์</label>
				<DatePicker
					id="dateC"
					selected={modalData.date_courtesy}
					onChange={(date) => {
						setModalData({
							...modalData,
							date_courtesy: date,
						});
					}}
					dateFormat="dd/MM/yyyy"
					className="form-control"
					required
				/>
				<small className="ms-sm-2 text-primary">
					({formatThaiDate(modalData.date_courtesy)})
				</small>
			</div>
		);
	};
	const DatePickerModalDataL = () => {
		return (
			<div className="d-flex flex-column mb-2">
				<label htmlFor="dateL">วันที่ออกเอกสารส่งตัว</label>
				<DatePicker
					id="dateL"
					selected={modalData.date_letter}
					onChange={(date) => {
						setModalData({
							...modalData,
							date_letter: date,
						});
					}}
					dateFormat="dd/MM/yyyy"
					className="form-control"
					minDate={modalData.date_courtesy}
					required
				/>
				<small className="ms-sm-2 text-primary">
					({formatThaiDate(modalData.date_letter)})
				</small>
			</div>
		);
	};
	const DatePickerEditDataC = () => {
		return (
			<div className="d-flex flex-column mb-2">
				<label htmlFor="dateC">วันที่ออกเอกสารขอความอนุเคราะห์</label>
				<DatePicker
					id="dateC"
					selected={editData.date_courtesy}
					onChange={(date) => {
						setEditData({
							...editData,
							date_courtesy: date,
						});
					}}
					dateFormat="dd/MM/yyyy"
					className="form-control"
					required
				/>
				<small className="ms-sm-2 text-primary">
					({formatThaiDate(editData.date_courtesy)})
				</small>
			</div>
		);
	};
	const DatePickerEditDataL = () => {
		return (
			<div className="d-flex flex-column mb-2">
				<label htmlFor="dateL">วันที่ออกเอกสารส่งตัว</label>
				<DatePicker
					id="dateL"
					selected={editData.date_letter}
					onChange={(date) => {
						setEditData({
							...editData,
							date_letter: date,
						});
					}}
					dateFormat="dd/MM/yyyy"
					className="form-control"
					required
					minDate={editData.date_courtesy}
				/>
				<small className="ms-sm-2 text-primary">
					({formatThaiDate(editData.date_letter)})
				</small>
			</div>
		);
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div className="container p-3 p-md-4 container-card">
				<div className="d-flex justify-content-between mb-4">
					<h3 className="fw-bold">อนุมัติเอกสาร</h3>
				</div>

				{/* <InRequestLetterTable /> */}
				<div className="searchBox">
					<div className="bg-dark p-2 mb-2 rounded-top">
						<p className="text-white fw-bold m-auto">
							นักศึกษาที่สมัครฝึกงานจากในระบบ
						</p>
					</div>
					<div className="input-group input-group-sm mb-3">
						<select
							id="selectFilter"
							className="form-select"
							value={selectedSearchFieldInRequest}
							onChange={(e) => handleSearchFieldChangeInRequest(e)}
						>
							<option value="all" label="ทั้งหมด">
								ทั้งหมด
							</option>
							{Object.entries(tableColOptionsInRequest)
								.filter(([key]) => key !== "actions" && key !== "require_doc")
								.map(([key, val] = entry, index) => (
									<option key={index} value={key} label={val.label}>
										{val.label}
									</option>
								))}
						</select>

						<input
							type="search"
							className="form-control w-75"
							aria-label="Sizing example input"
							aria-describedby="inputGroup-sizing-sm"
							placeholder="ค้นหา..."
							value={searchQueryInRequest}
							onChange={(e) => handleSearchQueryInRequest(e)}
						/>
						<div className="mx-1">({filteredDataInRequest.length})</div>
					</div>
				</div>

				<div className="tableToolbar row my-1 my-sm-auto">
					<div className="col">
						<div
							className="btn-toolbar"
							role="toolbar"
							aria-label="Toolbar with button groups"
						>
							<div className="dropdown">
								<button
									className="btn btn-sm btn-outline-secondary dropdown-toggle"
									type="button"
									data-bs-toggle="dropdown"
									data-bs-auto-close="outside"
									aria-expanded="false"
								>
									ตัวเลือกเพิ่มเติม
								</button>

								{selectedRowsInRequest.length ? (
									<div className="btn-group mx-2" role="group">
										<div>
											<button
												className={`btn btn-sm btn-outline-dark me-2`}
												onClick={handleClearRowsInRequest}
											>
												เลือกทั้งหมด <span>{selectedRowsInRequest.length}</span>{" "}
												<FontAwesomeIcon
													icon={faXmark}
													className="text-secondary"
												/>
											</button>
											{user.user.role === "head" ? (
												<button
													className={`btn btn-sm btn-success me-2`}
													onClick={handleShowMultiCreateModal}
												>
													<FontAwesomeIcon icon={faCheckDouble} />
												</button>
											) : (
												<></>
											)}
										</div>
									</div>
								) : (
									<></>
								)}

								<div className="dropdown-menu">
									<div className="d-flex flex-column flex-sm-row">
										<div className="bg-light px-2">
											<label htmlFor="hideColumn">ซ่อนคอลัมน์</label>
											<ul id="hideColumn" className="list-unstyled text-nowrap">
												{Object.entries(tableColOptionsInRequest).map(
													([key, val] = entry, index) => (
														<li key={index}>
															<div className="form-check form-check-inline">
																<input
																	className="form-check-input"
																	type="checkbox"
																	name={key}
																	id={`InRequestLetter_${index}_${key}`}
																	checked={val.is_hide}
																	onChange={(e) => handleHideColumnInRequest(e)}
																/>
																<label
																	className="form-check-label"
																	htmlFor={`InRequestLetter_${index}_${key}`}
																>
																	{val.label}
																</label>
															</div>
														</li>
													)
												)}
											</ul>
										</div>
									</div>
								</div>
							</div>

							<div style={{ height: "2.5rem" }}></div>
						</div>
					</div>
				</div>

				<DataTable
					columns={inRequestLetterDataColumns}
					data={filteredDataInRequest}
					customStyles={customStyles2}
					defaultSortFieldId={1} // id maybe
					defaultSortAsc={false} // เรียงจากมากไปน้อย
					fixedHeader
					responsive
					pagination
					highlightOnHover
					selectableRows
					selectableRowsHighlight
					onSelectedRowsChange={handleRowSelectedInRequest}
					selectableRowDisabled={rowDisabledInRequest}
					clearSelectedRows={toggledClearRowsInRequest}
					noDataComponent={<NoTableData />}
				/>

				{/* <SelfRequestLetterTable /> */}
				<div className="searchBox">
					<div className="bg-dark p-2 mb-2 rounded-top">
						<p className="text-white fw-bold m-auto">
							นักศึกษาที่สมัครฝึกงานจากภายนอกระบบ
						</p>
					</div>
					<div className="input-group input-group-sm mb-3">
						<select
							id="selectFilter"
							className="form-select"
							value={selectedSearchFieldSelfRequest}
							onChange={(e) => handleSearchFieldChangeSelfRequest(e)}
						>
							<option value="all" label="ทั้งหมด">
								ทั้งหมด
							</option>
							{Object.entries(tableColOptionsSelfRequest)
								.filter(
									([key]) =>
										key !== "actions1" &&
										key !== "actions2" &&
										key !== "require_doc"
								)
								.map(([key, val] = entry, index) => (
									<option key={index} value={key} label={val.label}>
										{val.label}
									</option>
								))}
						</select>

						<input
							type="search"
							className="form-control w-75"
							aria-label="Sizing example input"
							aria-describedby="inputGroup-sizing-sm"
							placeholder="ค้นหา..."
							value={searchQuerySelfRequest}
							onChange={(e) => handleSearchQuerySelfRequest(e)}
						/>
						<div className="mx-1">({filteredDataSelfRequest.length})</div>
					</div>
				</div>

				<div className="tableToolbar row my-1 my-sm-auto">
					<div className="col">
						<div
							className="btn-toolbar"
							role="toolbar"
							aria-label="Toolbar with button groups"
						>
							<div className="dropdown">
								<button
									className="btn btn-sm btn-outline-secondary dropdown-toggle"
									type="button"
									data-bs-toggle="dropdown"
									data-bs-auto-close="outside"
									aria-expanded="false"
								>
									ตัวเลือกเพิ่มเติม
								</button>

								{selectedRowsSelfRequest.length ? (
									<div className="btn-group mx-2" role="group">
										<div>
											<button
												className={`btn btn-sm btn-outline-dark me-2`}
												onClick={handleClearRowsSelfRequest}
											>
												เลือกทั้งหมด{" "}
												<span>{selectedRowsSelfRequest.length}</span>{" "}
												<FontAwesomeIcon
													icon={faXmark}
													className="text-secondary"
												/>
											</button>
											{selfRequestLetterData.every(
												(item) => item.date_gen_doc === null // เช็คแบบนี้ไม่ได้
											) ? (
												<button
													className={`btn btn-sm btn-success me-2`}
													onClick={handleShowMultiCreateSelfModal}
												>
													<FontAwesomeIcon icon={faCheckDouble} /> เอกสาร [1]
												</button>
											) : (
												<></>
											)}
											{selfRequestLetterData.every(
												(item) => item.status === "ยังไม่ได้สร้างหนังสือส่งตัว"
											) ? (
												<button
													className={`btn btn-sm btn-success me-2`}
													onClick={handleShowMultiCreateSelfModal}
												>
													<FontAwesomeIcon icon={faCheckDouble} /> เอกสาร [2]
												</button>
											) : (
												<></>
											)}
										</div>
									</div>
								) : (
									<></>
								)}

								<div className="dropdown-menu">
									<div className="d-flex flex-column flex-sm-row">
										<div className="bg-light px-2">
											<label htmlFor="hideColumn">ซ่อนคอลัมน์</label>
											<ul id="hideColumn" className="list-unstyled text-nowrap">
												{Object.entries(tableColOptionsSelfRequest).map(
													([key, val] = entry, index) => (
														<li key={index}>
															<div className="form-check form-check-inline">
																<input
																	className="form-check-input"
																	type="checkbox"
																	name={key}
																	id={`SelfRequestLetter_${index}_${key}`}
																	checked={val.is_hide}
																	onChange={(e) =>
																		handleHideColumnSelfRequest(e)
																	}
																/>
																<label
																	className="form-check-label"
																	htmlFor={`SelfRequestLetter_${index}_${key}`}
																>
																	{val.label}
																</label>
															</div>
														</li>
													)
												)}
											</ul>
										</div>
									</div>
								</div>
							</div>

							<div style={{ height: "2.5rem" }}></div>
						</div>
					</div>
				</div>

				<DataTable
					columns={selfRequestLetterDataColumns}
					data={filteredDataSelfRequest}
					customStyles={customStyles2}
					defaultSortFieldId={1} // id maybe
					defaultSortAsc={false} // เรียงจากมากไปน้อย
					fixedHeader
					responsive
					pagination
					highlightOnHover
					selectableRows={false}
					selectableRowsHighlight
					onSelectedRowsChange={handleRowSelectedSelfRequest}
					selectableRowDisabled={rowDisabledSelfRequest}
					clearSelectedRows={toggledClearRowsSelfRequest}
					noDataComponent={<NoTableData />}
				/>

				{/* normal */}
				<Modal show={showModal} onHide={handleModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>แก้ไขข้อมูลเอกสาร</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form id="normal-form">
							<span>เลขที่เอกสารขอความอนุเคราะห์</span>
							<input
								type="number"
								className="form-control mb-2"
								placeholder="เช่น 33"
								value={modalData.number_courtesy || ""}
								onChange={(e) => {
									const inputValue = e.target.value.replaceAll("-", "");
									if (inputValue !== "0") {
										setModalData({
											...modalData,
											number_courtesy: inputValue,
										});
									} else {
										setModalData({
											...modalData,
											number_courtesy: "",
										});
									}
								}}
								required
							/>

							<span>เลขที่เอกสารหนังสือส่งตัว</span>
							<input
								type="number"
								className="form-control mb-2"
								placeholder="เช่น 34"
								value={modalData.number_letter || ""}
								onChange={(e) => {
									const inputValue = e.target.value.replaceAll("-", "");
									if (inputValue !== "0") {
										setModalData({
											...modalData,
											number_letter: inputValue,
										});
									} else {
										setModalData({
											...modalData,
											number_letter: "",
										});
									}
								}}
								required
							/>

							<DatePickerModalDataC />

							<DatePickerModalDataL />

							<span>เรียน</span>
							<input
								type="text"
								className="form-control"
								placeholder="รองศาสตราจารย์ xxx xxxxx"
								value={modalData.name_to || ""}
								onChange={(e) =>
									setModalData({
										...modalData,
										name_to: e.target.value,
									})
								}
								required
							/>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleModalClose}>
							ปิด
						</Button>
						<Button
								variant="primary"
								type="button"
								onClick={handlePreCreate}
								disabled={isButtonDisabled}
							>
								{loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
						</Button>
					</Modal.Footer>
				</Modal>

				{/* Modal Create Courtesy Pre Data */}
				<Modal show={showCourtesyModal} onHide={handleModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>แก้ไขข้อมูลเอกสาร</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form
							id="create-courtesy-pre-data-form"
							
						>
							<span>เลขที่เอกสารขอความอนุเคราะห์</span>
							<input
								type="number"
								className="form-control mb-2"
								placeholder="เช่น 33"
								value={modalData.number_courtesy || ""}
								onChange={(e) => {
									const inputValue = e.target.value.replaceAll("-", "");
									if (inputValue !== "0") {
										setModalData({
											...modalData,
											number_courtesy: inputValue,
										});
									} else {
										setModalData({
											...modalData,
											number_courtesy: "",
										});
									}
								}}
								required
							/>

							<DatePickerModalDataC />

							<span>เรียน</span>
							<input
								type="text"
								className="form-control"
								placeholder="รองศาสตราจารย์ xxx xxxxx"
								value={modalData.name_to || ""}
								onChange={(e) =>
									setModalData({
										...modalData,
										name_to: e.target.value,
									})
								}
								required
							/>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleModalClose}>
							ปิด
						</Button>
						<Button
								variant="primary"
								type="button"
								onClick={handlePreCreateCourtesy}
								disabled={isButtonDisabled}
							>
								{loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
						</Button>
					</Modal.Footer>
				</Modal>

				{/* Modal Create Letter Pre Data */}
				<Modal show={showLetterModal} onHide={handleModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>แก้ไขข้อมูลเอกสาร</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form
							id="create-letter-pre-data-form"
							
						>
							<span>เลขที่เอกสารหนังสือส่งตัว</span>
							<input
								type="number"
								className="form-control mb-2"
								placeholder="เช่น 33"
								value={modalData.number_letter || ""}
								onChange={(e) => {
									const inputValue = e.target.value.replaceAll("-", "");
									if (inputValue !== "0") {
										setModalData({
											...modalData,
											number_letter: inputValue,
										});
									} else {
										setModalData({
											...modalData,
											number_letter: "",
										});
									}
								}}
								required
							/>

							<DatePickerModalDataL />

							<span>เรียน</span>
							<input
								type="text"
								className="form-control"
								placeholder="รองศาสตราจารย์ xxx xxxxx"
								value={modalData.name_to || ""}
								onChange={(e) =>
									setModalData({
										...modalData,
										name_to: e.target.value,
									})
								}
								required
							/>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleModalClose}>
							ปิด
						</Button>
						<Button
								variant="primary"
								type="button"
								onClick={handlePreCreateLetter}
								disabled={isButtonDisabled}
							>
								{loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
						</Button>
					</Modal.Footer>
				</Modal>

				{/*Modal Edit Pre Data after create */}
				<Modal show={editPreDataModal} onHide={handleModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>แก้ไขข้อมูลเอกสาร</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form
							id="edit-pre-data-after-create-form"
							
						>
							<span>เลขที่เอกสารขอความอนุเคราะห์</span>
							<input
								type="number"
								className="form-control mb-2"
								placeholder="เช่น 33"
								value={editData.number_courtesy}
								onChange={(e) => {
									const inputValue = e.target.value.replaceAll("-", "");
									if (inputValue !== "0") {
										setEditData({
											...editData,
											number_courtesy: inputValue,
										});
									} else {
										setEditData({
											...editData,
											number_courtesy: "",
										});
									}
								}}
								required
							/>

							<span>เลขที่เอกสารหนังสือส่งตัว</span>
							<input
								type="number"
								className="form-control mb-2"
								placeholder="เช่น 34"
								value={editData.number_letter || ""}
								onChange={(e) => {
									const inputValue = e.target.value.replaceAll("-", "");
									if (inputValue !== "0") {
										setEditData({
											...editData,
											number_letter: inputValue,
										});
									} else {
										setEditData({
											...editData,
											number_letter: "",
										});
									}
								}}
								required
							/>

							<DatePickerEditDataC />

							<DatePickerEditDataL />

							<span>เรียน</span>
							<input
								type="text"
								className="form-control"
								placeholder="รองศาสตราจารย์ xxx xxxxx"
								value={editData.name_to}
								onChange={(e) =>
									setEditData({
										...editData,
										name_to: e.target.value,
									})
								}
								required
							/>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleModalClose}>
							ปิด
						</Button>
						<Button
								variant="primary"
								type="button"
								onClick={handleEditPreModalSave}
								disabled={isButtonDisabled}
							>
								{loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
						</Button>
					</Modal.Footer>
				</Modal>

				{/*Modal Edit Pre Data Courtesy after create */}
				<Modal show={editPreDataCourtesyModal} onHide={handleModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>แก้ไขข้อมูลเอกสาร</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form
							id="edit-pre-data-ourtesy-after-create-form"
							
						>
							<span>เลขที่เอกสารขอความอนุเคราะห์</span>
							<input
								type="number"
								className="form-control mb-2"
								placeholder="เช่น 33"
								value={editData.number_courtesy}
								onChange={(e) => {
									const inputValue = e.target.value.replaceAll("-", "");
									if (inputValue !== "0") {
										setEditData({
											...editData,
											number_courtesy: inputValue,
										});
									} else {
										setEditData({
											...editData,
											number_courtesy: "",
										});
									}
								}}
								required
							/>

							<DatePickerEditDataC />

							<span>เรียน</span>
							<input
								type="text"
								className="form-control"
								placeholder="รองศาสตราจารย์ xxx xxxxx"
								value={editData.name_to}
								onChange={(e) =>
									setEditData({
										...editData,
										name_to: e.target.value,
									})
								}
								required
							/>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleModalClose}>
							ปิด
						</Button>
						<Button
								variant="primary"
								type="button"
								onClick={handleEditPreCourtesyModalSave}
								disabled={isButtonDisabled}
							>
								{loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
						</Button>
					</Modal.Footer>
				</Modal>

				{/*Modal Edit Pre Data Letter after create */}
				<Modal show={editPreDataLetterModal} onHide={handleModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>แก้ไขข้อมูลเอกสาร</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form
							id="edit-pre-data-letter-after-create-form"
							
						>
							<span>เลขที่เอกสารหนังสือส่งตัว</span>
							<input
								type="number"
								className="form-control mb-2"
								placeholder="เช่น 33"
								value={editData.number_letter || ""}
								onChange={(e) => {
									const inputValue = e.target.value.replaceAll("-", "");
									if (inputValue !== "0") {
										setEditData({
											...editData,
											number_letter: inputValue,
										});
									} else {
										setEditData({
											...editData,
											number_letter: "",
										});
									}
								}}
								required
							/>

							<DatePickerEditDataL />

							<span>เรียน</span>
							<input
								type="text"
								className="form-control"
								placeholder="รองศาสตราจารย์ xxx xxxxx"
								value={editData.name_to}
								onChange={(e) =>
									setEditData({
										...editData,
										name_to: e.target.value,
									})
								}
								required
							/>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleModalClose}>
							ปิด
						</Button>
						<Button
								variant="primary"
								type="button"
								onClick={handleEditPreLetterModalSave}
								disabled={isButtonDisabled}
							>
								{loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
						</Button>
					</Modal.Footer>
				</Modal>

				{/*Modal final create DOC  เอา field input ออกไม่ให้กรอก*/}
				<Modal show={createModal} onHide={handleModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>อนุมัติและสร้างเอกสาร</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="mb-3">
							<h6 className="fw-bold">เลขที่เอกสารขอความอนุเคราะห์:</h6>
							<span className="text-muted">{editData.number_courtesy}</span>
						</div>
						<div className="mb-3">
							<h6 className="fw-bold">เลขที่เอกสารหนังสือส่งตัว:</h6>
							<span className="text-muted">{editData.number_letter || ""}</span>
						</div>
						<div className="mb-3">
							<h6 className="fw-bold">วันที่ออกเอกสารขอความอนุเคราะห์:</h6>
							<span className="text-muted">{editData.date_courtesy}</span>
						</div>
						<div className="mb-3">
							<h6 className="fw-bold">วันที่ออกเอกสารส่งตัว:</h6>
							<span className="text-muted">{editData.date_letter}</span>
						</div>
						<div className="mb-3">
							<h6 className="fw-bold">เรียน:</h6>
							<span className="text-muted">{editData.name_to}</span>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleModalClose}>
							ปิด
						</Button>
						<Button variant="success" onClick={handleCreateDocSave}>
							<FontAwesomeIcon icon={faCheck} /> อนุมัติและสร้างเอกสาร
						</Button>
					</Modal.Footer>
				</Modal>
			</div>

			<Modal show={MultiCreateModal} onHide={handleModalClose} scrollable>
				<Modal.Header closeButton>
					<Modal.Title>
						อนุมัติและสร้างเอกสาร ({selectedRowsInRequest.length} รายการ)
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>คุณยืนยันที่จะสร้างเอกสารให้กับรายชื่อที่เลือก:</p>
					<ul className="">
						{selectedRowsInRequest.map((item, index) => (
							<li key={index} className="mb-1 fw-semibold">
								{item.displayname_th} {item.std_id}
							</li>
						))}
					</ul>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleModalClose}>
						ปิด
					</Button>
					<Button variant="success" onClick={handleMultiCreateDoc}>
						<FontAwesomeIcon icon={faCheckDouble} /> อนุมัติและสร้างเอกสาร
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={resMultiCreateModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>อนุมัติและสร้างเอกสาร</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					กรุณาคลิก กล่องสี่เหลี่ยม เพื่อเลือกรายชื่อที่ต้องการสร้างเอกสาร
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleModalClose}>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>

			<div className="container p-3 p-md-4 mt-4 bg-light border border-info rounded">
				<div className="d-flex justify-content-between mb-2">
					<h5 className="fw-bold">
						<FontAwesomeIcon icon={faNoteSticky} className="text-light-blue" />{" "}
						คำอธิบายประกอบ
					</h5>
				</div>

				<ul className="list-group list-group-flush">
					<div>
						<li className="list-group-item">
							<span className="text-dark fw-bold">
								<FontAwesomeIcon icon={faFile} /> เอกสาร[1]
							</span>{" "}
							คือ หนังสือขอความอนุเคราะห์ฝึกงาน
						</li>
						<li className="list-group-item">
							<span className="text-dark fw-bold">
								<FontAwesomeIcon icon={faFile} /> เอกสาร[2]
							</span>{" "}
							คือ หนังสือส่งตัว
						</li>
						{/* <li className="list-group-item">
							<span className="text-dark fw-bold">
								<FontAwesomeIcon icon={faFile} /> เอกสาร[3]
							</span>{" "}
							คือ หนังสือขอความอนุเคราะห์ฝึกงานและหนังสือส่งตัว แบบไม่มีลายเซ็น
						</li> */}
					</div>
				</ul>
			</div>

			{/* self enroll Modal */}
			<Modal show={createSelfCourtesyModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>อนุมัติและสร้างเอกสาร</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Modal.Body>
						<div className="mb-3">
							<h6 className="fw-bold">เลขที่เอกสารขอความอนุเคราะห์:</h6>
							<span className="text-muted">{editData.number_courtesy}</span>
						</div>

						<div className="mb-3">
							<h6 className="fw-bold">วันที่ออกเอกสารขอความอนุเคราะห์:</h6>
							<span className="text-muted">{editData.date_courtesy}</span>
						</div>

						<div className="mb-3">
							<h6 className="fw-bold">เรียน:</h6>
							<span className="text-muted">{editData.name_to}</span>
						</div>
					</Modal.Body>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleModalClose}>
						ปิด
					</Button>
					<Button variant="success" onClick={handleCreateDocSelfCourtesySave}>
						<FontAwesomeIcon icon={faCheck} /> อนุมัติและสร้างเอกสาร
					</Button>
				</Modal.Footer>
			</Modal>
			{/* self enroll Modal Letter */}
			<Modal show={createSelfLetterModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>อนุมัติและสร้างเอกสาร</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Modal.Body>
						<div className="mb-3">
							<h6 className="fw-bold">เลขที่เอกสารหนังสือส่งตัว:</h6>
							<span className="text-muted">{editData.number_letter}</span>
						</div>

						<div className="mb-3">
							<h6 className="fw-bold">วันที่ออกเอกสารหนังสือส่งตัว:</h6>
							<span className="text-muted">{editData.date_letter}</span>
						</div>

						<div className="mb-3">
							<h6 className="fw-bold">เรียน:</h6>
							<span className="text-muted">{editData.name_to}</span>
						</div>
					</Modal.Body>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleModalClose}>
						ปิด
					</Button>
					<Button variant="success" onClick={handleCreateDocSelfLetterSave}>
						<FontAwesomeIcon icon={faCheck} /> อนุมัติและสร้างเอกสาร
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={MultiCreateSelfModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						อนุมัติและสร้างเอกสาร ({selectedRowsSelfRequest.length} รายการ)
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>คุณยืนยันที่จะสร้างเอกสารให้กับรายชื่อที่เลือก</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleModalClose}>
						ปิด
					</Button>
					<Button variant="success" onClick={handleMultiCreateDocSelf}>
						<FontAwesomeIcon icon={faCheckDouble} /> อนุมัติและสร้างเอกสาร
					</Button>
				</Modal.Footer>
			</Modal>

			{/* part created Doc then edit doc*/}

			{/*Modal Edit When Complete */}
			<Modal show={editShowModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>แก้ไขข้อมูลเอกสาร</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						{/* Add more input fields as needed */}
						<Form.Group controlId="formNumber">
							<Form.Label>เลขที่เอกสารขอความอนุเคราะห์</Form.Label>
							<span className="text-danger">*</span>
							<Form.Control
								type="text"
								placeholder="Enter number courtesy"
								required //ไม่เห็นได้
								//set state ภายใน
								value={editData.number_courtesy}
								onChange={(e) =>
									setEditData({
										...editData,
										number_courtesy: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group controlId="formNumber">
							<Form.Label>เลขที่เอกสารหนังสือส่งตัว</Form.Label>
							<span className="text-danger">*</span>
							<Form.Control
								type="text"
								placeholder="๔๔"
								//set state ภายใน
								value={editData.number_letter || ""}
								onChange={(e) =>
									setEditData({
										...editData,
										number_letter: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group controlId="formDate">
							<Form.Label>วันที่ออกเอกสารขอความอนุเคราะห์</Form.Label>
							<Form.Control
								type="text"
								value={editData.date_courtesy}
								onChange={(e) =>
									setEditData({
										...editData,
										date_courtesy: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group controlId="formDate">
							<Form.Label>วันที่ออกเอกสารส่งตัว</Form.Label>
							<Form.Control
								type="text"
								value={editData.date_letter}
								onChange={(e) =>
									setEditData({
										...editData,
										date_letter: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group controlId="formTo">
							<Form.Label>เรียน</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter 'name_to'"
								value={editData.name_to}
								onChange={(e) =>
									setEditData({
										...editData,
										name_to: e.target.value,
									})
								}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleModalClose}>
						ปิด
					</Button>
					<Button variant="primary" onClick={handleEditModalSave}>
						บันทึกการเปลี่ยนแปลง
					</Button>
				</Modal.Footer>
			</Modal>

			{/*Modal Edit Courtest When Complete */}
			<Modal show={editCourtesyShowModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>แก้ไขข้อมูลเอกสาร</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form
						id="edit-courtest-when-complete-form"
						onSubmit={handleEditCourtesyModalSave}
					>
						<span>เลขที่เอกสารขอความอนุเคราะห์</span>
						<input
							type="number"
							className="form-control mb-2"
							placeholder="เช่น 33"
							value={editData.number_courtesy}
							onChange={(e) => {
								const inputValue = e.target.value.replaceAll("-", "");
								if (inputValue !== "0") {
									setEditData({
										...editData,
										number_courtesy: inputValue,
									});
								} else {
									setEditData({
										...editData,
										number_courtesy: "",
									});
								}
							}}
							required
						/>

						<DatePickerEditDataC />

						<span>เรียน</span>
						<input
							type="text"
							className="form-control"
							placeholder="รองศาสตราจารย์ xxx xxxxx"
							value={editData.name_to}
							onChange={(e) =>
								setEditData({
									...editData,
									name_to: e.target.value,
								})
							}
							required
						/>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleModalClose}>
						ปิด
					</Button>
					<Button
							variant="primary"
							type="button"
							onClick={handleEditCourtesyModalSave}
							disabled={isButtonDisabled}
						>
							{loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
					</Button>
				</Modal.Footer>
			</Modal>

			{/*Modal Edit Letter When Complete */}
			<Modal show={editLetterShowModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>แก้ไขข้อมูลเอกสาร</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						{/* Add more input fields as needed */}
						<Form.Group controlId="formNumber">
							<Form.Label>เลขที่เอกสารขอความอนุเคราะห์</Form.Label>
							<span className="text-danger">*</span>
							<Form.Control
								type="text"
								placeholder="Enter number courtesy"
								required //ไม่เห็นได้
								//set state ภายใน
								value={editData.number_courtesy}
								onChange={(e) =>
									setEditData({
										...editData,
										number_courtesy: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group controlId="formNumber">
							<Form.Label>เลขที่เอกสารหนังสือส่งตัว</Form.Label>
							<span className="text-danger">*</span>
							<Form.Control
								type="text"
								placeholder="๔๔"
								//set state ภายใน
								value={editData.number_letter || ""}
								onChange={(e) =>
									setEditData({
										...editData,
										number_letter: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group controlId="formDate">
							<Form.Label>วันที่ออกเอกสารขอความอนุเคราะห์</Form.Label>
							<Form.Control
								type="text"
								value={editData.date_courtesy}
								onChange={(e) =>
									setEditData({
										...editData,
										date_courtesy: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group controlId="formDate">
							<Form.Label>วันที่ออกเอกสารส่งตัว</Form.Label>
							<Form.Control
								type="text"
								value={editData.date_letter}
								onChange={(e) =>
									setEditData({
										...editData,
										date_letter: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group controlId="formTo">
							<Form.Label>เรียน</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter 'name_to'"
								value={editData.name_to}
								onChange={(e) =>
									setEditData({
										...editData,
										name_to: e.target.value,
									})
								}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleModalClose}>
						ปิด
					</Button>
					<Button variant="primary" onClick={handleEditLetterModalSave}>
						บันทึกการเปลี่ยนแปลง
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Modal show preview DOC */}
			<Modal
				show={showDocModal}
				onHide={() => setShowDocModal(false)}
				centered
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>เอกสาร</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Worker
							workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"
							crossOrigin="use-credentials"
						>
							{viewPdf && (
								<Viewer
									fileUrl={viewPdf}
									// httpHeaders={{
									// 	authtoken: user.user.token,
									// }}
									plugins={[defaultLayoutPluginInstance]}
									//withCredentials={true}
								/>
							)}
							{!viewPdf && <p>No PDF</p>}
						</Worker>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowDocModal(false)}>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default HeadDocs;
