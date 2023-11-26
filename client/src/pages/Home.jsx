import React from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Job from "../components/Job";
import btn from "../components/btn.module.css";

function Home() {
	const mockupObject = {
		title: "รับนักศึกษาฝึกงาน ตำแหน่ง x, y, z",
		company: "com x",
		place: "bkk",
		allowance: 100,
		positions: ["full-stack (3)", "front-end (1)", "back-end (2)"],
		created: "xx/xx/xxxx",
	};

	const duplicatedObjects = [];

	let nextId = 1;

	const numberOfDuplicates = 10;

	for (let i = 0; i < numberOfDuplicates; i++) {
		const copy = { ...mockupObject };
		copy.id = nextId;
		nextId++;

		duplicatedObjects.push(copy);
	}

	return (
		<>
			{/* <Header /> */}
			<div className="container p-5">
				<br />
				{/* <h1>Home Page</h1> */}
				<h2>Home Page</h2>
				<br />

				<div className="row justify-content-center gx-5">
					<div className="col-md-3 bg-light">
						<p className="p-2">Search Filter or News</p>
					</div>
					<div className="col-md-9">
						{duplicatedObjects.map((item) => (
							<Job
								key={item.id}
								id={item.id}
								title={item.title}
								company={item.company}
								place={item.place}
								allowance={item.allowance}
								positions={item.positions}
								created={item.created}
							/>
						))}

						<Link to={"/alljob"}>
							<button className={`${btn.btn_blue} w-100`}>
								ดูที่ฝึกงานทั้งหมด
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;
