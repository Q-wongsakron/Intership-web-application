import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Job from "../components/Job";
import btn from "../components/btn.module.css";
import Loading from "../components/Loading";
import PageNotFound from "./PageNotFound";
import NewsComponent from "../components/NewsComponent";
import NewsComponentB from "../components/NewsComponentB";

import axios from "axios";

function Home() {
	const [jobData, setJobData] = useState(null);
	const [allJobData, setAllJobData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [newsData, setNewsData] = useState(null);

	const fetchData = async () => {
		try {
			const response = await axios.get("http://localhost:5500/api/listPosts");
			const getNewsData = await axios.get("http://localhost:5500/api/allNews");

			if (response.data) {
				// setJobData(response.data);

				// const slicedJobData = response.data.slice(0, 8); // first 8 items
				// setJobData(slicedJobData);

				const length = response.data.length;
				const slicedJobData = response.data.slice(length - 8, length); // last 8 items
				setJobData(slicedJobData);
				setAllJobData(response.data);
			}
			if (getNewsData.data) {
				const lengthNews = getNewsData.data.length;
				const slicedNewsData = getNewsData.data.slice(
					lengthNews - 5,
					lengthNews
				); // last 8 items
				setNewsData(slicedNewsData);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, []);

	if (loading) {
		return <Loading />;
	}

	// const testTile =
	// 	"Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel reprehenderit quis eligendi autem ipsam aperiam officia commodi obcaecati deleniti repudiandae.";
	// const testContent =
	// 	"Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, voluptatibus culpa non voluptates provident ullam sapiente ea nulla ab facere iure, dignissimos odio pariatur. Molestiae tenetur quam asperiores culpa fugiat explicabo consequatur ipsam, sint fuga qui quod magni corrupti reprehenderit eos corporis eius incidunt. Facilis deleniti modi est animi reprehenderit.";
	// const newsItems = [
	// 	{
	// 		id: 1,
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1517732306149-e8f829eb588a?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	// 		title: testTile,
	// 		content: testContent,
	// 		postedTime: "12/2/2567",
	// 	},
	// 	{
	// 		id: 2,
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	// 		title: testTile,
	// 		content: testContent,
	// 		postedTime: "12/2/2567",
	// 	},
	// 	{
	// 		id: 3,
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=2080&auto=format&fit=crop&ixlib=",
	// 		title: testTile,
	// 		content: "Content for news 1",
	// 		postedTime: "12/2/2567",
	// 	},
	// 	{
	// 		id: 4,
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1533450718592-29d45635f0a9?q=80&w=2070&auto=format&fit=crop&ixlib=",
	// 		title: testTile,
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
	// console.log(newsData)
	return (
		<>
			<div className="container p-3 p-xl-5 mb-3 mb-xl-0">
				<h3 className="my-4 mb-sm-5 fw-bold">
					ระบบสนับสนุนวิชาฝึกงานของภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์
				</h3>

				<div className="row justify-content-center">
					<p className="">
						<span className="fw-bold">
							ประกาศรับนักศึกษาฝึกงานล่าสุด ({jobData && jobData.length}) -{" "}
						</span>
						<Link to={"/alljob"}>ดูทั้งหมด</Link>
					</p>

					<div className="col-12 col-lg-9">
						{jobData ? (
							<>
								{jobData
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
									))}

								<div className="text-center mt-4">
									<Link to={"/alljob"}>
										<button className={`${btn.btn_blue} w-100`}>
											ดูตำแหน่งฝึกงานทั้งหมด
										</button>
									</Link>
								</div>
							</>
						) : (
							<PostIsNull />
						)}

						{/* <hr className="hr-blue d-block d-md-none" /> */}
					</div>

					<div className="col-12 col-lg-3 my-5 my-lg-0">
						<div className="d-none d-lg-block">
							<div className="d-flex justify-content-between">
								<p>
									<span className="fw-bold">ข่าวประชาสัมพันธ์ - </span>
									<Link to={"/news"}>ดูทั้งหมด</Link>
								</p>
							</div>
							{newsData ? (
								<>
									{newsData.map((item) => (
										<>
											<div key={item.id} className="">
												<NewsComponentB
													id={item.news_id}
													cover_img={item.cover_img}
													title={item.topic}
													content={item.detail}
													postedTime={item.postedTime}
												/>
											</div>
											{/* <hr className="hr-grey" /> */}
										</>
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
										<>
											<div key={item.id} className="">
												<NewsComponent
													id={item.news_id}
													cover_img={item.cover_img}
													title={item.topic}
													content={item.detail}
													postedTime={item.postedTime}
												/>
											</div>
											{/* <hr className="hr-grey" /> */}
										</>
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
				{/* <small>
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
				</small> */}
			</div>
		);
	}
}

export default Home;
