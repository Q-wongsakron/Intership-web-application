import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import moment from 'moment';

//ใช้วิธี set value ภายใน modal
function HeadDocs() {
  const [data, setData] = useState([]);
  const [dataConcat, setDataConcat] = useState([])
  const [selfData, setSelfData] = useState([]);
  const [allEditData, setAllEditData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsSelf, setSelectedItemsSelf] = useState([]);
  // set Modal State
  //   const [showPreDataModal, setShowPreDataModal] = useState(false);

  const [MultiCreateModal,setMultiCreateModal] = useState(false);
  const [MultiCreateSelfModal,setMultiCreateSelfModal] = useState(false);
  const [createSelfModal, setCreateSelfModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editShowModal, setEditShowModal] = useState(false);
  const [editPreDataModal, setEditPreDataModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [resMultiCreateModal, setResMultiCreateModal] = useState(false)
 // set Modal Data
  const [modalData, setModalData] = useState({}); // Store data for the modal fields
  const [editModalData, setEditModalData] = useState({std_id: "",}); // Store data for the edit
  const [editData, setEditData] = useState({
	number_courtesy: "",
	number_letter: "",
	date: "",
	name_to:""
  }); // Store data for featch Edit

  // use to Re Render
  const [shouldRerender, setShouldRerender] = useState(false);

  // view DOC
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [viewPdf, setViewPdf] = useState(null);

  const { user } = useSelector((state) => ({ ...state }));

  let found = false; // Flag variable to track if the condition is met
  let found_check = false;

  // Memoized selector function
  const memoizedUserToken = useMemo(() => user.user.token, [user.user.token]);

  const currentDate = new Date();
  const mappedData = data.map((item, index) => ({
	"std_id": item.student.std_id,
	"company_name": item.employer.company_name,
	"displayname_th": item.student.displayname_th,
	"email": item.student.email,
	"tel": item.student.tel,
	"date_gen_doc": formatDate(item.date_gen_doc),
	"require_doc": item.require_doc,
	"status": item.status
  }));
  const mappedDataSelf = selfData.map((item, index) => ({
	"std_id": item.std_id,
	"company_name": item.company_name,
	"displayname_th": item.displayname_th,
	"email": item.email,
	"tel": item.tel,
	"date_gen_doc": formatDate(item.date_gen_doc),
	"require_doc": item.require_doc,
	"status": item.status
  }));
  
  function formatDate(dateString) {
	const date = new Date(dateString);
	const formattedDate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
	return formattedDate;
  }
   const concatDataFinalShow = mappedData.concat(mappedDataSelf)
  
  // Function to convert Arabic numerals to Thai numerals
  const convertToThaiNumerals = (number) => {
    const thaiNumerals = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
    return number.toString().replace(/\d/g, (digit) => thaiNumerals[digit]);
  };
  const thaiMonths = [
	'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
	'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const  monthIndex = (inputDate) => 
  {
	const monthI = moment(inputDate, 'DD/M/YYYY').format('M') - 1

	const convertedMonth = thaiMonths[monthI];
	return convertedMonth
 }; 
  // Format date with Thai numerals
  const formattedDate = `${convertToThaiNumerals(currentDate.getDate())}  ${monthIndex(
    currentDate.getMonth() + 1
  )}  ${convertToThaiNumerals(currentDate.getFullYear() +543)}`;



  const renderToolbar = (Toolbar) => (
	<>
		<Toolbar />
		<div
			style={{
				borderTop: "1px solid rgba(0, 0, 0, 0.1)",
				marginTop: "4px",
				padding: "4px",
			}}
		></div>
	</>
);

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
	renderToolbar,
});

useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5500/api/manageDocument",
          {
            headers: {
              authtoken: memoizedUserToken,
            },
          }
        );

        const allSelfEnroll = await axios.get(
          "http://localhost:5500/api/allSelfEnroll",
          {
            headers: {
              authtoken: memoizedUserToken,
            },
          }
        );

        const allEdit = await axios.get("http://localhost:5500/api/showAllEditCourtesy")


		const payloadGenSuccres = {in_system:response.data}
        setAllEditData(allEdit.data);
        setSelfData(allSelfEnroll.data);
		// setDataConcat(response.data.concat(selfData));

		
        setData(response.data);
		
		data.map((item,index)=>{
			let payload = { "std_id": item.student.std_id,
			"company_name": item.employer.company_name,
			"displayname_th":item.student.displayname_th,
			"email":item.student.email,
			"tel":item.student.tel,
		   "require_doc":item.require_doc,

		   };
		   dataConcat.push(payload);

		})
		
		

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

	console.log(dataConcat)
	
    fetchData();
  }, [memoizedUserToken,shouldRerender]); // Only re-run effect if memoizedUserToken changes


  // pre Create Data and edit if haved data
  const handlePreCreateClick = ( std_id, name_to,formattedDate) => {
	try{
		// if ถ้า edit data base ไม่เป็น [] else ใช้กัน []
		if ( allEditData.length) {
			// หาตำเเหน่งที่ข้อมูลที่กดเข้ามาตรงกับข้อมูลที่เคยกรอกไหม ถ้าไม่มีจึงสร้างใหม่
			allEditData.map((item, i) => {
				if (item.std_id === std_id)
				{	
					console.log(item.std_id)
					// เพิ่ม modal เเต่ state ไม่น่าจำเป็น
					setEditData(
					{
					std_id: item.std_id || "",
					number_courtesy: item.number_courtesy || "",
					number_letter: item.number_letter || "",
					date: item.date || "",
					name_to: item.name_to || "", 
					  });
					setEditPreDataModal(true);
					found = true;
					console.log("1")
				}
			
				}
			)
			if (!found){
				{
					console.log("2")
					setModalData({std_id: std_id, name_to:name_to,date: formattedDate});
					setShowModal(true);	
				}
			}
			// for(let i = 0 ; i < allEditData.length ; i++) {
			// 	if (allEditData[i].std_id === std_id)
			// 	{	
			// 		console.log(allEditData[i].std_id)
			// 		// เพิ่ม modal เเต่ state ไม่น่าจำเป็น
			// 		setEditData(
			// 		{
			// 		std_id: allEditData[i].std_id || "",
			// 		number: allEditData[i].number || "",
			// 		date: allEditData[i].date || "",
			// 		name_to: allEditData[i].name_to || "", 
			// 		  });
			// 		setEditPreDataModal(true);
					
					
			// 	}
			// 	else
			// 	{
				
			// 		setModalData({std_id: std_id,employer_id:employer_id, name_to:name_to,date: formattedDate});
			// 		setShowModal(true);	
			// 	}
			// }
		}else{
			setModalData({std_id: std_id, name_to:name_to,date: formattedDate});
			setShowModal(true);	
			
		}
	}catch( error){
		console.error(error)
	}
	
	
  };
	// final create DOC
  const handleCreateClick = (std_id,employer_id) => {
    try{
		if ( allEditData.length) 
		{
			// หาตำเเหน่งที่ข้อมูลที่กดเข้ามาตรงกับข้อมูลที่เคยกรอกไหม ถ้าไม่มีจึงสร้างใหม่
			for(let i = 0 ; i < allEditData.length ; i++) {
				if (allEditData[i].std_id === std_id)
				{	
					// เพิ่ม modal เเต่ state ไม่น่าจำเป็น
					setEditData(
					{
					std_id: allEditData[i].std_id || "",
					employer_id: employer_id || "",
					number_courtesy: allEditData[i].number_courtesy || "",
					number_letter: allEditData[i].number_letter || "",
					date: allEditData[i].date || "",
					name_to: allEditData[i].name_to || "", 
					  });

					setCreateModal(true);
					
					
				}
				else
				{
					// ค่อยลบ
					null
					// console.log(allEditData[i].std_id)
					// setModalData({std_id: std_id,employer_id:employer_id, name_to:name_to,date: formattedDate});
					// setShowModal(true);	
				}
			}
		}else{
			// ค่อยลบ
			null
			// setModalData({std_id: std_id,employer_id:employer_id, name_to:name_to,date: formattedDate});
			// setShowModal(true);	
		}
	}
	catch( error)
	{
		console.error(error)
	}
  };


  // ผิดอยู่ self enroll ต้องเขียนเเยกใช้ api อีกตัว ใช้ self_id เเทน employer_id เเละดึงค่าจาก self_id มาใช้ จากนั้นบันทึกลงใน edit DOC 
  const handleCreateSelfClick = ( std_id, self_enroll_id) => {
		try{
			if ( allEditData.length) 
			{
				// หาตำเเหน่งที่ข้อมูลที่กดเข้ามาตรงกับข้อมูลที่เคยกรอกไหม ถ้าไม่มีจึงสร้างใหม่
				for(let i = 0 ; i < allEditData.length ; i++) {
					if (allEditData[i].std_id === std_id)
					{	
						// เพิ่ม modal เเต่ state ไม่น่าจำเป็น
						setEditData(
						{
						std_id: allEditData[i].std_id || "",
						self_enroll_id: self_enroll_id || "",
						number_courtesy: allEditData[i].number_courtesy || "",
						number_letter: allEditData[i].number_letter || "",
						date: allEditData[i].date || "",
						name_to: allEditData[i].name_to || "", 
						  });
	
						setCreateSelfModal(true);
						
						
					}
					else
					{
						// ค่อยลบ
						null
						// console.log(allEditData[i].std_id)
						// setModalData({std_id: std_id,employer_id:employer_id, name_to:name_to,date: formattedDate});
						// setShowModal(true);	
					}
				}
			}else{
				// ค่อยลบ
				null
				// setModalData({std_id: std_id,employer_id:employer_id, name_to:name_to,date: formattedDate});
				// setShowModal(true);	
			}
		}
		catch( error)
		{
			console.error(error)
		}
	  
 
  };

  // edit Data after Create
  const handleEditClick = (std_id) => {
    setEditModalData({std_id: std_id});
	showData(std_id)
  };


  const handleModalClose = () => {
    setShowModal(false);
	setEditShowModal(false);
	setEditPreDataModal(false);
	setCreateModal(false);
	setCreateSelfModal(false);
	setMultiCreateModal(false);
	setMultiCreateSelfModal(false);
	setResMultiCreateModal(false);
  };

  // create pre courtesy data in Modal
  const handlePreCreate = async () => {
	const preCreate =  await axios.post("http://localhost:5500/api/preCreateCourtesy",
		{
			std_id: modalData.std_id,
			number_courtesy: modalData.number_courtesy,
			number_letter: modalData.number_letter,
			date: modalData.date,
			name_to: modalData.name_to,
		}
		
	)
	setShowModal(false);
	setShouldRerender(prevState => !prevState);
  }
 // use in Modal for fix DOC after used to create
 const handleEditPreModalSave = async() => {
	const editPreCreate  = await axios.put("http://localhost:5500/api/editPreCreateCourtesy",{
		std_id: editData.std_id,
		number_courtesy: editData.number_courtesy,
		number_letter: editData.number_letter,
		date: editData.date,
		name_to: editData.name_to,
	},)

	
	setEditPreDataModal(false);
	setShouldRerender(prevState => !prevState);
	
  }
  // use in Modal for create DOC Final **
  const handleCreateDocSave =  async () => {
   
	const  createDoc = await axios.post(`http://localhost:5500/api/genPdf`,{
		std_id: editData.std_id,
		employer_id: editData.employer_id,
		number_courtesy: editData.number_courtesy,
		number_letter: editData.number_letter,
		date: editData.date,
		name_to: editData.name_to,
	})
	
    setCreateModal(false);
	setShouldRerender(prevState => !prevState); // Trigger a re-render
  };
    // use in Modal for create DOC Self Final **
   const handleCreateDocSelfSave =  async () => {
   
		const  createDoc = await axios.post(`http://localhost:5500/api/genPdfSelf`,{
			std_id: editData.std_id,
			self_enroll_id: editData.self_enroll_id,
			number_courtesy: editData.number_courtesy,
			number_letter: editData.number_letter,
			date: editData.date,
			name_to: editData.name_to,
		})
		
		setCreateSelfModal(false);
		setShouldRerender(prevState => !prevState); // Trigger a re-render
	  };


 // use in Modal for fix DOC after used to create
  const handleEditModalSave = async() => {
	const editDoc = await axios.put("http://localhost:5500/api/editCourtesy",{
		std_id: editModalData.std_id,
		number_courtesy: editData.number_courtesy,
		number_letter: editData.number_letter,
		date: editData.date,
		name_to: editData.name_to,
	})
	setEditShowModal(false);
	setShouldRerender(prevState => !prevState);
	
  }

  // fetch Data from edit DOC that created
  const showData = async (std_id) => {
	try {
	  if (!std_id) {
		console.error("Error: No std_id available for editing.");
		return;
	  }
  
	  const response = await axios.get(
		`http://localhost:5500/api/showEditCourtesy/${std_id}`
	  );
  
	  
  
	  setEditData({
		number_courtesy: response.data.number_courtesy || "",
		number_letter: response.data.number_letter || "",
		date: response.data.date || "",
		name_to: response.data.name_to || "", 
	  });
  
	  setEditShowModal(true);
	} catch (error) {
	  console.error("Error fetching edit data:", error);
	}
  };

   // fetch Data from Gened DOC normal 
   const handleViewCourtesy = async (std_id) => {
		try {
			const response = await axios.get(
				`http://localhost:5500/api/getGenDoc/${std_id}`,
				{}
			);
			if(!response.data){
				const selfDoc = await axios.get(`http://localhost:5500/api/getGenDocSelf/${std_id}`,
				{});
				setViewPdf(`http://localhost:5500/uploads/${selfDoc.data.doc_nonlicense}`);
				setShowResumeModal(true);
			}else{
				setViewPdf(`http://localhost:5500/uploads/${response.data.doc_nonlicense}`);
				setShowResumeModal(true);
			}

		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	// fetch Data from Gened DOC with license
	const handleViewCourtesyLic = async (std_id) => {
		try {
			const response = await axios.get(
				`http://localhost:5500/api/getGenDoc/${std_id}`,
				{}
			);
			if(!response.data){
				const selfDoc = await axios.get(`http://localhost:5500/api/getGenDocSelf/${std_id}`,
				{});
				setViewPdf(`http://localhost:5500/uploads/${selfDoc.data.courtesy_license}`);
				setShowResumeModal(true);
			}else{
				setViewPdf(`http://localhost:5500/uploads/${response.data.courtesy_license}`);
				setShowResumeModal(true);
			}
			

		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

    // fetch Data from Gened DOC with Letter มาทำเพิ่ม
	const handleViewLetter = async (std_id) => {
		try {

			const response = await axios.get(
				`http://localhost:5500/api/getGenDoc/${std_id}`,
				{}
			);
			if(!response.data){
				const selfDoc = await axios.get(`http://localhost:5500/api/getGenDocSelf/${std_id}`,
				{});
				setViewPdf(`http://localhost:5500/uploads/${selfDoc.data.intern_letter}`);
				setShowResumeModal(true);
			}else{
				setViewPdf(`http://localhost:5500/uploads/${response.data.intern_letter}`);
				setShowResumeModal(true);
			}

		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	// const handleCheckboxChange = (std_id,employer_id,number,date,name_to, checked) => {
    //     setSelectedItems(prevState => ({
    //         ...prevState,
	// 		[std_id]: std_id,
	// 		[employer_id]: employer_id,
	// 		[number]: number,
    //         [date]: date,
    //         [name_to]: name_to,

    //     }));
    // };
	const handleCheckboxChange = (index, std_id, employer_id, number_courtesy, number_letter, date, name_to, checked) => {
		setSelectedItems(prevState => {
			const newSelectedItems = [...prevState];
			const payload = { "std_id": std_id, "employer_id": employer_id, "number_courtesy": number_courtesy, "number_letter":number_letter, "date": date, "name_to": name_to, "checked": checked };
			if (checked) {
				// If checkbox is checked, add the payload to selectedItems
				newSelectedItems.push(payload);
			} else {
				// If checkbox is unchecked, remove the payload from selectedItems
				const itemIndex = newSelectedItems.findIndex(item => item.std_id === std_id && item.employer_id === employer_id);
				if (itemIndex !== -1) {
					newSelectedItems.splice(itemIndex, 1);
				}
			}
			return newSelectedItems;
		});
	};
	const handleCheckboxChangeSelf = (index, std_id, self_enroll_id, number_courtesy, number_letter,date, name_to, checked) => {
		setSelectedItemsSelf(prevState => {
			const newSelectedItems = [...prevState];
			const payload = { "std_id": std_id, "self_enroll_id": self_enroll_id, "number_courtesy": number_courtesy, "number_letter":number_letter, "date": date, "name_to": name_to, "checked": checked };
			if (checked) {
				// If checkbox is checked, add the payload to selectedItems
				newSelectedItems.push(payload);
			} else {
				// If checkbox is unchecked, remove the payload from selectedItems
				const itemIndex = newSelectedItems.findIndex(item => item.std_id === std_id && item.self_enroll_id === self_enroll_id);
				if (itemIndex !== -1) {
					newSelectedItems.splice(itemIndex, 1);
				}
			}
			return newSelectedItems;
		});
	};

	const handleShowMultiCreateModal = () =>{
		setMultiCreateModal(true);
	}
	const handleShowMultiCreateSelfModal = () =>{
		setMultiCreateSelfModal(true);
	}

	const handleMultiCreateDoc = async () => {
		try {
			// const response = await axios.post("http://localhost:5500/api/genMultiCourtesy", { selectedItems });
			
			// // Handle the response data as needed
			// console.log("Response from server:", response.data);
			if(!selectedItems.length == 0){
				
				setMultiCreateModal(false);
				const response = await axios.post("http://localhost:5500/api/genMultiCourtesy", { selectedItems });
				console.log("Response from server:", response.data);
				setShouldRerender(prevState => !prevState); // Trigger a re-render
			}else{
				
				setMultiCreateModal(false);
				setResMultiCreateModal(true);
                setShouldRerender(prevState =>!prevState); // Trigger a re-render
			}
			
		} catch (error) {
			console.error("Error:", error);
			setMultiCreateModal(false);
		}
	}

	const handleMultiCreateDocSelf = async () => {
		try {
			
		
			// Handle the response data as needed
			if(!selectedItemsSelf.length == 0){
				
				setMultiCreateSelfModal(false);
				const response = await axios.post("http://localhost:5500/api/genMultiCourtesySelf", { selectedItemsSelf });
				console.log("Response from server:", response.data);
				setShouldRerender(prevState => !prevState); // Trigger a re-render
			}else{
				
				setMultiCreateSelfModal(false);      
				setResMultiCreateModal(true);
                setShouldRerender(prevState =>!prevState); // Trigger a re-render
			}

			
		} catch (error) {
			console.error("Error:", error);
			setMultiCreateSelfModal(false);
		}
	}

	
	console.log(selectedItems)
	console.log(selectedItemsSelf)
	return (
		<>
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">
					อนุมัติเอกสารขอความอนุเคราะห์ 
				</h3>
			</div>

			<div className="table-responsive text-nowrap">
				<table className="table table-striped">
					<thead>
						<tr className="table-dark">
							<th scope="col">#</th>
							<th scope="col">ชื่อ-นามสกุล</th>
							<th scope="col">เลขทะเบียน</th>
							<th scope="col">อีเมล</th>
							<th scope="col">เบอร์โทร</th>
							<th scope="col">บริษัท/หน่วยงาน</th>
							<th scope="col">เอกสารฉบับจริง</th>
							<th scope="col">เลือกสร้างเอกสาร</th>
							<th scope="col">ACTION</th>
						</tr>
					</thead>
					<tbody>
					{data
						.filter(item => item.status === "รอดำเนินเอกสาร")
						.map((filteredData, index) => (
						<tr key={index}>
							<th scope="row">{index + 1}</th>
							<td>{`${filteredData.student.displayname_th} `}</td>
							<td>{filteredData.student.std_id}</td>
							<td>{filteredData.student.email}</td>
							<td>{filteredData.student.tel}</td>
							<td>{filteredData.employer.company_name}</td>
							<td>
								{ filteredData.require_doc == 1 ? <p style={{ color: 'red' }}>ต้องการ</p> : <p> - </p>}
							</td>
							<th>
								
								{
								allEditData.length != 0 ?
								!allEditData.some(item => item.std_id === filteredData.student.std_id) ? (
									<p>กรุณาตั้งค่าเอกสาร</p>
								) : (
									allEditData.map((item, i) => (
										item.std_id === filteredData.student.std_id ? (
											<input
												type="checkbox"
												checked={selectedItems[filteredData.student.std_id]}
												onChange={(e) => handleCheckboxChange(
													i,
													filteredData.student.std_id,
													filteredData.employer.employer_id,
													item.number_courtesy,
													item.number_letter,
													item.date,
													item.name_to, 
													e.target.checked)}
											/>
										) : null
									))
								): <p>กรุณาตั้งค่าเอกสาร</p>}
							</th>
							<td>
							<Link to={"#"}>
								<button type="button" className={`btn btn-secondary m-1`}>
								<FontAwesomeIcon icon={faEye} />
								</button>
							</Link>
							{ allEditData.length == 0 ? 
							
							(
								// case no data in edit before
								<button 
								type="button"
								className={`btn btn-success m-1`}
								onClick={() => handlePreCreateClick(filteredData.student.std_id, filteredData.posts_job.name_to, formattedDate)}
								>
									<FontAwesomeIcon icon={faPenToSquare} />
								</button>
							): 
									// case used to create edit data and equal std_id
									!allEditData.some(item => item.std_id === filteredData.student.std_id) ? (
										(
											// case not equal std_id in edit data base
											<button
												type="button"
												className={`btn btn-success m-1`}
												onClick={() => handlePreCreateClick(filteredData.student.std_id, filteredData.posts_job.name_to, formattedDate)}
											>
												<FontAwesomeIcon icon={faPenToSquare} />
											</button>
										)
									) :
									(allEditData.map((item, i) => (
										item.std_id === filteredData.student.std_id ? (
											<div className="btn-group" role="group" key={i}>
											<button key={`editButton_${i}`}
												type="button"
												className={`btn btn-success m-1`}
												onClick={() => handlePreCreateClick(filteredData.student.std_id, filteredData.posts_job.name_to, formattedDate)}
											>
												<FontAwesomeIcon icon={faPenToSquare} />
											</button>
											<button key={`deleteButton_${i}`}
												type="button"
												className={`btn btn-danger m-1`}
												onClick={() => handleCreateClick(filteredData.student.std_id, filteredData.employer.employer_id)}
											>
												<FontAwesomeIcon icon={faPenToSquare} />
											</button>
											</div>
											
											
											
										) : null
									)))}
							
							
							</td>
						</tr>
						))}
					</tbody>
				</table>
			</div>
			
     {/* Modal create data */}
	 <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
		<Modal.Body>
		<Form>
			{/* Add more input fields as needed */}
			<Form.Group controlId="formNumber">
			<Form.Label>เลขที่เอกสารขอความอนุเคราะห์</Form.Label><span className="text-danger">*</span>
			<Form.Control
				type="text"
				placeholder="๓๓"
			
				//set state ภายใน
				value={modalData.number_courtesy || ""}
				onChange={(e) => setModalData({
				...modalData,
				number_courtesy: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formNumber">
			<Form.Label>เลขที่เอกสารหนังสือส่งตัว</Form.Label><span className="text-danger">*</span>
			<Form.Control
				type="text"
				placeholder="๔๔"
			
				//set state ภายใน
				value={modalData.number_letter || ""}
				onChange={(e) => setModalData({
				...modalData,
				number_letter: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formDate">
			<Form.Label>วันที่ออกเอกสาร</Form.Label>
			<Form.Control
				type="text"
				placeholder="๓ สิงหาคม ๒๕๖๗"
				value={modalData.date || formattedDate}
				onChange={(e) => setModalData({
				...modalData,
				date: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formTo">
			<Form.Label>เรียน</Form.Label>
			<Form.Control
				type="text"
				placeholder="รองศาสตราจารย์ xxx   xxxxx"
				value={modalData.name_to || ""}
				onChange={(e) => setModalData({
				...modalData,
				name_to: e.target.value
				})}
			/>
			</Form.Group>
		</Form>
		</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePreCreate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

	{/*Modal Edit Pre Data after create */}
	<Modal show={editPreDataModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pre Data After Create</Modal.Title>
        </Modal.Header>
		<Modal.Body>
		<Form>
			{/* Add more input fields as needed */}
			<Form.Group controlId="formNumber">
			<Form.Label>เลขที่เอกสารขอความอนุเคราะห์</Form.Label><span className="text-danger">*</span>
			<Form.Control
				type="text"
				placeholder="Enter number courtesy"
				required  //ไม่เห็นได้
				//set state ภายใน
				value={editData.number_courtesy}
				onChange={(e) => setEditData({
				...editData,
				number_courtesy: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formNumber">
			<Form.Label>เลขที่เอกสารหนังสือส่งตัว</Form.Label><span className="text-danger">*</span>
			<Form.Control
				type="text"
				placeholder="๔๔"
			
				//set state ภายใน
				value={editData.number_letter || ""}
				onChange={(e) => setEditData({
				...editData,
				number_letter: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formDate">
			<Form.Label>วันที่ออกเอกสาร</Form.Label>
			<Form.Control
				type="text"
				value={editData.date}
				onChange={(e) => setEditData({
				...editData,
				date: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formTo">
			<Form.Label>เรียน</Form.Label>
			<Form.Control
				type="text"
				placeholder="Enter 'name_to'"
				value={editData.name_to}
				onChange={(e) => setEditData({
				...editData,
				name_to: e.target.value
				})}
			/>
			</Form.Group>
		</Form>
		</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditPreModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

	  	{/*Modal final create DOC  เอา field input ออกไม่ให้กรอก*/}
	 <Modal show={createModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Document</Modal.Title>
        </Modal.Header>
		<Modal.Body>
		<Form>
			{/* Add more input fields as needed */}
			<Form.Group controlId="formNumber">
			<Form.Label>เลขที่เอกสารขอความอนุเคราะห์</Form.Label><span className="text-danger">*</span>
			<Form.Control
				type="text"
				placeholder="Enter number courtesy"
				required  //ไม่เห็นได้
				//set state ภายใน
				value={editData.number_courtesy}
				onChange={(e) => setEditData({
				...editData,
				number_courtesy: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formNumber">
			<Form.Label>เลขที่เอกสารหนังสือส่งตัว</Form.Label><span className="text-danger">*</span>
			<Form.Control
				type="text"
				placeholder="๔๔"
			
				//set state ภายใน
				value={editData.number_letter || ""}
				onChange={(e) => setEditData({
				...editData,
				number_letter: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formDate">
			<Form.Label>วันที่ออกเอกสาร</Form.Label>
			<Form.Control
				type="text"
				value={editData.date}
				onChange={(e) => setEditData({
				...editData,
				date: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formTo">
			<Form.Label>เรียน</Form.Label>
			<Form.Control
				type="text"
				placeholder="Enter 'name_to'"
				value={editData.name_to}
				onChange={(e) => setEditData({
				...editData,
				name_to: e.target.value
				})}
			/>
			</Form.Group>
		</Form>
		</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateDocSave}>
            Create Document
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
	
	<button type="button" className={`btn btn-secondary m-1`} onClick={handleShowMultiCreateModal}>
							สร้างเอกสาร
	</button>
	
	<Modal show={MultiCreateModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Multi Document</Modal.Title>
        </Modal.Header>
		<Modal.Body>
				คุณยืนยันที่จะสร้างเอกสารให้กับรายชื่อที่เลือก
		</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleMultiCreateDoc}>
            Create Multi Document
          </Button>
        </Modal.Footer>
      </Modal>
	  <Modal show={resMultiCreateModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Multi Document</Modal.Title>
        </Modal.Header>
		<Modal.Body>
				กรุณาคลิก กล่องสี่เหลี่ยม เพื่อเลือกรายชื่อที่ต้องการสร้างเอกสาร
		</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
	<br/>


	{/* self enroll */}
	<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">
					อนุมัติเอกสารขอความอนุเคราะห์ จากผู้ยื่นขอฝึกงานนอกระบบ
				</h3>
			</div>

			<div className="table-responsive text-nowrap">
				<table className="table table-striped">
					<thead>
						<tr className="table-dark">
							<th scope="col">#</th>
							<th scope="col">ชื่อ-นามสกุล</th>
							<th scope="col">เลขทะเบียน</th>
							<th scope="col">อีเมล</th>
							<th scope="col">เบอร์โทร</th>
							<th scope="col">บริษัท/หน่วยงาน</th>
							<th scope="col">เอกสารฉบับจริง</th>
							<th scope="col">เลือกสร้างเอกสาร</th>
							<th scope="col">ACTION</th>
						</tr>
					</thead>
					<tbody>
					{selfData
						.filter(item => item.status === "รอดำเนินเอกสาร")
						.map((filteredData, index) => (
						<tr key={index}> 
							<th scope="row">{index + 1}</th>
							<td>{`${filteredData.displayname_th} `}</td>
							<td>{filteredData.std_id}</td>
							<td>{filteredData.email}</td>
							<td>{filteredData.tel}</td>
							<td>{filteredData.company_name}</td>
							<td>
								{ filteredData.require_doc == 1 ? <p style={{ color: 'red' }}>ต้องการ</p> : <p> - </p>}
							</td>
							<th>
								
								{
								allEditData.length != 0 ?
								!allEditData.some(item => item.std_id === filteredData.std_id) ? (
									<p>กรุณาตั้งค่าเอกสาร</p>
								) : (
									allEditData.map((item, i) => (
										item.std_id === filteredData.std_id ? (
											<input
												type="checkbox"
												checked={selectedItems[filteredData.std_id]}
												onChange={(e) => handleCheckboxChangeSelf(
													i,
													filteredData.std_id,
													filteredData.self_enroll_id,
													item.number_courtesy,
													item.number_letter,
													item.date,
													item.name_to, 
													e.target.checked)}
											/>
										) : null
									))
								): <p>กรุณาตั้งค่าเอกสาร</p>}
							</th>
							<td>
							<Link to={"#"}>
								<button type="button" className={`btn btn-secondary m-1`}>
								<FontAwesomeIcon icon={faEye} />
								</button>
							</Link>
							
							{ allEditData.length == 0 ? 
							
							(
								// case no data in edit before
								<button 
								type="button"
								className={`btn btn-success m-1`}
								onClick={() => handlePreCreateClick(filteredData.std_id, filteredData.to_who, formattedDate)}
								>
									<FontAwesomeIcon icon={faPenToSquare} />
								</button>
							): 
									// case used to create edit data and equal std_id
									!allEditData.some(item => item.std_id === filteredData.std_id) ? (
										(
											// case not equal std_id in edit data base
											<button
												type="button"
												className={`btn btn-success m-1`}
												onClick={() => handlePreCreateClick(filteredData.std_id, filteredData.to_who, formattedDate)}
											>
												<FontAwesomeIcon icon={faPenToSquare} />
											</button>
										)
									) :
									(allEditData.map((item, i) => (
										item.std_id === filteredData.std_id ? (
											<div className="btn-group" role="group" key={i}>
											<button key={`editButton_${i}`}
												type="button"
												className={`btn btn-success m-1`}
												onClick={() => handlePreCreateClick(filteredData.std_id, filteredData.to_who, formattedDate)}
											>
												<FontAwesomeIcon icon={faPenToSquare} />
											</button>
											<button key={`deleteButton_${i}`}
												type="button"
												className={`btn btn-danger m-1`}
												onClick={() => handleCreateSelfClick(filteredData.std_id, filteredData.self_enroll_id)}
											>
												<FontAwesomeIcon icon={faPenToSquare} />
											</button>
											</div>
											
											
											
										) : null
									)))}
							</td>
						</tr>
						))}
					</tbody>
				</table>
			</div>
     {/* self enroll Modal */}
	 <Modal show={createSelfModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Document</Modal.Title>
        </Modal.Header>
		<Modal.Body>
		<Form>
			{/* Add more input fields as needed */}
			<Form.Group controlId="formNumber">
			<Form.Label>เลขที่เอกสารขอความอนุเคราะห์</Form.Label><span className="text-danger">*</span>
			<Form.Control
				type="text"
				placeholder="Enter number courtesy"
				required  //ไม่เห็นได้
				//set state ภายใน
				value={editData.number_courtesy}
				onChange={(e) => setEditData({
				...editData,
				number_courtesy: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formNumber">
			<Form.Label>เลขที่เอกสารหนังสือส่งตัว</Form.Label><span className="text-danger">*</span>
			<Form.Control
				type="text"
				placeholder="๔๔"
			
				//set state ภายใน
				value={editData.number_letter || ""}
				onChange={(e) => setEditData({
				...editData,
				number_letter: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formDate">
			<Form.Label>วันที่ออกเอกสาร</Form.Label>
			<Form.Control
				type="text"
				value={editData.date}
				onChange={(e) => setEditData({
				...editData,
				date: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formTo">
			<Form.Label>เรียน</Form.Label>
			<Form.Control
				type="text"
				placeholder="Enter 'name_to'"
				value={editData.name_to}
				onChange={(e) => setEditData({
				...editData,
				name_to: e.target.value
				})}
			/>
			</Form.Group>
		</Form>
		</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateDocSelfSave}>
            Create Document
          </Button>
        </Modal.Footer>
      </Modal>

	  
  
    </div>
	<button type="button" className={`btn btn-secondary m-1`} onClick={handleShowMultiCreateSelfModal}>
							สร้างเอกสาร
	</button>
	
	<Modal show={MultiCreateSelfModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Multi Document</Modal.Title>
        </Modal.Header>
		<Modal.Body>
				คุณยืนยันที่จะสร้างเอกสารให้กับรายชื่อที่เลือก
		</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleMultiCreateDocSelf}>
            Create Multi Document
          </Button>
        </Modal.Footer>
      </Modal>
	<br/>
	
	{/* part created Doc then edit doc*/}
	<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">
					เอกสารที่อนุมัติเรียบร้อยเเล้ว
				</h3>
			</div>

			<div className="table-responsive text-nowrap">
				<table className="table table-striped">
					<thead>
						<tr className="table-dark">
							<th scope="col">#</th>
							<th scope="col">ชื่อ-นามสกุล</th>
							<th scope="col">เลขทะเบียน</th>
							<th scope="col">อีเมล</th>
							<th scope="col">เบอร์โทร</th>
							<th scope="col">บริษัท/หน่วยงาน</th>
							<th scope="col">วันที่ออกเอกสาร</th>
							<th scope="col">เอกสารฉบับจริง</th>
							<th scope="col">เอกสาร</th>
							
							<th scope="col">ACTION</th>
						</tr>
					</thead>
					<tbody>
					{concatDataFinalShow
						.filter(item => item.status === "ดำเนินเอกสารเสร็จสิ้น")
						.map((filteredData, index) => (
						<tr key={index}>
							<th scope="row">{index + 1}</th>
							<td>{`${filteredData.displayname_th} `}</td>
							<td>{filteredData.std_id}</td>
							<td>{filteredData.email}</td>
							<td>{filteredData.tel}</td>
							<td>{filteredData.company_name}</td>
							<td>{filteredData.date_gen_doc}</td>
							<td>
								{ filteredData.require_doc == 1 ? <p style={{ color: 'red' }}>ต้องการ</p> : <p> - </p>}
							</td>
							<td><Link to={"#"}>
								<button type="button" className={`btn btn-secondary m-1`} onClick={() => handleViewCourtesy(filteredData.std_id)}>
								<FontAwesomeIcon icon={faEye} />
								</button>
								<Link to={"#"}>
								<button type="button" className={`btn btn-secondary m-1`} onClick={() => handleViewCourtesyLic(filteredData.std_id)}>
								<FontAwesomeIcon icon={faEye} />
								</button>
							</Link>
							<Link to={"#"}>
								<button type="button" className={`btn btn-secondary m-1`} onClick={() => handleViewLetter(filteredData.std_id)}>
								<FontAwesomeIcon icon={faEye} />
								</button>
							</Link>
							</Link></td>
							<td>
							

							<button
								type="button"
								className={`btn btn-success m-1`}
								onClick = {()=> {handleEditClick(filteredData.std_id)}}
								
							>
								<FontAwesomeIcon icon={faPenToSquare} />
							</button>
							</td>
						</tr>
						))}
					</tbody>
				</table>
			</div>

	{/*Modal Edit When Complete */}
	 <Modal show={editShowModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
		<Modal.Body>
		<Form>
			{/* Add more input fields as needed */}
			<Form.Group controlId="formNumber">
			<Form.Label>เลขที่เอกสารขอความอนุเคราะห์</Form.Label><span className="text-danger">*</span>
			<Form.Control
				type="text"
				placeholder="Enter number courtesy"
				required  //ไม่เห็นได้
				//set state ภายใน
				value={editData.number_courtesy}
				onChange={(e) => setEditData({
				...editData,
				number_courtesy: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formNumber">
			<Form.Label>เลขที่เอกสารหนังสือส่งตัว</Form.Label><span className="text-danger">*</span>
			<Form.Control
				type="text"
				placeholder="๔๔"
			
				//set state ภายใน
				value={editData.number_letter || ""}
				onChange={(e) => setEditData({
				...editData,
				number_letter: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formDate">
			<Form.Label>วันที่ออกเอกสาร</Form.Label>
			<Form.Control
				type="text"
				value={editData.date}
				onChange={(e) => setEditData({
				...editData,
				date: e.target.value
				})}
			/>
			</Form.Group>

			<Form.Group controlId="formTo">
			<Form.Label>เรียน</Form.Label>
			<Form.Control
				type="text"
				placeholder="Enter 'name_to'"
				value={editData.name_to}
				onChange={(e) => setEditData({
				...editData,
				name_to: e.target.value
				})}
			/>
			</Form.Group>
		</Form>
		</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

	  {/* Modal show preview DOC */}
	  <Modal
				show={showResumeModal}
				onHide={() => setShowResumeModal(false)}
				centered
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>Courtesy</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js" crossOrigin="use-credentials">
							{viewPdf && (
								<Viewer
									fileUrl={viewPdf}
									// httpHeaders={{
									// 	authtoken: user.user.token,
									// }}
									plugins={[defaultLayoutPluginInstance]}
									//withCredentials={true}
								/>
							)}
							{!viewPdf && <p>No PDF</p>}
						</Worker>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowResumeModal(false)}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
    </div>
	</>
  );
}

export default HeadDocs;
