import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react"; 
import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DropFileInput from "./drop-file-input/DropFileInput";
import { getToken } from "../config/Constant";
import { MEMO_SERVICE_CREATE, MEMO_SERVICE_GET_USER_LISTS } from "../config/ConfigUrl";

const MySwal = withReactContent(Swal);
const token = getToken();
const headers = { Authorization: `Bearer ${token}`}

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

  const [options, setOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (files) => {
    setSelectedFiles(files);
  };

  useEffect(() => {
    axios.get(`${MEMO_SERVICE_GET_USER_LISTS}`, { headers })
      .then(response => {
        const usernames = response.data.map(user => user.userName);
        setOptions(usernames);
      })
      .catch(error => {
        console.error('error', error);
      });
  }, []);

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
          return response.data;
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
          //style={{width: "max-content", minWidth: "50%"}}
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
          //style={{width: "max-content", minWidth: "50%"}}
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
          style={{width: "max-content", minWidth: "50%"}}
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
        <div className="card mx-3 px-4 pt-5">
          <div className="col-12">
            <form className="form-group" onSubmit={handleSubmit}>
              
              {renderInputField("Title", "title")}
              {renderSelectField("Tipe Dokumen", "tipeDokumen", ["BAST", "Klaim Kesehatan", "RO PO", "Lain-lain"])}
              {renderInputField("Nomor", "nomor")}
              {renderSelectField("Requestor", "requestor", options )}
              {renderInputField("Request Date", "requestDate", "date")}
              {renderInputField("Request Title", "requestTitle")}
              {renderTextAreaField("Request Detail", "requestDetail")}
              {renderInputField("Create Date", "createDate", "date")}
              {renderInputField("Due Date", "dueDate", "date")}
              {renderSelectField("Status Memo", "statusMemo", ["ON_PROGRESS", "PENDING", "REJECTED", "REWORK", "APPROVE_BY_APPROVAL1", "APPROVE_BY_APPROVAL2"])}
              {renderSelectField("User Maker", "userMaker", options)}
              {renderTextAreaField("User Approval 1 Note", "userApproval1Note")}
              {renderTextAreaField("User Approval 2 Note", "userApproval2Note")}
              {renderSelectField("User Approval 1 Name", "userApproval1Name", options )}
              {renderSelectField("User Approval 2 Name", "userApproval2Name", options )}

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
