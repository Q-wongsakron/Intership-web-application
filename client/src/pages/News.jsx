import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import btn from "../components/btn.module.css";
import NewsComponent from "../components/NewsComponent";
import Loading from "../components/Loading";
import PageNotFound from "./PageNotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
	faSearch,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function News() {
	const [data, setData] = useState([]);
	const fetchData = async () => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + "/allNews"
			);
			setData(response.data);
		} catch (error) {
			console.error("Error fetching data", error);
		}
	};

	// const testTile =
	// 	"Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel reprehenderit quis eligendi autem ipsam aperiam officia commodi obcaecati deleniti repudiandae.";
	// const testContent =
	// 	"Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, voluptatibus culpa non voluptates provident ullam sapiente ea nulla ab facere iure, dignissimos odio pariatur. Molestiae tenetur quam asperiores culpa fugiat explicabo consequatur ipsam, sint fuga qui quod magni corrupti reprehenderit eos corporis eius incidunt. Facilis deleniti modi est animi reprehenderit.";
	// const newsItems = [
	// 	{
	// 		id: 1,
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=2080&auto=format&fit=crop&ixlib=",
	// 		title: testTile,
	// 		content: testContent,
	// 		postedTime: "12/2/2567",
	// 	},
	// 	{
	// 		id: 2,
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1533450718592-29d45635f0a9?q=80&w=2070&auto=format&fit=crop&ixlib=",
	// 		title: testTile,
	// 		content: testContent,
	// 		postedTime: "12/2/2567",
	// 	},
	// 	{
	// 		id: 3,
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=2080&auto=format&fit=crop&ixlib=",
	// 		title: "News 1",
	// 		content: "Content for news 1",
	// 		postedTime: "12/2/2567",
	// 	},
	// 	{
	// 		id: 4,
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1533450718592-29d45635f0a9?q=80&w=2070&auto=format&fit=crop&ixlib=",
	// 		title: "News 2",
	// 		content: "Content for news 2",
	// 		postedTime: "12/2/2567",
	// 	},
	// 	{
	// 		id: 5,
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1533450718592-29d45635f0a9?q=80&w=2070&auto=format&fit=crop&ixlib=",
	// 		title: "News 2",
	// 		content: "Content for news 2",
	// 		postedTime: "12/2/2567",
	// 	},
	// ];
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<div className="container p-3 p-xl-5 mb-3 mb-xl-0">
				<h3 className="my-4 mb-sm-5 fw-bold">ข่าวประชาสัมพันธ์</h3>

				<div className="row justify-content-center">
					<div className="fw-bold mb-4">
						<Link to={"/"}>หน้าหลัก</Link>
						<span>{` > `}</span>
						<Link to={"/news"}>ประชาสัมพันธ์</Link>
					</div>

					<div className="col-12 col-lg-9">
						{/* {newsItems.length ? (
							<>
								<NewsComponent newsItems={newsItems} />
							</>
						) : (
							<PostIsNull />
						)} */}

						{data.length ? (
							<>
								{/* {data.map((item) => (
									<div key={item.news_id}>
										<div className="mb-4">
											<NewsComponent
												id={item.news_id}
												cover_img={item.cover_img}
												title={item.topic}
												content={item.detail}
												postedTime={item.postedTime}
											/>
										</div>
										<hr className="hr-grey" />
									</div>
								))} */}
								<PaginationBar data={data} />
							</>
						) : (
							<PostIsNull />
						)}

						{/* <hr className="hr-blue d-block d-md-none" /> */}
					</div>

					{/* <div className="col-12 col-lg-3 my-3 my-md-0 container-card">
						<p className="p-3">Search Filter or News</p>
					</div> */}
				</div>
			</div>
		</>
	);

	function PostIsNull() {
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
		const itemsPerPage = 5;

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
						<div className="mb-4">
							<NewsComponent
								id={item.news_id}
								cover_img={item.cover_img}
								title={item.topic}
								content={item.detail}
								postedTime={item.postedTime}
							/>
						</div>
						<hr className="hr-grey" />
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

export default News;
