import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PdfViewer from "../PdfViewer/PdfViewer";
import Signature from "./SignaturePad";
import Swal from "sweetalert2";
import { getToken, getUserId, getUserName, token } from "../../config/Constant";
import { MEMO_SERVICE_CREATE, MEMO_SERVICE_FORM_LIST, MEMO_SERVICE_GET_USER_LISTS, MEMO_SERVICE_UPDATE } from "../../config/ConfigUrl";
import { duration } from "moment";

const userId = getUserId();
// const userName = getUserName();


function ModalEdit({ show, handleClose, memo, fetchData,  }) {
  const [showSignature, setShowSignature] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const [file, setFile] = useState(null);
  const [isApproval1, setIsApproval1] = useState(false);
  const [isApproval2, setIsApproval2] = useState(false);
  const [isMaker, setIsMaker] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userNames, setUserNames] = useState([]);
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
  const headers = { Authorization: `Bearer ${token}`};
  const [userName, setUserName] = useState(getUserName());
  const [signature, setSignature] = useState(null);

  const getSignature = (base64Signature) => {
    setSignature(base64Signature);
  };

  const ModalShow = ({ show, handleClose, fileName, filePath }) => (
    <Modal size="xl" show={show} onHide={handleClose} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>File Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PdfViewer fileName={fileName} filePath={filePath}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newUserName = getUserName();
      if (newUserName !== userName) {
        setUserName(newUserName);
      }
    }, 1000); 
  
    return () => clearInterval(intervalId);
  }, [userName]);

  const updateUserRoles = (userName) => {
    setIsApproval1(userName === "digital_signature_approval1");
    setIsApproval2(userName === "digital_signature_approval2");
    setIsMaker(userName === "digital_signature_maker");
    setIsAdmin(userName === "digital_signature_admin");
  }

  useEffect(() => {
    if (memo) {
      setFormData({
        ...memo,
        requestDate: formatDate(memo.requestDate),
        createDate: formatDate(memo.createDate),
        dueDate: formatDate(memo.dueDate),
        userApproval1Note: memo.userApproval1Note ,
        userApproval2Note: memo.userApproval2Note ,
      });
      if (memo && memo.nomor) {
        fetchFileNames(memo.nomor);
      }
    }
    updateUserRoles(userName);
    fetchUserNames();
  }, [memo, userName]);

   const fetchUserNames = async () => {
      try {
        const response = await axios.get(`${MEMO_SERVICE_GET_USER_LISTS}`, {headers});
        setUserNames(response.data);
      } catch (error) {
        console.error('Error fetching user names:', error);
      }
    };

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
      const filteredFiles = response.data.filter((item) => !item.fileName.toLowerCase().endsWith(".docx"));
      setFileNames(filteredFiles);
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showSignature && !document.getElementById("digisignKey")?.value) {
      Swal.fire({
        title: "Error!",
        text: "Signature key is required.",
        icon: "error",
        confirmButtonText: "OK",
      });
      const smallElement = document.querySelector("#digisignKey + small");
        if (smallElement) {
          smallElement.style.display = "block";
        }
      return;
    } else {
      const smallElement = document.querySelector("#digisignKey + small");
      if (smallElement) {
        smallElement.style.display = "none";
      }
    }

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
          Swal.fire({
            title: "Loading...",
            text: "Please wait while we process your request.",
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading();
            },
          });


          const token = getToken();
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };

          let updatedFormData = {...formData};
          const base64Value = `data:image/png;base64,${signature}`;

          if (formData.statusMemo !== "REJECTED" || formData.statusMemo !== "REWORK" || formData.statusMemo !== 'PENDING') {
            updatedFormData = {
             ...updatedFormData,
              digisignCheck: showSignature,
              digisignKey: document.getElementById("digisignKey")?.value || "",
              base64Signature: signature !== null ? base64Value : "",
            };
          } else {
             updatedFormData = {...formData };
          }

          // const updatedFormData = {
          //   ...formData,
          //   digisignCheck: showSignature,
          //   digisignKey: document.getElementById("digisignKey").value,
          //   base64Signature: `data:image/png;base64,${signature}`,
          // };

          const data = new FormData();
          Object.keys(updatedFormData).forEach((key) => {
            if (updatedFormData[key] === null) {
              data.append(key, "");
            } else {
              data.append(key, updatedFormData[key]);
            }
          });

          data.set("userId", userId);

          const dueDate = new Date(formData.dueDate);
          const currentDate = new Date();
          const gapDay = currentDate - dueDate;

          let days = Math.floor(gapDay / (1000 * 3600 * 24));
          let hours = Math.floor((gapDay % (1000 * 3600 * 24)) / (1000 * 3600));
          let minutes = Math.floor((gapDay % (1000 * 3600)) / (1000 * 60));

          let responseString = `waktu: ${days} hari, ${hours} jam, ${minutes} menit`;
          
          if(isApproval1){
            data.set('durationApproval1', responseString);
            data.set('userApproval1Date', formatDate(currentDate));
          }else{
            data.set('durationApproval2', responseString);
            data.set('userApproval2Date', formatDate(currentDate));
          }

          if (file) {
            data.append("file", file);
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

  const handleOpenModal = (fileName, filePath) => {
    setSelectedFileName(fileName);
    setSelectedFilePath(filePath)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSignatureCheckboxChange = () => {
    setShowSignature(!showSignature);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl" scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Memo</Modal.Title>
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
                disabled={(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isMaker && !isAdmin}
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
                disabled={(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isMaker && !isAdmin}
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
                disabled={(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isMaker && !isAdmin}
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
                disabled={(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isMaker && !isAdmin}
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
                disabled={(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isMaker && !isAdmin}
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
                disabled={(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isMaker && !isAdmin}
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
                disabled={(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isMaker && !isAdmin}
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
                disabled={(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isMaker && !isAdmin}
              >
                <option value="">Select an option</option>
                {userNames.map((user, index) => (
                  <option key={index} value={user.userName}>
                    {user.userName.toUpperCase()}
                  </option>
                ))}
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
                disabled={(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isMaker && !isAdmin}
              >
                <option value="">Select an option</option>
                {userNames.map((user, index) => (
                  <option key={index} value={user.userName}>
                    {user.userName.toUpperCase()}
                  </option>
                ))}
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
                disabled = {(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isAdmin &&!isApproval1 && !isApproval2}
              >
                <option value="">Select an option</option>
                <option value="ON_PROGRESS">ON_PROGRESS</option>
                <option value="PENDING">PENDING</option>
                <option value="REJECTED">REJECTED</option>
                <option value="REWORK">REWORK</option>
                <option value="APPROVE_BY_APPROVAL1">APPROVE_BY_APPROVAL1</option>
                <option value="APPROVE_BY_APPROVAL2">APPROVE_BY_APPROVAL2</option>
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
                disabled={(formData.statusMemo === 'DONE' && userName === 'digital_signature_maker') || !isMaker && !isAdmin}
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
                disabled={!isAdmin && !isApproval1}
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
                disabled={!isAdmin && !isApproval2}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="FileName" className="form-label">
                File Names
              </label>

              <div className="table-responsive " 
                style={{
                  border:'none',
                  minWidth: "", 
                  borderRadius: "20px",
                  overflow: "hidden",
                  overflowX: "scroll"
                }}
              >
                <table className="table table-bordered" style={{ 
                  borderRadius: "20px",  
                  overflow: "hidden",
                  tableLayout: "auto",     
                  marginBottom: "0px" ,
                }}>
                  <thead>
                    <tr>
                      <th scope="col" style={{borderLeft:'none', width:"30px"}}>No</th>
                      <th scope="col" style={{borderRight: 'none'}}>Nama File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileNames.map((item, index) => (
                      <tr key={index}>
                        <td style={{borderLeft:'none', width: "30px"}}>{index + 1}</td>
                        <td style={{borderRight: 'none'}}>
                          <a href="#" onClick={() => handleOpenModal(item.fileName, item.filePath)}>
                            {item.fileName}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {formData.statusMemo === 'APPROVE_BY_APPROVAL1' || formData.statusMemo === 'APPROVE_BY_APPROVAL2' ? (
              <>
                <div className="col-md-6 ">
                  <div className="ms-4 mt-4">
                    <input 
                    type="checkbox" 
                    className="form-check-input" 
                    checked={showSignature} 
                    onChange={handleSignatureCheckboxChange} 
                    disabled = {!isApproval1 && !isApproval2}
                    />
                    <label className="form-check-label text-danger">
                      Check to include signature (optional).
                    </label>
                  </div>
                {showSignature && (
                <div className="mt-2">
                  <div className=" mb-2">
                  <label htmlFor="digisignKey" className="form-label">
                    Signature Key
                  </label>
                  <input
                    type="number"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="form-control"
                    id="digisignKey"
                    name="digisignKey"
                    onChange={handleChange}
                    style={{background: "transparent", borderColor: "#646464", borderRadius: "15px", color: "#646464"}}
                    required
                  />
                  <small id="digisignKeyError" className="text-danger" style={{ display: "none" }}>
                    Signature key is required.
                  </small>          
                </div>
                  <Signature 
                    getSignature={getSignature}
                  />
                </div>
              )}
            </div>
              </> 
              ) : (
              <></>
            )}
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

      <ModalShow 
        show={showModal} 
        handleClose={handleCloseModal} 
        fileName={selectedFileName}
        filePath={selectedFilePath}
      />
    </>
  );
}

export default ModalEdit;
