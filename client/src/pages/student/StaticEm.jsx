import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar as faStarSolid,
	faStar,
	faEye,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { Rating } from "react-simple-star-rating";
import DataTable from "react-data-table-component";
import { customStyles } from "../../components/dataTableCustomStyles";
import NoTableData from "../../components/NoTableData";

function StaticEm() {
	const [processedData, setProcessedData] = useState([]);
	const user = useSelector((state) => state.user);

	const generateStarIcons = (resultScore) => {
		const starCount = Math.round(resultScore); // Round the resultScore to the nearest integer
		const stars = [];
		for (let i = 0; i < 5; i++) {
			if (i < starCount) {
				stars.push(
					<FontAwesomeIcon key={i} icon={faStarSolid} className="text-info" />
				);
			} else {
				stars.push(
					<FontAwesomeIcon key={i} icon={faStarRegular} className="text-info" />
				);
			}
		}
		stars.push(
			<span key="text" className="ms-2">
				{resultScore.toFixed(1)} / 5
			</span>
		); // Add text to the right of stars
		return stars;
	};

	// STARTING REACT-DATA-TABLE-COMPONENT PART
	const [tableColOptions, setTableColOptions] = useState({
		company_name: {
			label: "บริษัท/หน่วยงาน",
			is_hide: false,
		},
		company_address: {
			label: "ที่อยู่",
			is_hide: false,
		},
		company_tel: {
			label: "เบอร์ติดต่อ",
			is_hide: false,
		},
		resultScore: {
			label: "คะแนนจากแบบประเมิน",
			is_hide: false,
		},
		// actions: {
		// 	label: "ACTIONS",
		// 	is_hide: false,
		// },
	});
	const handleHideColumn = (e) => {
		const { name, checked } = e.target;

		setTableColOptions({
			...tableColOptions,
			[name]: { ...tableColOptions[name], is_hide: checked },
		});
	};
	const emStatData = processedData.map((item, index) => ({
		id: index,
		company_name: item.company_name,
		company_address: item.company_address,
		company_tel: item.company_tel,
		resultScore: item.resultScore,
	}));
	const emStatColumns = useMemo(
		() => [
			{
				name: "id",
				selector: (row) => row.id,
				sortable: true,
				reorder: true,
				omit: true,
			},
			{
				name: <p className="mb-0">บริษัท/หน่วยงาน</p>,
				selector: (row) => row.company_name,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						{/* <Link to={`/employer/${row.employer_id}/profile`}>
							{row.company_name}
						</Link> */}
						<p className="my-1">{row.company_name}</p>
					</div>
				),
				omit: tableColOptions.company_name.is_hide,
			},
			{
				name: <p className="mb-0">ที่อยู่</p>,
				selector: (row) => row.company_address,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.company_address}</p>
					</div>
				),
				omit: tableColOptions.company_address.is_hide,
			},
			{
				name: "เบอร์ติดต่อ",
				selector: (row) => row.company_tel,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.company_tel}</p>
					</div>
				),
				omit: tableColOptions.company_tel.is_hide,
			},
			{
				name: <p className="mb-0">คะแนนจากเเบบประเมินเต็ม 5</p>,
				// name: "คะแนนจากเเบบประเมินเต็ม 5",
				selector: (row) => row.resultScore,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{generateStarIcons(row.resultScore)}</p>
					</div>
				),
				omit: tableColOptions.resultScore.is_hide,
			},
			// {
			// 	cell: (row) => (
			// 		<>
			// 			<button
			// 				className={`btn btn-sm btn-outline-secondary`}
			// 				onClick={null}
			// 			>
			// 				<FontAwesomeIcon icon={faEye} />
			// 			</button>
			// 		</>
			// 	),
			// 	ignoreRowClick: true,
			// 	omit: tableColOptions.actions.is_hide,
			// },
		],
		[tableColOptions]
	);

	// fow table selectableRows
	const [selectedRows, setSelectedRows] = useState([]);
	const [toggledClearRows, setToggleClearRows] = useState(false);

	const handleClearRows = () => {
		setSelectedRows([]);
		setToggleClearRows(!toggledClearRows);
	};

	const handleRowSelected = ({ allSelected, selectedCount, selectedRows }) => {
		const selectedRowData = selectedRows.map((item) => item.id);
		setSelectedRows(selectedRowData);
	};

	// for table search
	const [selectedSearchField, setSelectedSearchField] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const fieldsToSearch = ["company_name", "company_address", "company_tel"];
	const filteredData = emStatData.filter((item) => {
		if (selectedSearchField === "all") {
			return fieldsToSearch.some((field) =>
				item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
			);
		} else {
			return item[selectedSearchField]
				?.toLowerCase()
				.includes(searchQuery.trim().toLowerCase());
		}
	});

	const handleSearchFieldChange = (e) => {
		const value = e.target.value;
		setSelectedSearchField(value);
	};
	const handleSearchQuery = (e) => {
		setSearchQuery(e.target.value);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					import.meta.env.VITE_APP_API + "/listStdEval",
					{
						headers: {
							Authorization: `Bearer ${user.user.token}`,
						},
					}
				);
				const processedData = aggregateScores(response.data);
				setProcessedData(processedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [user.user.token]);

	const aggregateScores = (data) => {
		const scoresMap = new Map();
		const countMap = new Map();

		data.forEach((item) => {
			const {
				company_name,
				company_address,
				company_tel,
				apply_knowledge,
				assign_workload,
				benefit_intern,
				future_placement,
				guide_concern,
				prior_knowledge,
				org_coop,
				work_safety,
			} = item;
			const score =
				apply_knowledge +
				assign_workload +
				benefit_intern +
				future_placement +
				guide_concern +
				prior_knowledge +
				org_coop +
				work_safety;

			if (scoresMap.has(company_name)) {
				scoresMap.set(company_name, scoresMap.get(company_name) + score);
				countMap.set(company_name, countMap.get(company_name) + 1);
			} else {
				scoresMap.set(company_name, score);
				countMap.set(company_name, 1);
			}
		});

		const updatedData = Array.from(scoresMap.entries()).map(
			([company_name, score]) => {
				const resultScore = Math.min(
					5,
					(score / (countMap.get(company_name) * 32)) * 5
				);
				return {
					company_name,
					company_address:
						data.find((item) => item.company_name === company_name)
							?.company_address || "",
					company_tel:
						data.find((item) => item.company_name === company_name)
							?.company_tel || "",
					resultScore,
				};
			}
		);

		return updatedData;
	};

	// console.log(processedData);
	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">สถิติข้อมูลบริษัทฝึกงาน</h3>
			</div>

			<div className="searchBox">
				<label className="form-label fw-bold" htmlFor="selectFilter">
					ค้นหาโดย :
				</label>
				<div className="input-group input-group-sm mb-3">
					<select
						id="selectFilter"
						className="form-select"
						value={selectedSearchField}
						onChange={(e) => handleSearchFieldChange(e)}
					>
						<option value="all" label="ทั้งหมด">
							ทั้งหมด
						</option>
						{Object.entries(tableColOptions)
							.filter(([key]) => key !== "actions" && key !== "resultScore")
							.map(([key, val] = entry, index) => (
								<option key={index} value={key} label={val.label}>
									{val.label}
								</option>
							))}
					</select>

					<input
						type="search"
						className="form-control w-75"
						aria-label="Sizing example input"
						aria-describedby="inputGroup-sizing-sm"
						placeholder="ค้นหา..."
						value={searchQuery}
						onChange={(e) => handleSearchQuery(e)}
					/>
					<div className="mx-1">({filteredData.length})</div>
				</div>
			</div>

			<div className="tableToolbar row my-1 my-sm-auto">
				<div className="col">
					<div
						className="btn-toolbar"
						role="toolbar"
						aria-label="Toolbar with button groups"
					>
						<div className="dropdown">
							<button
								className="btn btn-sm btn-outline-secondary dropdown-toggle"
								type="button"
								data-bs-toggle="dropdown"
								data-bs-auto-close="outside"
								aria-expanded="false"
							>
								ตัวเลือกเพิ่มเติม
							</button>

							{selectedRows.length ? (
								<div className="btn-group mx-2" role="group">
									<div>
										<button
											className={`btn btn-sm btn-outline-dark me-2`}
											onClick={handleClearRows}
										>
											เลือกทั้งหมด <span>{selectedRows.length}</span>{" "}
											<FontAwesomeIcon
												icon={faXmark}
												className="text-secondary"
											/>
										</button>
									</div>
								</div>
							) : (
								<></>
							)}

							<div className="dropdown-menu">
								<div className="d-flex flex-column flex-sm-row">
									<div className="bg-light px-2">
										<label htmlFor="hideColumn">ซ่อนคอลัมน์</label>
										<ul id="hideColumn" className="list-unstyled text-nowrap">
											{Object.entries(tableColOptions).map(
												([key, val] = entry, index) => (
													<li key={index}>
														<div className="form-check form-check-inline">
															<input
																className="form-check-input"
																type="checkbox"
																name={key}
																id={`${index}_${key}`}
																checked={val.is_hide}
																onChange={(e) => handleHideColumn(e)}
															/>
															<label
																className="form-check-label"
																htmlFor={`${index}_${key}`}
															>
																{val.label}
															</label>
														</div>
													</li>
												)
											)}
										</ul>
									</div>
								</div>
							</div>
						</div>

						<div style={{ height: "2.5rem" }}></div>
					</div>
				</div>
			</div>

			<DataTable
				columns={emStatColumns}
				data={filteredData}
				customStyles={customStyles}
				defaultSortFieldId={1} // id maybe
				defaultSortAsc={false} // เรียงจากมากไปน้อย
				fixedHeader
				responsive
				pagination
				highlightOnHover
				selectableRows={false}
				selectableRowsHighlight
				onSelectedRowsChange={handleRowSelected}
				clearSelectedRows={toggledClearRows}
				noDataComponent={<NoTableData />}
			/>

			{/* <div className="table-responsive text-nowrap">
				<table className="table table-striped">
					<thead>
						<tr className="table-dark">
							<th scope="col">#</th>
							<th scope="col">บริษัท/หน่วยงาน</th>
							<th scope="col">ที่อยู่บริษัท</th>
							<th scope="col">tel</th>
							<th scope="col">คะแนนจากเเบบประเมินเต็ม 5</th>
						</tr>
					</thead>
					<tbody>
						{processedData.map((item, index) => (
							<tr key={index}>
								<th scope="row">{index + 1}</th>
								<td>{item.company_name}</td>
								<td>{item.company_address}</td>
								<td>{item.company_tel}</td>
								<td>{generateStarIcons(item.resultScore)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div> */}
		</div>
	);
}

export default StaticEm;
