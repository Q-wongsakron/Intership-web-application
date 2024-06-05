import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Job from "../../components/Job";
import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronRight,
	faChevronLeft,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "react-bootstrap";

import { getEmployerProfile } from "../../services/user.service";
import axios from "axios";

function EmAllJob() {
	const [data, setData] = useState({ post: [] });
	const [applyData, setApplyData] = useState([]);
	const [loading, setLoading] = useState(true);

	const user = useSelector((state) => state.user);

	const fetchData = async (authtoken) => {
		try {
			const response = await getEmployerProfile(authtoken);
			setData(response.data);

			const resApply = await axios.get(
				import.meta.env.VITE_APP_API + "/allApply",
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			setApplyData(resApply.data);
		} catch (error) {
			console.log(
				"Load data failed: ",
				error.response ? error.response.data : error.message
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData(user.user.token);
	}, [user.user.token]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="container p-3 p-md-4 container-card employerJobCard">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="employerJobTitle fw-bold">
					โพสต์ทั้งหมด ({data.length === 0 ? "-" : data.post.length})
				</h3>
			</div>
			<div className="employerJob">
				{data.post.length ? (
					<>
						{/* {data.post
							.slice()
							.reverse()
							.map((item) => (
								<div key={item.job_id} className="mb-2">
									<Job
										key={item.job_id}
										id={item.job_id}
										username={data.profile.username}
										img={data.profile.company_pic}
										title={item.job_title}
										company={data.profile.company_name}
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
						<PaginationBar data={data} />
					</>
				) : (
					<div className="d-flex flex-column justify-content-center align-items-center p-5 min-vh-100 text-muted bg-light container-card">
						<h4>ยังไม่มีตำแหน่งฝึกงานที่เปิดรับในระบบ</h4>

						<small>
							- บริษัท/หน่วยงาน สามารถประกาศรับนักศึกษาฝึกงานได้ที่ :{" "}
							<span className="text-light-blue">
								<Link to={"/employer/create-job"}>+ ประกาศรับฝึกงาน</Link>
							</span>
						</small>
					</div>
				)}
			</div>
		</div>
	);

	function PaginationBar({ data }) {
		const sliceReverseData = data.post.slice().reverse();

		const [currentPage, setCurrentPage] = useState(1);
		const itemsPerPage = 8;

		const indexOfLastItem = currentPage * itemsPerPage;
		const indexOfFirstItem = indexOfLastItem - itemsPerPage;

		const firstIndexOfPage = indexOfFirstItem + 1;
		const lastIndexOfPage = Math.min(indexOfLastItem, data.post.length);

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
						{/* <Job
							key={item.job_id}
							id={item.job_id}
							username={data.profile.username}
							img={data.profile.company_pic}
							title={item.job_title}
							company={data.profile.company_name}
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
						/> */}
						<JobComponent
							key={item.job_id}
							id={item.job_id}
							username={data.profile.username}
							img={data.profile.company_pic}
							title={item.job_title}
							company={data.profile.company_name}
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
					<div>{`${firstIndexOfPage} - ${lastIndexOfPage} จากทั้งหมด ${data.post.length} รายการ`}</div>

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

	function JobComponent({
		id,
		username,
		img,
		title,
		company,
		location,
		allowance,
		positions,
		startPost,
		endPost,
	}) {
		const navigate = useNavigate();

		const parsedPositions =
			typeof positions === "string" ? JSON.parse(positions) : positions;

		const titleForUrl = title.toLowerCase().replaceAll(" ", "-");

		const [deleteModal, setDeleteModal] = useState(false);
		const [responseModal, setResponseModal] = useState(false);
		const [responseData, setResponseData] = useState("");

		const currentDate = Date.now();
		const startPostDate = new Date(startPost);
		const endPostDate = new Date(endPost);
		const formattedStartPostDate = startPostDate.toLocaleDateString("en-GB");
		const formattedEndPostDate = endPostDate.toLocaleDateString("en-GB");
		const isPostNotStart = currentDate < startPostDate;
		const isPostEnd = currentDate > endPostDate;

		const isApplyData = applyData?.some(
			(item) =>
				item.job_id === id &&
				(item.status === "รอการตอบรับ" || item.status === "ผ่าน")
		)
			? true
			: false;

		const handleEditBtnClick = (e) => {
			e.preventDefault();
			navigate(`/employer/EditPost/${id}`);
		};

		const handleDeleteBtnClick = (e) => {
			e.preventDefault();
			setDeleteModal(true);
		};

		const handleConfirmDelete = async () => {
			try {
				const deletePostWork = await axios.put(
					import.meta.env.VITE_APP_API + `/deletePost/${id}`,
					{},
					{
						headers: {
							authtoken: user.user.token,
						},
					}
				);

				setDeleteModal(false);
				// setResponseModal(true);
				// if (deletePostWork.status === 200) {
				// 	setResponseData("ลบโพสต์สำเร็จ");
				// } else {
				// 	setResponseData(deletePostWork.data.message);
				// }
				fetchData(user.user.token);
			} catch (error) {
				// console.error(error);
				// console.log(error);
				setDeleteModal(false);
				setResponseData(error.response.data.message);
				setResponseModal(true);
			}
		};

		return (
			<>
				<Link
					to={`/job/${id}/${titleForUrl.toLowerCase().replaceAll(" ", "-")}`}
				>
					<div className="job-card">
						<div className="row">
							<div className="col-12 col-md-3 col-xl-2 d-flex justify-content-md-center justify-content-lg-start">
								<div className="job-card-img mb-3 mb-md-0">
									<img
										src={
											img
												? import.meta.env.VITE_FILE_API + `/uploads/${img}`
												: employerDefaultImg
										}
										alt="Company Logo Image"
										className="img-fluid"
									/>
								</div>
								<div className="job-header-hidden d-block d-md-none px-3">
									<h6 className="job-card-title fw-bold text-break">{title}</h6>
									<small className="text-muted">
										รับสมัคร : {formattedStartPostDate} ถึง{" "}
										<span className={`${isPostEnd ? "text-danger" : ""}`}>
											{formattedEndPostDate}
										</span>
									</small>
								</div>
							</div>
							<div className="col-12 col-md-6 col-xl-7">
								<div className="job-card-details">
									<h6 className="job-card-title d-none d-md-block fw-bold text-break">
										{title}
									</h6>

									<p className="card-text mb-1">
										บริษัท/หน่วยงาน :{" "}
										<span className="text-secondary">{company}</span>
									</p>
									<p className="card-text mb-1">
										สถานที่ฝึกงาน :{" "}
										<span className="text-secondary">{location}</span>
									</p>
									{parsedPositions && (
										<p className="card-text mb-1">
											ตำแหน่ง :{" "}
											<span className="text-secondary">
												{Array.isArray(parsedPositions)
													? parsedPositions.join(", ")
													: parsedPositions}
											</span>
										</p>
									)}
								</div>
							</div>
							<div className="col-12 col-md-3 col-xl-3">
								<div className="job-actions">
									<p className="card-text">
										<small className="text-muted d-none d-md-block">
											รับสมัคร : {formattedStartPostDate} ถึง{" "}
											<span className={`${isPostEnd ? "text-danger" : ""}`}>
												{formattedEndPostDate}
											</span>
										</small>
									</p>
									{user.user.role === "employer" &&
										user.user.username === username && (
											<>
												<div className="d-flex flex-row justify-content-end">
													<button
														className={`w-100 text-center ${btn.btn_grey_outline}`}
														onClick={handleEditBtnClick}
													>
														แก้ไขโพสต์
													</button>
													<button
														className={`ms-1 text-center ${btn.btn_red_outline}`}
														onClick={handleDeleteBtnClick}
														disabled={isApplyData}
													>
														<FontAwesomeIcon icon={faTrash} />
													</button>
												</div>
											</>
										)}
								</div>
							</div>
						</div>
					</div>
				</Link>
				<Modal show={deleteModal} onHide={() => setDeleteModal(false)} centered>
					<Modal.Header closeButton>
						<Modal.Title className="fw-bold text-danger">ลบโพสต์</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						คุณแน่ใจที่จะลบโพสต์การรับสมัครฝึกงาน{" "}
						<span className="fw-semibold">{title}</span> นี้?
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => setDeleteModal(false)}>
							ปิด
						</Button>
						<Button variant="danger" onClick={handleConfirmDelete}>
							<FontAwesomeIcon icon={faTrash} /> ลบ
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					show={responseModal}
					onHide={() => setResponseModal(false)}
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title className="fw-bold">ลบโพสต์ : ตอบกลับ</Modal.Title>
					</Modal.Header>
					<Modal.Body className="text-danger">
						<span>{responseData}</span>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => setResponseModal(false)}>
							ปิด
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	}
}

export default EmAllJob;
