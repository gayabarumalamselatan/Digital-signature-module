import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react"; 
import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DropFileInput from "./drop-file-input/DropFileInput";
import { getToken } from "../config/Constant";
import { MEMO_SERVICE_CREATE } from "../config/ConfigUrl";

const MySwal = withReactContent(Swal);
const token = getToken();

function CreateMemo() {
  const [formData, setFormData] = useState({
    title: "",
    nomor: "",
    requestor: "",
    requestDate: "",
    requestTitle: "",
    requestDetail: "",
    //tipeDokumen:"",
    createDate: "",
    dueDate: "",
    statusMemo: "",
    userApproval1Note: "",  
    userApproval2Note: "",
    userApproval1Name: "",
    userApproval2Name: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (files) => {
    setSelectedFiles(files);
  };

  const validateForm = () => {
    const requiredFields = [
      "title", "nomor", "requestor", "requestDate", "requestTitle", 
      "requestDetail", "createDate", "dueDate", "statusMemo", 
      "userApproval1Note", "userApproval2Note", 
      "userApproval1Name", "userApproval2Name"
    ];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required!`;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      MySwal.fire("Error!", "Please fill in all required fields.", "error");
      return;
    }

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
        const formDataToSend = new FormData();
        for (const key in formData) {
          if (formData[key]) formDataToSend.append(key, formData[key]);
        }
    
        const response = await axios.post(
          `${MEMO_SERVICE_CREATE}`, 
          formDataToSend, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
    
        MySwal.fire("Submitted!", "Your form has been submitted.", "success").then(() => {
          window.location.reload();
          // event.target.reset();
        });
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
  
  const renderInputField = (label, name, type = "text") => (
    <div className="row text-start mb-3">
      <label htmlFor={name} className="col-2 col-form-label">
        {label}:
      </label>
      <div className="col-10">
        <input 
          type={type} 
          className="form-control" 
          id={name} 
          name={name} 
          value={formData[name]} 
          onChange={handleChange} 
        />
        {errors[name] && <small className="text-danger">{errors[name]}</small>}
      </div>
    </div>
  );

  const renderTextAreaField = (label, name) => (
    <div className="row text-start mb-3">
      <label htmlFor={name} className="col-2 col-form-label">
        {label}:
      </label>
      <div className="col-10">
        <textarea 
          className="form-control" 
          id={name} 
          name={name} 
          value={formData[name]} 
          onChange={handleChange} 
        />
        {errors[name] && <small className="text-danger">{errors[name]}</small>}
      </div>
    </div>
  );

  const renderSelectField = (label, name, options) => (
    <div className="row text-start mb-3">
      <label htmlFor={name} className="col-2 col-form-label">
        {label}:
      </label>
      <div className="col-10">
        <select 
          className="form-select" 
          id={name} 
          name={name} 
          value={formData[name]} 
          onChange={handleChange}>
          <option value="">Select an option</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors[name] && <small className="text-danger">{errors[name]}</small>}
      </div>
    </div>
  );

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Create Memo</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/user">Home</a></li>
                <li className="breadcrumb-item active">Create Memo</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="card mx-2 px-4 pt-3">
          <div className="col-12">
            <form className="form-group" onSubmit={handleSubmit}>
              {renderInputField("Title", "title")}
              {renderInputField("Nomor", "nomor")}
              {renderSelectField("Requestor", "requestor", ["test1"])}
              {renderInputField("Request Date", "requestDate", "date")}
              {renderInputField("Request Title", "requestTitle")}
              {renderTextAreaField("Request Detail", "requestDetail")}
              {renderSelectField("Tipe Dokumen", "tipeDokumen", ["BAST", "Klaim Kesehatan", "RO PO", "Lain-lain"])}
              {renderInputField("Create Date", "createDate", "date")}
              {renderInputField("Due Date", "dueDate", "date")}
              {renderSelectField("Status Memo", "statusMemo", ["test3"])}
              {renderTextAreaField("User Approval 1 Note", "userApproval1Note")}
              {renderTextAreaField("User Approval 2 Note", "userApproval2Note")}
              {renderSelectField("User Approval 1 Name", "userApproval1Name", ["Nama Approval 1 1", "Nama Approval 1 2"])}
              {renderSelectField("User Approval 2 Name", "userApproval2Name", ["Nama Approval 2 1", "Nama Approval 2 2"])}

              <div className="container d-flex justify-content-center mt-4">
                <div className="card" style={{ width: "500px", maxWidth: "50%", borderRadius: '20px' }}>
                  <DropFileInput onFileChange={handleFileChange} />
                </div>
              </div>

              <div className="mb-3 text-end p-5">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>   
      </section>
    </>
  );
}

export default CreateMemo;
