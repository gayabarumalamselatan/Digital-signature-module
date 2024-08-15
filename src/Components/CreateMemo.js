import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react"; 
import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DropFileInput from "./drop-file-input/DropFileInput";
import { getToken, getUserId, getUserName } from "../config/Constant";
import { MEMO_SERVICE_CREATE, MEMO_SERVICE_GET_USER_LISTS, MEMO_SERVICE_USERNAME_LISTS } from "../config/ConfigUrl";
import { Button } from "react-bootstrap";

const MySwal = withReactContent(Swal);
const token = getToken();
const gettingUserId = getUserId();
const headers = { Authorization: `Bearer ${token}`}

function CreateMemo() {
  const [formData, setFormData] = useState({
    title: "Internal Memo",
    nomor: "",
    requestor: "",
    requestDate: "",
    requestTitle: "",
    requestDetail: "",
    tipeDokumen:"BAST",
    createDate: "",
    dueDate: "",
    statusMemo: "ON_PROGRESS",
    userMaker: "",
    userApproval1Note: "",  
    userApproval2Note: "",
    userApproval1Name: "",
    userApproval2Name: "",
    userId: gettingUserId,
  });
  const [options, setOptions] = useState([]);
  const [newOptions, setNewOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [gettingUserName, setGettingUserName] = useState(getUserName());

  const handleFileChange = (files) => {
    setSelectedFiles(files);
  };

  //Reset form function
  const handleCancel = (event) => {
    event.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(formData.requestDate);
    dueDate.setDate(dueDate.getDate() + 3);
    const newDueDate = dueDate.toISOString().split('T')[0];
    setFormData({
      title: "Internal Memo",
      nomor: "",
      requestor: "",
      requestDate: currentDate,
      requestTitle: "",
      requestDetail: "",
      tipeDokumen: "BAST",
      createDate: currentDate,
      dueDate: newDueDate,
      statusMemo: "ON_PROGRESS",
      userMaker: "",
      userApproval1Note: "",  
      userApproval2Note: "",
      userApproval1Name: "",
      userApproval2Name: "",
    });
    setSelectedFiles([]);
    setErrors({});
    setFileError(false);
    setUploadedFiles([]);
    setFileList([]);
  };

  useEffect(()=>{
    const intervalId = setInterval(() => {
      const newUserName = getUserName();
      if (newUserName !== gettingUserName){
        setGettingUserName(newUserName);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  },[gettingUserName]);

  useEffect(() => {
    const params = 'username&status&page=0&size=500';
    axios.get(`${MEMO_SERVICE_USERNAME_LISTS}?${params}`, { headers })
      .then(response => {
        const usernames = response.data.users.map(user => user.userName);
        setOptions(usernames);
      })
      .catch(error => {
        console.error('error', error);
      });

    const currentDate = new Date().toISOString().split('T')[0];
    setFormData((prevData) => ({
      ...prevData,
      requestDate: currentDate,
      createDate: currentDate,
    }));

    if (formData.requestDate) {
      const dueDate = new Date(formData.requestDate);
      dueDate.setDate(dueDate.getDate() + 3);
      setFormData((prevData) => ({
        ...prevData,
        dueDate: dueDate.toISOString().split("T")[0],
      }));
    }

  }, [formData.requestDate]);

  const validateForm = () => {
    const requiredFields = [
      "title", "tipeDokumen", "nomor", "requestor", "requestDate", "requestTitle", 
      "requestDetail", "createDate", "dueDate", "statusMemo", "userMaker", "userApproval1Name", "userApproval2Name", 
    ];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required!`;
    });

    if (fileError || uploadedFiles.length === 0) {
      newErrors.file = setFileError(true);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Fungsi require field
  const validateField = () => {
    const requiredFields = [
      "title", "tipeDokumen", "nomor", "requestor", "requestDate", "requestTitle", 
      "requestDetail", "createDate", "dueDate", "statusMemo", "userMaker", "userApproval1Name", "userApproval2Name", 
    ];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required!`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // const formattedDateTime = (date) => {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const hour = String(date.getHours()).padStart(2, '0');
  //   const minute = String(date.getMinutes()).padStart(2, '0');
  //   const second = String(date.getSeconds()).padStart(2, '0');
  //   const millisecond = String(date.getMilliseconds()).padStart(3, '0');
  //   return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`;
  // };

  //Submit Function
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    //Memanggil Function require field
    if (!validateForm()) {
      MySwal.fire("Error!", "Please fill in all required fields.", "error");
      return;
    }

    // const currentDate = new Date();
    // const dueDate = new Date(formData.dueDate);
    // dueDate.setHours(currentDate.getHours());
    // dueDate.setMinutes(currentDate.getMinutes());
    // dueDate.setSeconds(currentDate.getSeconds());
    // dueDate.setMilliseconds(currentDate.getMilliseconds());
    // const formattedDueDate = formattedDateTime(dueDate);

    //Swal popup
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
        MySwal.fire({
          title: "Loading...",
          text: "Please wait while we process your request.",
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });

        const formDataToSend = new FormData();
        for (const key in formData) {
          if (formData[key]) formDataToSend.append(key, formData[key]);
        }

        //formDataToSend.set('dueDate', formattedDueDate);
    
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
          handleCancel(event);
          setUploadedFiles([]);
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
  
  const renderInputField = (label, name, type = "text", disabled= false) => (
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
          disabled={gettingUserName !== 'digital_signature_admin' && gettingUserName === 'digital_signature_maker' && disabled}
        />
        {errors[name] && <small className="text-danger">{errors[name]}</small>}
      </div>
    </div>
  );

  const renderTextAreaField = (label, name, disabled = false) => (
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
          disabled={gettingUserName !== 'digital_signature_admin' && gettingUserName === 'digital_signature_maker' && disabled}
          //style={{width: "max-content", minWidth: "50%"}}
        />
        {errors[name] && <small className="text-danger">{errors[name]}</small>}
      </div>
    </div>
  );

  const renderSelectField = (label, name, options, disabled = false) => (
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
          disabled={gettingUserName !== 'digital_signature_admin' && gettingUserName === 'digital_signature_maker' && disabled}
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
                <li className="breadcrumb-item"><a href="/">Home</a></li>
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
              
              {renderInputField("Title", "title", "text", true)}
              {renderSelectField("Tipe Dokumen", "tipeDokumen", ["BAST", "Klaim Kesehatan", "PR PO", "Lain-lain"])}
              {renderInputField("Nomor", "nomor")}
              {renderSelectField("Requestor", "requestor", options )}
              {renderInputField("Request Date", "requestDate", "date")}
              {renderInputField("Request Title", "requestTitle")}
              {renderTextAreaField("Request Detail", "requestDetail")}
              {renderInputField("Create Date", "createDate", "date")}
              {renderInputField("Due Date", "dueDate", "date")}
              {/* {renderSelectField("Status Memo", "statusMemo", ["ON_PROGRESS", "PENDING", "REJECTED", "REWORK", "APPROVE_BY_APPROVAL1", "APPROVE_BY_APPROVAL2"])} */}
              {renderSelectField("User Maker", "userMaker", options)}
              {renderTextAreaField("User Approval 1 Note", "userApproval1Note", true)}
              {renderTextAreaField("User Approval 2 Note", "userApproval2Note", true)}
              {renderSelectField("User Approval 1 Name", "userApproval1Name", options,  )}
              {renderSelectField("User Approval 2 Name", "userApproval2Name", options,  )}

              <div className="container d-flex justify-content-center mt-4">
                <div className="card" style={{ width: "500px", maxWidth: "50%", borderRadius: '20px' }}>
                  <DropFileInput 
                    onFileChange={handleFileChange}
                    setFileError={setFileError}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                    fileError={fileError}
                    resetUploadedFiles={handleSubmit}
                    validateField={validateField}
                    fileList={fileList}
                    setFileList={setFileList}
                  />
                  {errors.file && <small className="text-danger">{errors.file}</small>}
                </div>
              </div>
              

              <div className="mb-3 text-end p-5 d-flex text-end justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Reset
                </button>
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
