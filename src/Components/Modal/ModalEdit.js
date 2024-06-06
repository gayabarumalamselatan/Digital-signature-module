import axios from 'axios';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PdfViewer from '../Text Editor/PdfViewer';

const ModalShow = ({ show, handleClose }) => {
  return (
    <Modal className='modal-xl' show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>File Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>PDF Viewer</h1>
        <PdfViewer/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );    
};

function ModalEdit() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    Title: '',
    Requestor: '',
    RequestDate: '',
    RequestTitle: '',
    DueDate: '',
    UserMaker: '',
    UserApproval1: '',
    UserApproval2: '',
    RequestDetail: '',
    Status: '',
    Note: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [fileHyperlink, setFileHyperlink] = useState('');

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleChange = async (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Update the hyperlink based on FileName (after validation)
    if (name === "FileName") {
      try {
        const response = await axios.post("/your-api-endpoint/validate-file", { FileName: value });
        if (response.data.isValid) {
          setFileHyperlink(response.data.hyperlink);
        } else {
          setFileHyperlink("");
          // Optionally: Display an error message to the user about the invalid file
        }
      } catch (error) {
        console.error("Error validating file:", error);
        setFileHyperlink("");
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("/your-api-endpoint/save-data", formData);
      console.log("Data saved successfully:", response.data);
      // Optionally: Show a success message to the user
    } catch (error) {
      console.error("Error saving data:", error);
      // Optionally: Show an error message to the user
    }
  };
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>

      <Modal className="modal-xl" show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label htmlFor="Title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="Title"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="Requestor" className="form-label">Requestor</label>
              <select
                className="form-select"
                id="Requestor"
                name="Requestor"
                value={formData.Requestor}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                {/* Add Requestor options here */}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="RequestDate" className="form-label">Request Date</label>
              <input
                type="date"
                className="form-control"
                id="RequestDate"
                name="RequestDate"
                value={formData.RequestDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="RequestTitle" className="form-label">Request Title</label>
              <input
                type="text"
                className="form-control"
                id="RequestTitle"
                name="RequestTitle"
                value={formData.RequestTitle}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="DueDate" className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                id="DueDate"
                name="DueDate"
                value={formData.DueDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="UserMaker" className="form-label">User Maker</label>
              <select
                className="form-select"
                id="UserMaker"
                name="UserMaker"
                value={formData.UserMaker}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                {/* Add UserMaker options here */}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="UserApproval1" className="form-label">User Approval Pertama</label>
              <select
                className="form-select"
                id="UserApproval1"
                name="UserApproval1"
                value={formData.UserApproval1}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="Approve">Approve</option>
                <option value="Reject">Reject</option>
                {/* Add more UserApproval1 options here */}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="UserApproval2" className="form-label">User Approval Kedua</label>
              <select
                className="form-select"
                id="UserApproval2"
                name="UserApproval2"
                value={formData.UserApproval2}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="Approve">Approve</option>
                <option value="Reject">Reject</option>
                {/* Add more UserApproval2 options here */}
              </select>

            </div>
            <div className="col-md-6">
              <label htmlFor="Status" className="form-label">Status</label>
              <select
                className="form-select"
                id="Status"
                name="Status"
                value={formData.Status}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="Approve">Approve</option>
                <option value="Reject">Reject</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="FileName" className="form-label">File Name</label>
              <ul className="list-unstyled">
                <li>
                  <a href="#" onClick={handleOpenModal}>
                    DokumenBAST
                  </a>
                  <ModalShow show={showModal} handleClose={handleCloseModal} />
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <label htmlFor="RequestDetail" className="form-label">Request Detail</label>
              <textarea
                className="form-control"
                id="RequestDetail"
                name="RequestDetail"
                value={formData.RequestDetail}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="Note" className="form-label">Note</label>
              <textarea
                className="form-control"
                id="Note"
                name="Note"
                value={formData.Note}
                onChange={handleChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalEdit;
