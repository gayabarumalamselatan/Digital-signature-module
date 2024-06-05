import React, { useState } from "react";
import { Modal } from "react-bootstrap"; // Or your preferred UI library
import PdfViewer from "../Text Editor/PdfViewer";

function ModalComponent({ show, handleClose }) {
  return (
    <Modal className="modal-xl" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Signature Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PdfViewer />
      </Modal.Body>
      {/* Optional footer */}
    </Modal>
  );
}

export default ModalComponent;
