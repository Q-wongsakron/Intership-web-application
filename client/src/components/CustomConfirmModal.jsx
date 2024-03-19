import React, { useEffect, useState } from "react";
import { Button, Modal, Dropdown } from "react-bootstrap";

import btn from "./btn.module.css";

export default function CustomConfirmModal({ isShow, title, body, footer }) {
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalBody, setModalBody] = useState("");
	const [modalFooter, setModalFooter] = useState("");

	useEffect(() => {
		setShowModal(isShow);
		setModalTitle(title);
		setModalBody(body);
		setModalFooter(footer);
	}, []);

	return (
		// <Modal show={showModal} onHide={() => setShowModal(false)} centered>
		// 	<Modal.Header closeButton>
		// 		<Modal.Title className="fw-bold">{modalTitle}</Modal.Title>
		// 	</Modal.Header>
		// 	<Modal.Body>
		// 		{modalBody}
		// 	</Modal.Body>
		// 	<Modal.Footer>
		// 		{modalFooter}
		// 	</Modal.Footer>
		// </Modal>
		<p>not working</p>
	);
}
