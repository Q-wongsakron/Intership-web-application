import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";


const StdSeeDocs = () => {
	const [data,setData] = useState([])

	const [errors, setErrors] = useState({});

	const user = useSelector((state) => state.user);

    const loadData = async () => {
        try {
            const listDocsStdResponse = await axios.get("listDocumentStd")
            setData(listDocsStdResponse);
        } catch (error) {
            console.error(error);
            // Handle error appropriately, e.g., setErrors({ message: error.message });
        }
    };
    
    useEffect(() => {
        loadData();
    }, []);

 
	return (
        <div className="container p-3 p-md-4 container-card">
            <div className="d-flex justify-content-between mb-4">
                <h3 className="fw-bold">
                    รายงาน และ สไลด์นำเสนอ
                </h3>
            </div>

            <div className="table-responsive text-nowrap">
                <table className="table table-striped">
                    <thead>
                        <tr className="table-dark">
                            <th scope="col">#</th>
                            <th scope="col">รหัสนักศึกษา</th>
                            <th scope="col">รายงาน</th>
                            <th scope="col">สไลด์นำเสนอ</th>

                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.std_id}</td>
                                <td>{item.report_pdf}</td>
                                <td>{item.present_pdf}</td>
                                <td>    
                                    {generateStarIcons(item.resultScore)}
                                </td>
    
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
	);
};

export default StdSeeDocs;
