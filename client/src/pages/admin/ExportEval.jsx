import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import * as XLSX from "xlsx";
import btn from "../../components/btn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

const ExportEval = () => {
	const [dataStdEval, setDataStdEval] = useState([]);
	const [dataEmpEval, setDataEmpEval] = useState([]);
	const [dataEmpQues, setDataEmpQues] = useState([]);

	const [yearsStdEval, setYearsStdEval] = useState([]);
	const [yearsEmpEval, setYearsEmpEval] = useState([]);
	const [yearsEmpQues, setYearsEmpQues] = useState([]);

	const [selectedYearStdEval, setSelectedYearStdEval] = useState("");
	const [selectedYearEmpEval, setSelectedYearEmpEval] = useState("");
	const [selectedYearEmpQues, setSelectedYearEmpQues] = useState("");

	const [errors, setErrors] = useState({});

	const user = useSelector((state) => state.user);

	const loadData = async () => {
		try {
			const stdEvalResponse = await axios.get(
				import.meta.env.VITE_APP_API + "/listStdEval"
			);
			const empEvalResponse = await axios.get(
				import.meta.env.VITE_APP_API + "/listEmpEval"
			);
			const empQuesResponse = await axios.get(
				import.meta.env.VITE_APP_API + "/listEmpQuesEval"
			);

			// set เพื่อนำมาใช้ก่อน ภายใน useEffect
			const stdEvalData = stdEvalResponse.data;
			const empEvalData = empEvalResponse.data;
			const empQuesData = empQuesResponse.data;

			setDataStdEval(stdEvalData);
			setDataEmpEval(empEvalData);
			setDataEmpQues(empQuesData);
			// console.log("is run");

			const uniqueYearsStdEval = [
				...new Set(stdEvalData.map((item) => item.academic_year)),
			];
			setYearsStdEval(uniqueYearsStdEval);

			const uniqueYearsEmpEval = [
				...new Set(empEvalData.map((item) => item.academic_year)),
			];
			setYearsEmpEval(uniqueYearsEmpEval);

			const uniqueYearsEmpQues = [
				...new Set(empQuesData.map((item) => item.academic_year)),
			];
			setYearsEmpQues(uniqueYearsEmpQues);
		} catch (error) {
			console.error(error);
			// Handle error appropriately, e.g., setErrors({ message: error.message });
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const filteredDataStdEval = selectedYearStdEval
		? dataStdEval.filter((item) => item.academic_year === selectedYearStdEval)
		: dataStdEval;
	const filteredDataEmpEval = selectedYearEmpEval
		? dataEmpEval.filter((item) => item.academic_year === selectedYearEmpEval)
		: dataEmpEval;
	const filteredDataEmpQues = selectedYearEmpQues
		? dataEmpQues.filter((item) => item.academic_year === selectedYearEmpQues)
		: dataEmpQues;

	// console.log(dataStdEval);
	// console.log(dataEmpEval);
	// console.log(dataEmpQues);

	// Export data to Excel
	const exportToExcel = (data, fileName) => {
		const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
		XLSX.writeFile(wb, fileName);
	};

	return (
		<>
			<div className="container p-3 p-md-4 container-card">
				<div className="d-flex justify-content-between mb-4">
					<h3 className="fw-bold">ส่งออกแบบประเมินนักศึกษาประเมินบริษัท</h3>
				</div>

				<div className="d-flex flex-column flex-sm-row">
					<div className="flex-grow-1 csvFileUploader">
						<select
							className="form-select"
							value={selectedYearStdEval}
							onChange={(e) => setSelectedYearStdEval(e.target.value)}
						>
							<option value="">เลือกปีการศึกษา...</option>
							{yearsStdEval.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>
					<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
						<button
							className={`${btn.btn_blue}`}
							onClick={() =>
								exportToExcel(
									filteredDataStdEval,
									`stdEval_${selectedYearStdEval}.xlsx`
								)
							}
						>
							<FontAwesomeIcon icon={faFileExport} /> Export to Excel
						</button>
					</div>
				</div>
			</div>

			<div className="container p-3 p-md-4 container-card mt-4">
				<div className="d-flex justify-content-between mb-4">
					<h3 className="fw-bold">ส่งออกแบบประเมินบริษัทประเมินนักศึกษา</h3>
				</div>

				<div className="d-flex flex-column flex-sm-row">
					<div className="flex-grow-1 csvFileUploader">
						<select
							className="form-select"
							value={selectedYearEmpEval}
							onChange={(e) => setSelectedYearEmpEval(e.target.value)}
						>
							<option value="">เลือกปีการศึกษา...</option>
							{yearsEmpEval.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>
					<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
						<button
							className={`${btn.btn_blue}`}
							onClick={() =>
								exportToExcel(
									filteredDataEmpEval,
									`empEval_${selectedYearEmpEval}.xlsx`
								)
							}
						>
							<FontAwesomeIcon icon={faFileExport} /> Export to Excel
						</button>
					</div>
				</div>
			</div>

			<div className="container p-3 p-md-4 container-card mt-4">
				<div className="d-flex justify-content-between mb-4">
					<h3 className="fw-bold">ส่งออกแบบสอบถามบริษัท</h3>
				</div>

				<div className="d-flex flex-column flex-sm-row">
					<div className="flex-grow-1 csvFileUploader">
						<select
							className="form-select"
							value={selectedYearEmpQues}
							onChange={(e) => setSelectedYearEmpQues(e.target.value)}
						>
							<option value="">เลือกปีการศึกษา...</option>
							{yearsEmpQues.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>
					<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
						<button
							className={`${btn.btn_blue}`}
							onClick={() =>
								exportToExcel(
									filteredDataEmpQues,
									`empQues_${selectedYearEmpQues}.xlsx`
								)
							}
						>
							<FontAwesomeIcon icon={faFileExport} /> Export to Excel
						</button>
					</div>
				</div>
			</div>

			<div className="container p-3 p-md-4 mt-4 bg-light border border-info rounded">
				<div className="bg-white border rounded">
					<p className="m-auto p-2">
						<span className="fw-semibold">หมายเหตุ* </span>{" "}
						หากไม่ได้ทำการเลือกปีการศึกษาจะเป็นการส่งออกข้อมูลทั้งหมด
					</p>
				</div>
			</div>

			{/* <div className="container mt-4">
				<div className="card">
					<div className="card-body">
						<h3 className="card-title">ส่งออกแบบสอบถามบริษัท</h3>
						<select
							className="form-select mb-3"
							value={selectedYearEmpQues}
							onChange={(e) => setSelectedYearEmpQues(e.target.value)}
						>
							<option value="">Select Year</option>
							{yearsEmpQues.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
						<button
							className="btn btn-primary"
							onClick={() =>
								exportToExcel(
									filteredDataEmpQues,
									`empQues_${selectedYearEmpQues}.xlsx`
								)
							}
						>
							Export to Excel
						</button>
					</div>
				</div>
			</div> */}
		</>
	);
};

export default ExportEval;
