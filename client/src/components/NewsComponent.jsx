import React, { useState } from "react";
import { Link } from "react-router-dom";

import parse from "html-react-parser";
import DOMPurify from "dompurify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

export default function NewsComponent({
	id,
	cover_img,
	title,
	content,
	other_img,
	postedTime,
	newsItems,
}) {
	const maxTitleLength = 100;
	let truncatedTitle = title.slice(0, maxTitleLength);
	if (title.length > maxTitleLength) {
		truncatedTitle += "...";
	}

	const pContent = pd(content);

	const maxContentLength = 100;
	let truncatedContent = pContent.slice(0, maxContentLength);
	if (pContent.length > maxContentLength) {
		truncatedContent += "...";
	}

	return (
		<>
			<Link to={`/news/article/${id}`}>
				{/* <div className="container">
					<div className="row">
						{newsItems.map((item, index) => (
							<Link to={`/news/article/${item.id}`}>
								<div key={index} className="col-sm-12 col-md-4 mt-3">
									<div className="card">
										<img
											src={item.imageUrl}
											className="card-img-top"
											alt={item.title}
										/>
										<div className="card-body">
											<h5 className="card-title">{item.title}</h5>
											<p className="card-text">{item.content}</p>
											<p className="card-text">
												<small className="text-muted">{item.postedTime}</small>
											</p>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div> */}

				<div className="news-card">
					<div className="row gx-5">
						<div className="col-12 col-md-5 col-lg-4">
							<div className="news-card-img">
								<img
									src={`http://localhost:5500/uploads/2566/${cover_img}`}
									alt="News Cover Image"
									className="img-fluid rounded"
								/>
							</div>
						</div>
						<div className="col-12 col-md-7 col-lg-8">
							<div className="p-2">
								<div className="news-card-title">
									<h5 className="fw-bold">{truncatedTitle}</h5>
								</div>
								<div className="news-card-content">
									<p>{truncatedContent}</p>
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

	function pd(htmlString) {
		const sanitizedHtml = DOMPurify.sanitize(htmlString);
		parse(sanitizedHtml);

		return sanitizedHtml;
	}
}
