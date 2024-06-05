import React, { useEffect, useState } from "react";
import {
	Link,
	useSearchParams,
	useLocation,
	useNavigate,
} from "react-router-dom";

import Job from "../components/Job";
import btn from "../components/btn.module.css";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSearch,
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from "react-multi-select-component";
import { internJobPositions } from "../components/internJobPositions";
import { internJobLocations } from "../components/internJobLocations";

import axios from "axios";

function SearchJob() {
	const [jobData, setJobData] = useState(null); // should be null or empty array?
	const [jobLocationData, setJobLocationData] = useState([]);
	const [loading, setLoading] = useState(true);

	const [flag, setFlag] = useState(1); // use for check that searching found or not

	const [currentPage, setCurrentPage] = useState(1);
	let itemsPerPage = 8;

	const location = useLocation();

	const keywordParam = new URLSearchParams(location.search).get("keyword");
	const positionsParam = new URLSearchParams(location.search).get("positions");
	const locationsParam = new URLSearchParams(location.search).get("locations");
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
				setJobData(
					response.data.map((item) => ({
						job_id: item.job_id,
						job_title: item.job_title,
						company_pic: item.employer.company_pic,
						company_name: item.employer.company_name,
						confirm_id: item.confirm_id,
						location: item.location,
						province: item.province,
						district: item.district,
						subdistrict: item.subdistrict,
						salary: item.salary,
						positions: Array.isArray(item.cat)
							? item.cat
							: typeof item.cat === "string"
							? JSON.parse(item.cat)
							: [],
						dateStartPost: item.dateStartPost,
						dateEndPost: item.dateEndPost,
						mixed_location:
							item.location + item.province + item.district + item.subdistrict,
					}))
				);
				// setJobLocationData(
				// 	response.data.map((item) => {
				// 		return {
				// 			label: item.province,
				// 			value: item.province,
				// 		};
				// 	})
				// );

				let totalPages;
				const page = Number(pageParam);

				if (
					keywordParam === null &&
					positionsParam === null &&
					locationsParam === null
				) {
					setKeywordQuery("");
					setSelectedPosition([]);
					setSelectedLocation([]);
					setFilteredData([]);

					totalPages = Math.ceil(response.data.length / itemsPerPage);
				} else {
					let parsedPositions = [];
					let parsedLocations = [];

					if (positionsParam) {
						const decodedPositions = decodeURIComponent(positionsParam);
						parsedPositions = JSON.parse(decodedPositions);
						setSelectedPosition(parsedPositions);
					}

					if (locationsParam) {
						const decodedLocations = decodeURIComponent(locationsParam);
						parsedLocations = JSON.parse(decodedLocations);
						setSelectedLocation(parsedLocations);
					}

					const filtered = response.data
						.map((item) => ({
							job_id: item.job_id,
							job_title: item.job_title,
							province: item.province,
							district: item.district,
							subdistrict: item.subdistrict,
							company_pic: item.employer.company_pic,
							company_name: item.employer.company_name,
							positions: Array.isArray(item.cat)
								? item.cat
								: typeof item.cat === "string"
								? JSON.parse(item.cat)
								: [],
							location: item.location,
							salary: item.salary,
							dateStartPost: item.dateStartPost,
							dateEndPost: item.dateEndPost,
							mixed_location:
								item.location +
								item.province +
								item.district +
								item.subdistrict,
						}))
						.filter((item) => {
							const matchesQuery = fieldsToSearch.some((field) =>
								item[field]?.toLowerCase().includes(keywordParam.toLowerCase())
							);

							const matchesPosition =
								parsedPositions.length === 0 ||
								parsedPositions.some((position) =>
									item.positions
										?.toLowerCase()
										.includes(position.value.toLowerCase())
								);

							const matchesLocation =
								parsedLocations.length === 0 ||
								parsedLocations.some((location) =>
									item.mixed_location
										?.toLowerCase()
										.includes(location.value.toLowerCase())
								);

							return matchesQuery && matchesLocation && matchesPosition;
						});

					setFlag(filtered.length ? 2 : 3);
					setFilteredData(filtered);

					totalPages = Math.ceil(filtered.length / itemsPerPage);
				}

				if (page >= 1 && page <= totalPages) {
					setCurrentPage(page);
				} else if (page > totalPages) {
					setCurrentPage(totalPages);
				} else {
					setCurrentPage(1);
				}
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const [keywordQuery, setKeywordQuery] = useState(keywordParam);
	const [selectedPosition, setSelectedPosition] = useState([]);
	const positionOptions = internJobPositions;
	const [selectedLocation, setSelectedLocation] = useState([]);

	const fieldsToSearch = [
		"job_title",
		"company_name",
		// "mixed_location",
		// "province",
		"positions",
	];
	const [filteredData, setFilteredData] = useState([]);

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
			const filtered = jobData
				.map((item) => ({
					job_id: item.job_id,
					job_title: item.job_title,
					company_pic: item.company_pic,
					company_name: item.company_name,
					positions: item.positions,
					location: item.location,
					province: item.province,
					district: item.district,
					subdistrict: item.subdistrict,
					salary: item.salary,
					dateStartPost: item.dateStartPost,
					dateEndPost: item.dateEndPost,
					mixed_location:
						item.location + item.province + item.district + item.subdistrict,
				}))
				.filter((item) => {
					const matchesQuery = fieldsToSearch.some((field) =>
						item[field]?.toLowerCase().includes(keywordQuery.toLowerCase())
					);

					const matchesPosition =
						selectedPosition.length === 0 ||
						selectedPosition.some((position) =>
							item.positions
								?.toLowerCase()
								.includes(position.value.toLowerCase())
						);

					const matchesLocation =
						selectedLocation.length === 0 ||
						selectedLocation.some((location) =>
							item.mixed_location
								?.toLowerCase()
								.includes(location.value.toLowerCase())
						);

					return matchesQuery && matchesLocation && matchesPosition;
				});
			setFlag(filtered.length ? 2 : 3);

			setFilteredData(filtered);

			const jsonPosition = JSON.stringify(selectedPosition);
			const jsonLocation = JSON.stringify(selectedLocation);

			const encodedPosition = encodeURIComponent(jsonPosition);
			const encodedLocation = encodeURIComponent(jsonLocation);

			navigate({
				pathname: "/search",
				search: `?keyword=${keywordQuery}&positions=${encodedPosition}&locations=${encodedLocation}&page=${1}`,
			});
		} else {
			setFlag(1);
			navigate({
				pathname: "/search",
				search: `&page=${1}`,
			});
		}
	};

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
					<span>{` > `}</span>
					<span>
						{keywordParam === null || keywordParam === ""
							? "ค้นหาตำแหน่งฝึกงาน"
							: `ผลการค้นหา : "${keywordParam}"`}
					</span>
					{/* <Link
						to={{
							pathname: "/search",
							search: `${
								keywordParam !== null ||
								positionsParam !== null ||
								locationsParam !== null
									? `?keyword=${keywordParam}`
									: ""
							}`,
						}}
					>
						{keywordParam === null || keywordParam === ""
							? "ค้นหาตำแหน่งฝึกงาน"
							: `ผลการค้นหา : "${keywordParam}"`}
					</Link> */}
				</div>

				<div className="row justify-content-center">
					<h3 className="my-4 mb-sm-5 fw-bold">
						{keywordParam === null || keywordParam === ""
							? "ค้นหาตำแหน่งฝึกงาน"
							: `ผลการค้นหา : "${keywordParam}"`}
					</h3>

					{keywordParam !== null &&
					positionsParam !== null &&
					locationsParam !== null &&
					jobData ? (
						<p className="d-none d-lg-block">
							<span className="fw-bold">
								ผลการค้นหา : {`${filteredData.length} รายการ`}
							</span>
						</p>
					) : (
						<></>
					)}

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

								{keywordParam !== null &&
								positionsParam !== null &&
								locationsParam !== null &&
								jobData ? (
									<p className="d-block d-lg-none">
										<span className="fw-bold">
											ผลการค้นหา : {`${filteredData.length} รายการ`}
										</span>
									</p>
								) : (
									<></>
								)}

								{filteredData.length === 0 && flag === 1 ? (
									<>
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
								) : filteredData.length && flag === 2 ? (
									<>
										{/* {filteredData
											.slice()
											.reverse()
											.map((item) => (
												<div key={item.job_id} className="mb-2">
													<Job
														key={item.job_id}
														id={item.job_id}
														img={item.company_pic}
														title={item.job_title}
														company={item.company_name}
														location={item.location}
														allowance={item.salary}
														positions={
															Array.isArray(item.positions)
																? item.positions
																: typeof item.positions === "string"
																? JSON.parse(item.positions)
																: []
														}
														startPost={item.dateStartPost}
														endPost={item.dateEndPost}
													/>
												</div>
											))} */}
										<PaginationBar
											data={filteredData}
											pageParam={pageParam}
											itemsPerPage={itemsPerPage}
										/>
									</>
								) : (
									<>
										<div className="p-4 w-100 border rounded bg-light">
											<span>ค้นหาไม่พบ</span>
										</div>
									</>
								)}
							</>
						) : (
							<PostIsNull />
						)}

						{filteredData.length < 4 && flag !== 1 ? (
							<div
								className=""
								style={{
									height: `${filteredData.length === 0 ? "37.5rem" : "25rem"}`,
								}}
							></div>
						) : (
							<></>
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
											<div className="form-group mb-2">
												<label
													htmlFor="search_keyword"
													className="form-control-label"
												>
													คำที่ต้องการค้นหา
												</label>
												<input
													type="text"
													id="search_keyword"
													className="form-control"
													placeholder="ค้นหา..."
													value={keywordParam}
													onChange={(e) => handleKeywordQuery(e)}
												/>
											</div>
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

			if (
				keywordParam === null &&
				positionsParam === null &&
				locationsParam === null
			) {
				setKeywordQuery("");
				setSelectedPosition([]);
				setSelectedLocation([]);
				setFilteredData([]);
				// console.log("test1");

				navigate({
					pathname: "/search",
					search: `&page=${newPage}`,
				});
			} else {
				// console.log("test2");
				// console.log(keywordParam);
				// console.log(keywordQuery);

				if (keywordParam !== keywordQuery) {
					setKeywordQuery(keywordParam);
				}

				let parsedPositions = [];
				let parsedLocations = [];

				if (positionsParam) {
					const decodedPositions = decodeURIComponent(positionsParam);
					parsedPositions = JSON.parse(decodedPositions);
					// setSelectedPosition(parsedPositions);
				}

				if (locationsParam) {
					const decodedLocations = decodeURIComponent(locationsParam);
					parsedLocations = JSON.parse(decodedLocations);
					// setSelectedLocation(parsedLocations);
				}

				const jsonPosition = JSON.stringify(parsedPositions);
				const jsonLocation = JSON.stringify(parsedLocations);

				const encodedPosition = encodeURIComponent(jsonPosition);
				const encodedLocation = encodeURIComponent(jsonLocation);

				navigate({
					pathname: "/search",
					search:
						`?keyword=${keywordParam}&positions=${encodedPosition}` +
						`&locations=${encodedLocation}&page=${newPage}`,
				});
			}
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
							img={item.company_pic}
							title={item.job_title}
							company={item.company_name}
							location={item.location}
							allowance={item.salary}
							positions={
								Array.isArray(item.positions)
									? item.positions
									: typeof item.positions === "string"
									? JSON.parse(item.positions)
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

export default SearchJob;
