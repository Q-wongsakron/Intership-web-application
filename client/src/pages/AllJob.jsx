import React, { useEffect, useState } from "react";
import {
	Link,
	useSearchParams,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSearch,
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from "react-multi-select-component";

import Job from "../components/Job";
import btn from "../components/btn.module.css";
import Loading from "../components/Loading";
import { internJobPositions } from "../components/internJobPositions";
import { internJobLocations } from "../components/internJobLocations";

import axios from "axios";

function AllJob() {
	const [jobData, setJobData] = useState(null); // should be null or empty array?
	const [jobLocationData, setJobLocationData] = useState([]);
	const [loading, setLoading] = useState(true);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 8;

	const location = useLocation();
	const pageParam = new URLSearchParams(location.search).get("page");

	const navigate = useNavigate();

	const fetchData = async () => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + "/listPosts"
			);

			// const provinceRes = await axios.get(
			// 	"https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
			// );
			// if (provinceRes.data) {
			// 	const provinceData = provinceRes.data;
			// 	setJobLocationData(
			// 		provinceData.map((item) => {
			// 			return {
			// 				label: item.name_th,
			// 				value: item.name_th,
			// 			};
			// 		})
			// 	);
			// }

			if (response.data) {
				setJobData(response.data);
				// setJobLocationData(
				// 	response.data.map((item) => {
				// 		return {
				// 			label: item.province,
				// 			value: item.province,
				// 		};
				// 	})
				// );

				const totalPages = Math.ceil(response.data.length / itemsPerPage);
				const page = Number(pageParam);

				if (page >= 1 && page <= totalPages) {
					// console.log(1);
					setCurrentPage(page);
				} else if (page > totalPages) {
					// console.log(2);
					setCurrentPage(totalPages);
				} else {
					// console.log(3);
					setCurrentPage(1);
				}
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const [keywordQuery, setKeywordQuery] = useState("");

	const handleKeywordQuery = (e) => {
		if (e.target.name === "search_keyword") {
			setKeywordQuery(e.target.value);
		}
	};

	const handleFilter = (e) => {
		e.preventDefault();

		if (
			keywordQuery !== "" ||
			selectedPosition.length ||
			selectedLocation.length
		) {
			const jsonPosition = JSON.stringify(selectedPosition);
			const jsonLocation = JSON.stringify(selectedLocation);

			const encodedPosition = encodeURIComponent(jsonPosition);
			const encodedLocation = encodeURIComponent(jsonLocation);

			navigate({
				pathname: "/search",
				search:
					`?keyword=${keywordQuery}&positions=${encodedPosition}` +
					`&locations=${encodedLocation}`,
			});
		} else {
			navigate({
				pathname: "/search",
			});
		}
	};

	const [selectedPosition, setSelectedPosition] = useState([]);
	const positionOptions = internJobPositions;
	const [selectedLocation, setSelectedLocation] = useState([]);
	// const locationOptions = [
	// 	{ label: "กรุงเทพมหานคร", value: "กรุงเทพมหานคร" },
	// 	{ label: "พะเยา", value: "พะเยา" },
	// 	{ label: "มุกดาหาร", value: "มุกดาหาร" },
	// ];
	// const locationOptions = jobLocationData;
	const locationOptions = internJobLocations.map((item) => {
		return {
			label: item.name_th,
			value: item.name_th,
		};
	});
	const overrideStrings = {
		allItemsAreSelected: "เลือกรายการทั้งหมด",
		clearSearch: "Clear Search",
		clearSelected: "Clear Selected",
		noOptions: "ค้นหาไม่พบ",
		search: "ค้นหา",
		selectAll: "เลือกทั้งหมด",
		selectAllFiltered: "เลือกทั้งหมด (ฟิลเตอร์)",
		selectSomeItems: "เลือก...",
		create: "เพิ่ม",
	};

	const handleNewPosition = (value) => ({
		label: value,
		value: value.toLowerCase(),
	});

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [location.search]);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div className="container p-2 p-lg-3 p-xl-5 mb-3 mb-xl-0">
				<div className="fw-bold mb-4">
					<Link to={"/"}>หน้าหลัก</Link>
					<span>{` > `}</span>
					<Link to={"/alljob"}>ตำแหน่งฝึกงานทั้งหมด</Link>
				</div>

				<div className="row justify-content-center">
					<h3 className="my-4 mb-sm-5 fw-bold">
						ตำแหน่งฝึกงานทั้งหมด ({jobData ? jobData.length : 0})
					</h3>
					<div className="col-12 col-lg-9">
						{jobData ? (
							<>
								<div className="job-search-container bg-light border rounded px-2 px-xl-3 d-block d-lg-none mb-5 mb-lg-0">
									<div className="d-flex justify-content-between my-3">
										<h5 className="fw-bold">ค้นหาตำแหน่งฝึกงาน</h5>
									</div>

									<form
										id="search_form"
										className="form-outline mb-4"
										onSubmit={(e) => handleFilter(e)}
									>
										<div className="form-group mb-3">
											<label
												htmlFor="search_keyword"
												className="form-control-label"
											>
												คำที่ต้องการค้นหา
											</label>
											<input
												type="search"
												id="search_keyword"
												name="search_keyword"
												className="form-control"
												placeholder="ค้นหา..."
												value={keywordQuery}
												onChange={(e) => handleKeywordQuery(e)}
											/>
										</div>

										<div className="row">
											<div className="col-sm-6">
												<label htmlFor="search_position">ตำแหน่งฝึกงาน</label>
												<div className="mb-3">
													<MultiSelect
														options={positionOptions.sort((a, b) => {
															return a.label.localeCompare(b.label);
														})}
														value={selectedPosition}
														onChange={setSelectedPosition}
														labelledBy="search_position"
														overrideStrings={overrideStrings}
														isCreatable={true}
														onCreateOption={handleNewPosition}
													/>
												</div>
											</div>
											<div className="col-sm-6">
												<label htmlFor="search_location">สถานที่ฝึกงาน</label>
												<div className="mb-3">
													<MultiSelect
														options={locationOptions.sort((a, b) => {
															return a.label.localeCompare(b.label);
														})}
														value={selectedLocation}
														onChange={setSelectedLocation}
														labelledBy="search_location"
														overrideStrings={overrideStrings}
														isCreatable={false}
													/>
												</div>
											</div>
										</div>

										<button
											form="search_form"
											className={`${btn.btn_blue} w-100 p-2`}
											type="submit"
										>
											<FontAwesomeIcon icon={faSearch} /> ค้นหา
										</button>
									</form>
								</div>

								{/* {jobData
									.slice()
									.reverse()
									.map((item) => (
										<div key={item.job_id} className="mb-2">
											<Job
												key={item.job_id}
												id={item.job_id}
												img={item.employer.company_pic}
												title={item.job_title}
												company={item.employer.company_name}
												location={item.location}
												allowance={item.salary}
												positions={
													Array.isArray(item.cat)
														? item.cat
														: typeof item.cat === "string"
														? JSON.parse(item.cat)
														: []
												}
												startPost={item.dateStartPost}
												endPost={item.dateEndPost}
											/>
										</div>
									))} */}
								<PaginationBar
									data={jobData}
									pageParam={pageParam}
									itemsPerPage={itemsPerPage}
								/>
							</>
						) : (
							<PostIsNull />
						)}
					</div>

					<div className="col-12 col-lg-3">
						{jobData ? (
							<>
								<div className="job-search-container bg-light border rounded px-2 px-xl-3 d-none d-lg-block">
									<div className="d-flex justify-content-between my-3">
										<h5 className="fw-bold">ค้นหาตำแหน่งฝึกงาน</h5>
									</div>

									<form
										id="search_form"
										className="form-outline mb-4"
										onSubmit={(e) => handleFilter(e)}
									>
										{/* {selectedSearchField === "positions" ? (
											<>
												<input
													list="positionsList"
													type="text"
													className="form-control"
													placeholder="ค้นหาตำแหน่ง..."
													value={keywordQuery}
													onChange={(e) => handleKeywordQuery(e)}
												/>
												<datalist id="positionsList">
													{jobPositions.map((position) => (
														<option key={position} value={position} />
													))}
												</datalist>
											</>
										) : (
											<>
												<div className="form-group mb-2">
													<label
														htmlFor="search_keyword"
														className="form-control-label"
													>
														คำที่ต้องการค้นหา
													</label>
													<input
														type="search"
														id="search_keyword"
														name="search_keyword"
														className="form-control"
														placeholder="ค้นหา..."
														value={keywordQuery}
														onChange={(e) => handleKeywordQuery(e)}
													/>
												</div>

												<div className="form-group mb-2">
													<label
														htmlFor="search_position"
														className="form-control-label"
													>
														ตำแหน่งฝึกงาน
													</label>
													<input
														list="positionsList"
														type="text"
														id="search_position"
														name="search_position"
														className="form-control"
														placeholder="ค้นหาตำแหน่ง"
														value={positionQuery}
														onChange={(e) => handleKeywordQuery(e)}
													/>
													<datalist id="positionsList">
														{jobPositions.map((position) => (
															<option key={position} value={position} />
														))}
													</datalist>
												</div>
											</>
										)} */}

										<div className="form-group mb-3">
											<label
												htmlFor="search_keyword"
												className="form-control-label"
											>
												คำที่ต้องการค้นหา
											</label>
											<input
												type="search"
												id="search_keyword"
												name="search_keyword"
												className="form-control"
												placeholder="ค้นหา..."
												value={keywordQuery}
												onChange={(e) => handleKeywordQuery(e)}
											/>
										</div>

										<label htmlFor="search_position">ตำแหน่งฝึกงาน</label>
										<div className="mb-3">
											<MultiSelect
												options={positionOptions.sort((a, b) => {
													return a.label.localeCompare(b.label);
												})}
												value={selectedPosition}
												onChange={setSelectedPosition}
												labelledBy="search_position"
												overrideStrings={overrideStrings}
												isCreatable={true}
												onCreateOption={handleNewPosition}
											/>
										</div>

										<label htmlFor="search_location">สถานที่ฝึกงาน</label>
										<div className="mb-3">
											<MultiSelect
												options={locationOptions.sort((a, b) => {
													return a.label.localeCompare(b.label);
												})}
												value={selectedLocation}
												onChange={setSelectedLocation}
												labelledBy="search_location"
												overrideStrings={overrideStrings}
												isCreatable={false}
											/>
										</div>

										<button
											form="search_form"
											className={`${btn.btn_blue} w-100 p-2`}
											type="submit"
										>
											<FontAwesomeIcon icon={faSearch} /> ค้นหา
										</button>
									</form>
								</div>
							</>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		</>
	);

	function PostIsNull() {
		return (
			<div className="d-flex flex-column justify-content-center align-items-center p-5 min-vh-100 text-muted bg-light container-card">
				<h4>ยังไม่มีตำแหน่งฝึกงานที่เปิดรับในระบบ</h4>
				<small>
					- นักศึกษา สามารถยื่นฝึกงานเองได้ที่ :{" "}
					<span className="text-light-blue">
						<Link to={"/student/self-enroll"}>ยื่นที่ฝึกงานเอง</Link>
					</span>
				</small>
				<small>
					- บริษัท/หน่วยงาน สามารถประกาศรับนักศึกษาฝึกงานได้ที่ :{" "}
					<span className="text-light-blue">
						<Link to={"/employer/create-job"}>+ ประกาศรับฝึกงาน</Link>
					</span>
				</small>
			</div>
		);
	}

	function PaginationBar({ data, itemsPerPage }) {
		// console.log(data);
		const sliceReverseData = data.slice().reverse();
		// console.log(sliceReverseData);

		// const [currentPage, setCurrentPage] = useState(1);
		// const itemsPerPage = 8;

		const indexOfLastItem = currentPage * itemsPerPage;
		const indexOfFirstItem = indexOfLastItem - itemsPerPage;

		const firstIndexOfPage = indexOfFirstItem + 1;
		const lastIndexOfPage = Math.min(indexOfLastItem, data.length);

		const currentItems = sliceReverseData.slice(
			indexOfFirstItem,
			indexOfLastItem
		);
		const totalPages = Math.ceil(sliceReverseData.length / itemsPerPage);

		const handlePageChange = (newPage) => {
			if (newPage >= 1 && newPage <= totalPages) {
				setCurrentPage(newPage);
			}

			navigate({
				pathname: "/alljob",
				search: `?page=${newPage}`,
			});
		};

		const calculatePageNumbers = () => {
			const pageNumbers = [];
			const pageRange = 3;
			const startPage = Math.max(1, currentPage - pageRange);
			const endPage = Math.min(totalPages, currentPage + pageRange);

			if (startPage > 1) {
				pageNumbers.push(1);
				if (startPage > 2) {
					pageNumbers.push("...");
				}
			}

			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(i);
			}

			if (endPage < totalPages) {
				if (endPage < totalPages - 1) {
					pageNumbers.push("...");
				}
				pageNumbers.push(totalPages);
			}

			return pageNumbers;
		};

		const pageNumbers = calculatePageNumbers();

		return (
			<div>
				{currentItems.map((item, index) => (
					<div key={index} className="mb-2">
						<Job
							key={item.job_id}
							id={item.job_id}
							img={item.employer.company_pic}
							title={item.job_title}
							company={item.employer.company_name}
							location={item.location}
							allowance={item.salary}
							positions={
								Array.isArray(item.cat)
									? item.cat
									: typeof item.cat === "string"
									? JSON.parse(item.cat)
									: []
							}
							startPost={item.dateStartPost}
							endPost={item.dateEndPost}
						/>
					</div>
				))}

				<div className="d-flex justify-content-between">
					<div>{`${firstIndexOfPage} - ${lastIndexOfPage} จากทั้งหมด ${data.length} รายการ`}</div>

					<div
						className="btn-toolbar"
						role="toolbar"
						aria-label="Toolbar with button groups"
					>
						<div
							className="btn-group btn-group-sm"
							role="group"
							aria-label="First group"
						>
							<button
								type="button"
								className="btn btn-outline-secondary"
								disabled={currentPage === 1}
								onClick={() => handlePageChange(currentPage - 1)}
								style={{
									cursor: "pointer",
								}}
							>
								<FontAwesomeIcon icon={faChevronLeft} />
							</button>
							{pageNumbers.map((pageNumber, index) => (
								<React.Fragment key={index}>
									{pageNumber === currentPage ? (
										<>
											<button
												type="button"
												className="btn btn-dark"
												onClick={() =>
													typeof pageNumber === "number"
														? handlePageChange(pageNumber)
														: null
												}
												style={{
													cursor:
														typeof pageNumber === "number"
															? "pointer"
															: "default",
												}}
											>
												{pageNumber}
											</button>
										</>
									) : (
										<>
											<button
												type="button"
												className="btn btn-outline-secondary"
												onClick={() =>
													typeof pageNumber === "number"
														? handlePageChange(pageNumber)
														: null
												}
												style={{
													cursor:
														typeof pageNumber === "number"
															? "pointer"
															: "default",
												}}
											>
												{pageNumber}
											</button>
										</>
									)}
								</React.Fragment>
							))}
							<button
								type="button"
								className="btn btn-outline-secondary"
								disabled={currentPage === totalPages}
								onClick={() => handlePageChange(currentPage + 1)}
								style={{
									cursor: "pointer",
								}}
							>
								<FontAwesomeIcon icon={faChevronRight} />
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AllJob;
