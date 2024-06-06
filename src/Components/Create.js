import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DropFileInput from "./drop-file-input/DropFileInput";


const MySwal = withReactContent(Swal);

function Create() {
  const [formData, setFormData] = useState({
    Title: "",
    Requestor: "",
    RequestDate: "",
    RequestTitle: "",
    RequestDetail: "",
    DueDate: "",
    DocumentType: "",
    UserMaker: "",
    UserApproval1: "",
    UserApproval2: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (files) => {
    setSelectedFiles(files);
  };

  const handleUploadClick = async () => {
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      for (const file of selectedFiles) {
        formDataToSend.append("files", file);
      }
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.post("http://localhost:8080/api/upload", formDataToSend, {
        //"/api/upload diubah dengan endpoint yang sudah ada"
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      MySwal.fire("Success!", "File uploaded successfully!", "success");
    } catch (error) {
      MySwal.fire("Error!", "Error uploading file.", "error");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the form?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, cancel!",
      confirmButtonText: "Yes, submit it!",
    });

    if (result.isConfirmed) {
      try {
        // Send formData to backend for processing
        const response = await axios.post("http://localhost:8080/api/submit", formData);
        //"/api/upload diubah dengan endpoint yang sudah ada"
        MySwal.fire("Submitted!", "Your form has been submitted.", "success");
      } catch (error) {
        MySwal.fire("Error!", "There was an error submitting the form.", "error");
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container mt-5">
      <h3 className="text-start mb-3">Create</h3>
      <div className="card p-3">
        <form className="container">
          {/* ... (input fields) */}
          <div className="row text-start mb-3">
            <label htmlFor="Title" className="col-2 col-form-label">
              Title:
            </label>
            <div className="col-10">
              <input
                type="text"
                className=" form-control"
                id="Title"
                name="Title"
                value={formData.Title}
                onChange={handleChange} // Tambahkan event onChange
              />
            </div>
          </div>

          <div className="row text-start mb-3">
            <label htmlFor="Requestor" className="col-2 col-form-label">
              Requestor:
            </label>
            <div className="col-10">
              <select className="form-select" id="Requestor" name="Requestor" value={formData.Requestor} onChange={handleChange}>
                <option value="">Select an option</option>
                {/* ... (opsi Requestor) */}
              </select>
            </div>
          </div>

          <div className="row mb-3 text-start">
            <label htmlFor="RequestDate" className="col-2 col-form-label">
              Request Date:
            </label>
            <div className="col-10">
              <input type="date" className="form-control" id="RequestDate" name="RequestDate" value={formData.RequestDate} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3 text-start row">
            <label htmlFor="RequestTitle" className="col-2 col-form-label">
              Request Title:
            </label>
            <div className="col-10">
              <input
                type="text"
                className="form-control"
                id="RequestTitle"
                name="RequestTitle"
                value={formData.RequestTitle}
                onChange={handleChange} // Tambahkan event onChange
              />
            </div>
          </div>

          <div className="mb-3 text-start row">
            <label htmlFor="DueDate" className="col-2 col-form-label">
              Due Date:
            </label>
            <div className="col-10">
              <input type="date" className="form-control" id="DueDate" name="DueDate" value={formData.DueDate} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3 text-start row">
            <label htmlFor="DocumentType" className="col-2 col-form-label">
              Document Type:
            </label>
            <div className="col-10">
              <select className="form-select" id="DocumentType" name="DocumentType" value={formData.DocumentType} onChange={handleChange}>
                <option value="">Select an option</option>
                <option value="BAST">BAST</option>
                <option value="Klaim Kesehatan">Klaim Kesehatan</option>
                <option value="RO PO">RO PO</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>
          </div>

          <div className="mb-3 text-start row">
            <label htmlFor="UserMaker" className="col-2 col-form-label">
              User Maker:
            </label>
            <div className="col-10">
              <select className="form-select" id="UserMaker" name="UserMaker" value={formData.UserMaker} onChange={handleChange}>
                <option value="">Select an option</option>
                {/* ... (opsi UserMaker) */}
              </select>
            </div>
          </div>

          <div className="mb-3 text-start row">
            <label htmlFor="UserApproval1" className="col-2 col-form-label">
              User Approval 1:
            </label>
            <div className="col-10">
              <select className="form-select" id="UserApproval1" name="UserApproval1" value={formData.UserApproval1} onChange={handleChange}>
                <option value="...">Select an option</option>
                <option value="Approve">Approve</option>
                <option value="Reject">Reject</option>
                {/* ... (opsi UserApproval1) */}
              </select>
            </div>
          </div>

          <div className="mb-3 text-start row">
            <label htmlFor="UserApproval2" className="col-2 col-form-label">
              User Approval 2:
            </label>
            <div className="col-10">
              <select className="form-select" id="UserApproval2" name="UserApproval2" value={formData.UserApproval2} onChange={handleChange}>
                <option value="Select an option">Select an option</option>
                <option value="Approve">Approve</option>
                <option value="Reject">Reject</option>
                {/* ... (opsi UserApproval2) */}
              </select>
            </div>
          </div>

          {/* <div className="mb-3 text-start row">
            <label htmlFor="RequestDetail" className="col-2 col-form-label">
              Request Detail:
            </label>
            <div className="col-10">
              <textarea
                className="form-control"
                id="RequestDetail"
                name="RequestDetail"
                value={formData.RequestDetail}
                onChange={handleChange} // Tambahkan event onChange
              />
            </div>
          </div> */}

          <div className="container d-flex justify-content-center">
            <div className="card" style={{ width: "500px", maxWidth: "50%" }}>
              <DropFileInput onFileChange={handleFileChange} />
              {/* <button className="btn btn-primary mt-4" onClick={handleUploadClick} disabled={isUploading}>
                {isUploading ? `Uploading... (${uploadProgress}%)` : "Upload"}
              </button> */}
            </div>
          </div>

          <div className="mb-3 text-center p-5">
            <button className="btn btn-primary" variant="primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create;
