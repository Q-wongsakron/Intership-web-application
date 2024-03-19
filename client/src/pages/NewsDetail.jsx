import React, { useState, useEffect } from "react";

import { Link, useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

// import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { format } from "date-fns";
import thLocale from "date-fns/locale/th";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import HtmlParser from "../components/HtmlParser";
import Loading from "../components/Loading";
import axios from "axios";

function NewsDetail() {
	const params = useParams();
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(null);
	const [images, setImages] = useState(null);
	const [postedDate, setPostedDate] = useState(null);

	const [error, setError] = useState(null);

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`http://localhost:5500/api/oneNews/${params.articleId}`
			);
			setData(response.data);

			if (response.data.images) {
				setImages(response.data.images.split(","));
			}

			const date = new Date(response.data.postedTime);
			const year = date.getFullYear() + 543; // ได้ไหม
			const formattedDate = format(date, `dd MMMM ${year}`, {
				locale: thLocale,
			});
			// const formattedDate = formatRelative(subDays(new Date(), 3), new Date(), {
			// 	locale: th,
			// });
			setPostedDate(formattedDate);
		} catch (error) {
			console.error("Error fetching data", error);
			setError("Error fetching data. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [params.articleId]);

	const maxTitleLength = 30;
	let truncatedTitle = loading
		? "Loading..."
		: data.topic.slice(0, maxTitleLength);

	if (data && data.topic.length > maxTitleLength) {
		truncatedTitle += "...";
	}

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<div className="container p-3 p-xl-5 mb-3 mb-xl-0">
					<div className="fw-bold mb-4">
						<Link to={"/"}>หน้าหลัก</Link>
						<span>{` > `}</span>
						<Link to={"/news"}>ข่าวประชาสัมพันธ์</Link>
						<span>{` > `}</span>
						<Link to={`/news/article/${params.articleId}`}>
							{truncatedTitle}
						</Link>
					</div>

					<div className="row justify-content-center">
						<div className="col-12 col-lg-9">
							<h3 className="my-4 fw-bold">{data.topic}</h3>

							<p className="text-muted">
								<FontAwesomeIcon icon={faCalendarDays} /> {postedDate}
							</p>

							<div className="mb-4">
								{loading ? (
									<p>Loading cover image...</p>
								) : (
									<Zoom>
										<img
											src={`http://localhost:5500/uploads/2566/${data.cover_img}`}
											alt="News Cover Image"
											className="img-fluid rounded"
											style={{
												maxWidth: "100%",
												maxHeight: "28.125rem",
												// height: "28.125rem",
												objectFit: "cover",
											}}
										/>
									</Zoom>
								)}
							</div>

							<div>
								{data.detail ? (
									<>
										<HtmlParser htmlString={data.detail} />
									</>
								) : (
									<p className="text-muted">เนื้อหา</p>
								)}
							</div>

							{images && (
								<div className="otherImg">
									{/* <p className="fw-bold">ภาพที่เกี่ยวข้อง ({images.length})</p> */}
									<div className="row row-cols-1 row-cols-md-2 g-2">
										{images.map((imageUrl, index) => (
											// <Zoom>
											<img
												key={index}
												src={`http://localhost:5500/uploads/2566/${imageUrl}`}
												alt={`Image ${index}`}
												className="img-fluid rounded"
												style={{
													// maxWidth: "100%",
													maxWidth: "18.75rem",
													maxHeight: "12.5rem",
													objectFit: "cover",
												}}
											/>
											// </Zoom>
										))}
									</div>
								</div>
							)}
						</div>

						<div className="col-12 col-lg-3 my-3 my-md-0">
							<p>{/* <span className="fw-bold">ข่าวอื่น ๆ ?</span> */}</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default NewsDetail;
