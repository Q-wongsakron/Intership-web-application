import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import btn from "../components/btn.module.css";
import NewsComponent from "../components/NewsComponent";
import Loading from "../components/Loading";
import PageNotFound from "./PageNotFound";
import axios from "axios";
function News() {
	const [data, setData] = useState(null);
	const fetchData = async () => {
		try {
			const response = await axios.get("http://localhost:5500/api/allNews");
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

						{data ? (
							<>
								{data.map((item) => (
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
								))}
							</>
						) : (
							<PostIsNull />
						)}

						{/* <hr className="hr-blue d-block d-md-none" /> */}
					</div>

					<div className="col-12 col-lg-3 my-3 my-md-0 container-card">
						{/* <p className="p-3">Search Filter or News</p> */}
					</div>
				</div>
			</div>
		</>
	);

	function PostIsNull() {
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

export default News;
