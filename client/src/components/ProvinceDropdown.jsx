import React, { useState } from "react";

const ProvinceDropdown = () => {
	// List of provinces in Thailand
	const provinces = [
		"Bangkok",
		"Samut Prakan",
		"Nonthaburi",
		"Pathum Thani",
		"Phra Nakhon Si Ayutthaya",
		// Add more provinces as needed
	];

	const [selectedProvince, setSelectedProvince] = useState("");

	const handleProvinceChange = (e) => {
		setSelectedProvince(e.target.value);
	};

	return (
		<div className="mb-3">
			<div className="row">
				<div className="col">
					<label className="form-label" htmlFor="province">
						จังหวัด :
					</label>
					<select
						className="form-select"
						id="province"
						value={selectedProvince}
						onChange={handleProvinceChange}
					>
						<option value="">เลือกจังหวัด</option>
						{provinces.map((province) => (
							<option key={province} value={province}>
								{province}
							</option>
						))}
					</select>
				</div>

				<div className="col">
					<label className="form-label" htmlFor="distric">
						อำเภอ :
					</label>
					<select
						className="form-select"
						id="distric"
						value={selectedProvince}
						onChange={handleProvinceChange}
					>
						<option value="">เลือกอำเภอ</option>
						{provinces.map((province) => (
							<option key={province} value={province}>
								{province}
							</option>
						))}
					</select>
				</div>
			</div>

			{selectedProvince && <p>You selected: {selectedProvince}</p>}
		</div>
	);
};

export default ProvinceDropdown;
