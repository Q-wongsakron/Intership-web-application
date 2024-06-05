import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Job from "../components/Job";
import btn from "../components/btn.module.css";
import Loading from "../components/Loading";
import PageNotFound from "./PageNotFound";
import NewsComponent from "../components/NewsComponent";
import NewsComponentB from "../components/NewsComponentB";

import { internJobPositions } from "../components/internJobPositions";
import { internJobLocations } from "../components/internJobLocations";
import { MultiSelect } from "react-multi-select-component";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
	faSearch,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

function Home() {
	const [jobData, setJobData] = useState([]);
	const [allJobData, setAllJobData] = useState([]);
	const [jobLocationData, setJobLocationData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newsData, setNewsData] = useState([]);

	const navigate = useNavigate();

	const fetchData = async () => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + "/listPosts"
			);
			const getNewsData = await axios.get(
				import.meta.env.VITE_APP_API + "/allNews"
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
				setAllJobData(response.data);

				// setJobData(response.data);

				// const slicedJobData = response.data.slice(0, 8); // first 8 items
				// setJobData(slicedJobData);

				const length = response.data.length;
				let slicedJobData;

				// if (length <= 8) {
				// 	slicedJobData = response.data;
				// } else {
				// 	slicedJobData = response.data.slice(length - 8, length); // last 8 items
				// }

				// const mockArr = [].concat(...Array(10).fill(response.data));
				// slicedJobData = mockArr.slice(mockArr.length - 40, mockArr.length);

				slicedJobData = response.data.slice(length - 40, length); // last 40 items because I want to have 5 pages and 8 items per page
				setJobData(slicedJobData);

				// setJobLocationData(
				// 	response.data.map((item) => {
				// 		return {
				// 			label: item.province,
				// 			value: item.province,
				// 		};
				// 	})
				// );
			}

			if (getNewsData.data) {
				const lengthNews = getNewsData.data.length;
				let slicedNewsData;
				if (lengthNews <= 5) {
					slicedNewsData = getNewsData.data;
				} else {
					slicedNewsData = getNewsData.data.slice(lengthNews - 5, lengthNews);
				}
				setNewsData(slicedNewsData);
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

	const reactSelectStyles = {
		control: (provided) => ({
			...provided,
			border: "1px solid #e1e5e9",
			borderRadius: "6px",
			boxShadow: "none",
		}),
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isSelected
				? "#06b4e4"
				: state.isFocused
				? "#eeeeee"
				: "white",
			color: state.isSelected ? "white" : "black",
		}),
	};

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div
				className="home-title bg-blue bg-gradient text-white shadow-sm mb-3 mb-xl-0"
				style={{
					paddingBlock: "50px",
				}}
			>
				<div className="container px-3 px-xl-5 mt-5">
					<h2 className="fw-bold">
						ระบบสนับสนุนวิชาฝึกงานของภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์
					</h2>
				</div>
			</div>

			<div className="container p-3 p-xl-5 mb-3 mb-xl-0">
				{/* <h3 className="my-4 mb-sm-5 fw-bold">
					ระบบสนับสนุนวิชาฝึกงานของภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์
				</h3> */}

				{allJobData.length !== 0 && (
					<div className="job-search-container text-dark bg-light border rounded px-2 px-xl-3 mb-5 shadow-sm">
						<div className="d-flex justify-content-between my-3">
							<h5 className="fw-bold">ค้นหาตำแหน่งฝึกงาน</h5>
						</div>

						<form
							id="search_form"
							className="form-outline mb-4"
							onSubmit={(e) => handleFilter(e)}
						>
							<div className="row">
								<div className="col-12 col-lg-4">
									<div className="form-group mb-3 mb-md-0">
										<label
											htmlFor="search_keyword"
											className="form-control-label"
											title="ค้นหา โพสต์/ชื่อบริษัท/ตำแหน่ง"
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
											title="ค้นหา โพสต์/ชื่อบริษัท/ตำแหน่ง"
										/>
									</div>
								</div>
								<div className="col-12 col-lg-4">
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
										{/* <CreatableSelect
											isMulti
											options={positionOptions.sort((a, b) => {
												return a.label.localeCompare(b.label);
											})}
											value={selectedPosition}
											onChange={setSelectedPosition}
											id="search_position"
											placeholder="ค้นหา/เลือก..."
											styles={reactSelectStyles}
											closeMenuOnSelect={false}
										/> */}
									</div>
								</div>
								<div className="col-12 col-lg-4">
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
										{/* <CreatableSelect
											isMulti
											options={locationOptions.sort((a, b) => {
												return a.label.localeCompare(b.label);
											})}
											value={selectedLocation}
											onChange={setSelectedLocation}
											id="search_location"
											placeholder="ค้นหา/เลือก..."
											styles={reactSelectStyles}
											closeMenuOnSelect={false}
										/> */}
									</div>
								</div>
							</div>

							<div className="d-flex justify-content-end">
								<button
									form="search_form"
									className={`${btn.btn_blue} w-25 p-2 text-wrap`}
									type="submit"
								>
									<FontAwesomeIcon icon={faSearch} /> ค้นหา
								</button>
							</div>
						</form>
					</div>
				)}

				<div className="row justify-content-center">
					<p className="">
						<span className="fw-bold">
							ประกาศรับนักศึกษาฝึกงานล่าสุด
							{allJobData.length !== 0 &&
								` (${jobData.length && jobData.length} จากทั้งหมด
							${allJobData.length && allJobData.length})`}{" "}
							-{" "}
						</span>
						<Link to={"/alljob"}>ดูทั้งหมด</Link>
					</p>

					<div className="col-12 col-lg-9">
						{allJobData.length !== 0 ? (
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
								<PaginationBar data={jobData} />

								{allJobData.length >= 8 && (
									<div className={`text-center mt-4`}>
										<Link to={"/alljob"}>
											<button className={`${btn.btn_blue} w-100`}>
												ดูตำแหน่งฝึกงานทั้งหมด
											</button>
										</Link>
									</div>
								)}
							</>
						) : (
							<PostIsNull />
						)}

						{/* <hr className="hr-blue d-block d-md-none" /> */}
					</div>

					<div className="col-12 col-lg-3 my-5 my-lg-0">
						{newsData.length !== 0 && (
							<>
								<div className="d-none d-lg-block">
									<div className="d-flex justify-content-between">
										<p>
											<span className="fw-bold">ข่าวประชาสัมพันธ์ - </span>
											<Link to={"/news"}>ดูทั้งหมด</Link>
										</p>
									</div>
									{newsData.length !== 0 ? (
										<>
											{newsData.map((item) => (
												<div key={item.news_id} className="">
													<NewsComponentB
														id={item.news_id}
														cover_img={item.cover_img}
														title={item.topic}
														content={item.detail}
														postedTime={item.postedTime}
													/>
												</div>
											))}
										</>
									) : (
										<NewsIsNull />
									)}
								</div>
								<div className="d-block d-lg-none">
									<p className="fw-bold">ข่าวประชาสัมพันธ์</p>
									{newsData ? (
										<>
											{newsData.map((item) => (
												<div key={item.news_id} className="">
													<NewsComponent
														id={item.news_id}
														cover_img={item.cover_img}
														title={item.topic}
														content={item.detail}
														postedTime={item.postedTime}
													/>
												</div>
											))}

											<div className="text-center mt-4">
												<Link to={"/news"}>
													<button className={`${btn.btn_blue} w-100`}>
														ดูข่าวประชาสัมพันธ์ทั้งหมด
													</button>
												</Link>
											</div>
										</>
									) : (
										<NewsIsNull />
									)}
								</div>
							</>
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

	function NewsIsNull() {
		return (
			<div className="d-flex flex-column justify-content-center align-items-center p-5 min-vh-100 text-muted bg-light container-card">
				<h4>ยังไม่มีข่าวประชาสัมพันธ์</h4>
			</div>
		);
	}

	function PaginationBar({ data }) {
		// console.log(data);
		const sliceReverseData = data.slice().reverse();
		// console.log(sliceReverseData);

		const [currentPage, setCurrentPage] = useState(1);
		const itemsPerPage = 8;

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

export default Home;
