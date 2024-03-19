import React, { useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

export default function NewsComponentB({
	id,
	cover_img,
	title,
	content,
	other_img,
	postedTime,
	newsItems,
}) {
	const maxTitleLength = 60;
	let truncatedTitle = title.slice(0, maxTitleLength);
	if (title.length > maxTitleLength) {
		truncatedTitle += "...";
	}

	const maxContentLength = 120;
	let truncatedContent = content.slice(0, maxContentLength);
	if (content.length > maxContentLength) {
		truncatedContent += "...";
	}

	// let truncatedContent = "";

	return (
		<>
			<Link to={`/news/article/${id}`}>
				<div className="news-card">
					<div className="row">
						<div className="col-12">
							<div className="news-card-img-b">
								<img
									src={`http://localhost:5500/uploads/2566/${cover_img}`}
									alt="News Cover Image"
									className="img-fluid rounded"
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="p-2">
								<div className="news-card-title">
									<h6 className="fw-bold">{truncatedTitle}</h6>
								</div>
								<div className="news-card-posted d-flex align-items-center">
									<p className="text-muted">
										<FontAwesomeIcon icon={faCalendarDays} /> {postedTime}
									</p>
								</div>
								<div className="news-card-actions">
									<p className="a-text">รายละเอียดเพิ่มเติม...</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</>
	);
}
