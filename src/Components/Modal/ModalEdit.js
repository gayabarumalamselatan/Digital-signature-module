import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PdfViewer from "../Text Editor/PdfViewer";
import Signature from "./SignaturePad";
import Swal from "sweetalert2";
import { getToken } from "../../config/Constant";
import { MEMO_SERVICE_FORM_LIST, MEMO_SERVICE_UPDATE } from "../../config/ConfigUrl";

const ModalShow = ({ show, handleClose, fileName }) => (
  <Modal size="xl" show={show} onHide={handleClose} scrollable={true}>
    <Modal.Header closeButton>
      <Modal.Title>File Details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h1>PDF Viewer</h1>
      <PdfViewer />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

function ModalEdit({ show, handleClose, memo, fetchData, signatureBlob }) {
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

  const [showModal, setShowModal] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (memo) {
      setFormData({
        ...memo,
        requestDate: formatDate(memo.requestDate),
        createDate: formatDate(memo.createDate),
        dueDate: formatDate(memo.dueDate),
      });
      if (memo && memo.nomor) {
        fetchFileNames(memo.nomor);
      }
    }
  }, [memo]);

  const fetchFileNames = async (nomor) => {
    try {
      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };
      const params = {
        fileId: nomor,
      };
      const response = await axios.get(`${MEMO_SERVICE_FORM_LIST}`, { headers, params });
      setFileNames(response.data);
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = getToken();
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };

          const data = new FormData();
          Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
          });

          if (file) {
            data.append("file", file);
          }
          if (signatureBlob) {
            data.append("signature", signatureBlob);
          }

          const response = await axios.put(`${MEMO_SERVICE_UPDATE}`, data, config);

          Swal.fire({
            title: "Saved!",
            text: "Your changes have been saved.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            handleClose();
            fetchData();
          });
        } catch (error) {
          console.error("Error saving data:", error);
          Swal.fire({
            title: "Error!",
            text: "There was an error saving your changes. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const handleOpenModal = (fileName) => {
    setSelectedFileName(fileName);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl" scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label htmlFor="Id" className="form-label">
                ID
              </label>
              <input
                type="text"
                className="form-control"
                id="Id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="Title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="Nomor" className="form-label">
                Nomor
              </label>
              <input
                type="text"
                className="form-control"
                id="Nomor"
                name="nomor"
                value={formData.nomor}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="Requestor" className="form-label">
                Requestor
              </label>
              <input
                type="text"
                className="form-control"
                id="requestor"
                name="requestor"
                value={formData.requestor}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="RequestDate" className="form-label">
                Request Date
              </label>
              <input
                type="date"
                className="form-control"
                id="RequestDate"
                name="requestDate"
                value={formData.requestDate}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="RequestTitle" className="form-label">
                Request Title
              </label>
              <input
                type="text"
                className="form-control"
                id="RequestTitle"
                name="requestTitle"
                value={formData.requestTitle}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="CreateDate" className="form-label">
                Create Date
              </label>
              <input
                type="date"
                className="form-control"
                id="CreateDate"
                name="createDate"
                value={formData.createDate}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="DueDate" className="form-label">
                Due Date
              </label>
              <input
                type="date"
                className="form-control"
                id="DueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="UserApproval1Name" className="form-label">
                User Approval Pertama
              </label>
              <select
                className="form-control"
                id="UserApproval1Name"
                name="userApproval1Name"
                value={formData.userApproval1Name}
                onChange={handleChange}
                disabled
              >
                <option value="">Select an option</option>
                <option value="Approve">Approve</option>
                <option value="Reject">Reject</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="UserApproval2Name" className="form-label">
                User Approval Kedua
              </label>
              <select
                className="form-control"
                id="UserApproval2Name"
                name="userApproval2Name"
                value={formData.userApproval2Name}
                onChange={handleChange}
                disabled
              >
                <option value="">Select an option</option>
                <option value="Approve">Approve</option>
                <option value="Reject">Reject</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="StatusMemo" className="form-label">
                Status Memo
              </label>
              <select
                className="form-control"
                id="StatusMemo"
                name="statusMemo"
                value={formData.statusMemo}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="Approve">Approve</option>
                <option value="Reject">Reject</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="RequestDetail" className="form-label">
                Request Detail
              </label>
              <textarea
                className="form-control"
                id="RequestDetail"
                name="requestDetail"
                value={formData.requestDetail}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="UserApproval1Note" className="form-label">
                User Approval 1 Note
              </label>
              <textarea
                className="form-control"
                id="UserApproval1Note"
                name="userApproval1Note"
                value={formData.userApproval1Note}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="UserApproval2Note" className="form-label">
                User Approval 2 Note
              </label>
              <textarea
                className="form-control"
                id="UserApproval2Note"
                name="userApproval2Note"
                value={formData.userApproval2Note}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="FileName" className="form-label">
                File Names
              </label>

              <div className=" table-responsive " style={{border:'none'}}>
                <table className="table table-bordered" style={{ 
                  minWidth: "max-content", 
                  borderRadius: "20px",  
                  overflow: "hidden"      
                }}>
                  <thead>
                    <tr>
                      <th scope="col" style={{borderLeft:'none'}}>No</th>
                      <th scope="col">Id</th>
                      <th scope="col" style={{borderRight: 'none'}}>Nama File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileNames.map((item, index) => (
                      <tr key={index}>
                        <td style={{borderLeft:'none'}}>{index + 1}</td>
                        {/* Id apus klo udh jalan */}
                        <td>{item.id}</td>
                        <td style={{borderRight: 'none'}}>
                          <a href="#" onClick={() => handleOpenModal(item.fileName)}>
                            {item.fileName}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6 mt-0">
              <Signature />
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

      <ModalShow show={showModal} handleClose={handleCloseModal} />
    </>
  );
}

export default ModalEdit;
