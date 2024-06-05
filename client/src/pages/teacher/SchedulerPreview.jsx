import React, { useState } from "react";

import { format } from "date-fns";
import thLocale from "date-fns/locale/th";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import HtmlParser from "../../components/HtmlParser";

function SchedulerPreview({ formData }) {
	const [currentDate, setCurrentDate] = useState(getDate());
	const [coverImgUrl, setCoverImgUrl] = useState(null);
	const [otherImgUrl, setOtherImgUrl] = useState([]);

	function getDate() {
		const today = new Date();
		const month = today.getMonth() + 1;
		const year = today.getFullYear();
		const date = today.getDate();

		// คิดงี้ได้ไหม555
		const initialChristYear = 2024;
		let initialThaiYear = 2567;
		const yearChange = year - initialChristYear;
		const thaiYear = (initialThaiYear += yearChange);

		// const formattedDate = format(today, `dd MMMM yyyy`, {
		// 	locale: thLocale,
		// });
		const formattedDate = format(today, `dd MMMM ${thaiYear}`, {
			locale: thLocale,
		});
		// return `${date}/${month}/${year}`;
		return formattedDate;
	}

	const coverImgFile = formData.coverImage;
	if (coverImgFile) {
		const reader = new FileReader();
		reader.onload = () => {
			setCoverImgUrl(reader.result);
		};
		reader.readAsDataURL(coverImgFile);
	}

	const otherImgFiles = formData.otherImage;
	if (otherImgFiles && otherImgFiles.length > 0) {
		const urls = [];
		Array.from(otherImgFiles).forEach((file) => {
			const reader = new FileReader();
			reader.onload = () => {
				urls.push({ url: reader.result, name: file.name });

				if (urls.length === otherImgFiles.length) {
					setOtherImgUrl(urls);
				}
			};
			reader.readAsDataURL(file);
		});
	}

	return (
		<>
			<div className="container p-2 p-lg-3 p-xl-5 mb-3 mb-xl-0 bg-white rounded">
				<div className="row justify-content-center">
					<div className="col-12">
						{formData.topic ? (
							<h3 className="my-4 fw-bold">{formData.topic}</h3>
						) : (
							<h3 className="my-4 fw-bold text-muted">หัวเรื่อง</h3>
						)}

						<p className="text-muted">
							<FontAwesomeIcon icon={faCalendarDays} />

							{formData.postedTime ? (
								<> {formData.postedTime}</>
							) : (
								<> {currentDate}</>
							)}
						</p>

						<div className="mb-4">
							{coverImgUrl ? (
								<img
									src={coverImgUrl}
									alt="News Cover Image"
									className="img-fluid rounded"
								/>
							) : (
								<div className="p-5 bg-light rounded text-center">
									<p className="text-muted">ภาพปกข่าว</p>
								</div>
							)}
						</div>

						<div>
							{formData.detail ? (
								<>
									<HtmlParser htmlString={formData.detail} />
								</>
							) : (
								<p className="text-muted my-5">เนื้อหา</p>
							)}
						</div>

						<div className="otherImg">
							<p className="fw-bold">ภาพที่เกี่ยวข้อง (ถ้ามี)</p>
							<div className="row row-cols-1 row-cols-md-2 g-3">
								{!otherImgUrl.length ? (
									<>
										{/* {otherImgUrl.length > 0 && (
											<div>
												{otherImgUrl.map((image, index) => (
													<img
														key={image.name}
														src={image.url}
														className="img-fluid rounded"
														alt={`Uploaded ${index}`}
														style={{
															objectFit: "cover",
															maxWidth: "18.75rem",
															maxHeight: "12.5rem",
														}}
													/>
												))}
											</div>
										)} */}
									</>
								) : (
									<>
										<div
											className="p-4 me-3 bg-light rounded text-center"
											style={{ maxWidth: "18.75rem", maxHeight: "12.5rem" }}
										>
											<p className="text-muted">ภาพที่ 1</p>
										</div>
										<div
											className="p-4 me-3 bg-light rounded text-center"
											style={{ maxWidth: "18.75rem", maxHeight: "12.5rem" }}
										>
											<p className="text-muted">ภาพที่ 2</p>
										</div>
										<div
											className="p-4 me-3 bg-light rounded text-center"
											style={{ maxWidth: "18.75rem", maxHeight: "12.5rem" }}
										>
											<p className="text-muted">ภาพที่ 3</p>
										</div>
										<div
											className="p-4 me-3 bg-light rounded text-center"
											style={{ maxWidth: "18.75rem", maxHeight: "12.5rem" }}
										>
											<p className="text-muted">ภาพที่ 4</p>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default SchedulerPreview;
