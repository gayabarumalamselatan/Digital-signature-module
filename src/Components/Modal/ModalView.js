import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalView() {
  const [show, setShow] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    nomor: "",
    requestor: "",
    requestDate: "",
    requestTitle: "",
    requestDetail: "",
    createDate: "",
    dueDate: "",
    statusMemo: "",
    userApproval1Note: "",
    userApproval2Note: "",
    userApproval1Name: "",
    userApproval2Name: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    // Load data from server when modal is shown
    if (show) {
      fetchData();
    }
  }, [show]);

  const fetchData = async () => {
    try {
      // Replace with your API endpoint
      const response = await axios.get("/api/getFormData");
      const data = response.data;

      // Set formData with the data received
      setFormData({
        Title: data.Title || "",
        Requestor: data.Requestor || "",
        RequestDate: data.RequestDate || "",
        RequestTitle: data.RequestTitle || "",
        RequestDetail: data.RequestDetail || "",
        DueDate: data.DueDate || "",
        UserMaker: data.UserMaker || "",
        UserApproval1: data.UserApproval1 || "",
        UserApproval2: data.UserApproval2 || "",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        View
      </Button>

      <Modal show={show} onHide={handleClose} size='xl' scrollable={true}>

          <Modal.Header closeButton>
            <Modal.Title>View</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="my-4">
              <ul className="row">
                <li className="col-sm-3">Title</li>
                <p className="col-sm-9">: {formData.Title}</p>
              </ul>
              <ul className="row">
                <li className="col-sm-3">Requestor</li>
                <p className="col-sm-9">: {formData.Requestor}</p>
              </ul>
              <ul className="row">
                <li className="col-sm-3">Request Date</li>
                <p className="col-sm-9">: {formData.RequestDate}</p>
              </ul>
              <ul className="row">
                <li className="col-sm-3">Request Title</li>
                <p className="col-sm-9">: {formData.RequestTitle}</p>
              </ul>
              <ul className="row">
                <li className="col-sm-3">Request Detail</li>
                <p className="col-sm-9">: {formData.RequestDetail}</p>
              </ul>
              <ul className="row">
                <li className="col-sm-3">Due Date</li>
                <p     className="col-sm-9">: {formData.DueDate}</p>
              </ul>
              <ul className="row">
                <li className="col-sm-3">User Maker</li>
                <p className="col-sm-9">: {formData.UserMaker}</p>
              </ul>
              <ul className="row">
                <li className="col-sm-3">User Approval Pertama</li>
                <p className="col-sm-9">: {formData.UserApproval1}</p>
              </ul>
              <ul className="row">
                <li className="col-sm-3">User Approval Kedua</li>
                <p className="col-sm-9">: {formData.UserApproval2}</p>
              </ul>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        
      </Modal>
    </>
  );
}

export default ModalView;
