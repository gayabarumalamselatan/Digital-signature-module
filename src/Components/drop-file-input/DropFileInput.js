import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
import axios from "axios";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "./flags.css"; // Adjust the path if necessary
import { getToken } from "../../config/Constant";
import { MEMO_SERVICE_FILE_UPLOAD } from "../../config/ConfigUrl";
import { styled } from "@mui/material";
import { BorderColor, Margin } from "@mui/icons-material";


const token = getToken();

const TemplateDemo = () => {
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const maxFileSize = 25 * 1024 * 1024; // 25MB in bytes
  const allowedFileTypes = [ "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize; // Initialize with existing total size
    let files = e.files;

    for (let key in files) {
      if (files.hasOwnProperty(key)) {
        if (!isFileTypeAllowed(files[key].type)) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Invalid file type. Only PDFs, and DOCX files are allowed.",
          });
          e.files.splice(key, 1); // Remove invalid file
          return; // Stop processing if invalid file is found
        }

        _totalSize += files[key].size || 0;
      }
    }

    if (_totalSize > maxFileSize) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "File size exceeds the limit of 25MB.",
      });
      setTotalSize(totalSize); // Restore previous total size
      e.originalEvent.preventDefault(); // Prevent file from being added
      return;
    }

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = async () => {
    const files = fileUploadRef.current.getFiles();

    if (files.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No files selected for upload.",
      });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });

    try {
      const response = await axios.post(`${MEMO_SERVICE_FILE_UPLOAD}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTotalSize(0);
      setUploadedFiles([...uploadedFiles, ...files]); 

      toast.current.show({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
      });

      // Clear file list after upload completes
      fileUploadRef.current.clear();
    } catch (error) {
      console.error("Upload error:", error.response || error.message || error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to upload files: ${error.response?.data?.message || error.message}`,
      });
    }
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / maxFileSize;
    const formattedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px"
        }}
      >
        {chooseButton}
        <Button type="button" icon="pi pi-cloud-upload" className="rounded btn-success upload" onClick={onTemplateUpload} />
        {cancelButton}
        <div className="flex align-items-center gap-2 ml-auto">
          <span>{formattedValue} / 25 MB</span>
          <ProgressBar value={value * 100} showValue={false} style={{ width: "10rem", height: "12px" }}></ProgressBar>
        </div>
      </div>
    );
  };
  const itemTemplate = (file, props) => {
    const fileType = file.type; 
     let icon;

    if (fileType === "application/pdf") {
      icon = 'pi pi-file-pdf'; 
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      icon = "pi pi-file-word"; 
    }

    return (
      <div className="flex align-items-center flex-wrap" style={{ padding: "10px 5px", borderBottom: "2px solid #ccc",}}>
        <div className="d-flex align-items-center" style={{ width: "100%", borderBottomLeftRadius: '0px'  }}>
          <i className={icon} style={{fontSize: "2em"}}/>
          <br/> 
          <div className="flex flex-column text-left ml-3">
            <span> {file.name} </span>
            <small>{new Date().toLocaleDateString()}</small>
          </div>
        </div>
        <Tag value={props.formatSize} severity="warning" className="px-3 me-2  py-2" />
        <Button type="button" icon="pi pi-times" className="  rounded p-button-danger ml-auto mt-2 mt-md-0" onClick={() => onTemplateRemove(file, props.onRemove)} />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="d-flex align-items-center justify-content-center flex-column">
        <i
          className="pi pi-image p-5"
          style={{
            fontSize: "2em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",

          }}
        ></i>
        <br/>
        <span
          className="mt-2"
          style={{
            fontSize: "1em",
            color: "var(--text-color-secondary)",
          }}
        >
          Drag and Drop PDF/Docx Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-file-plus",
    iconOnly: true,
    className: "custom-choose-btn ",
    style: { 
      backgroundColor: "#222273", 
      borderColor: "#222273", 
      color: "white",                
      margin: "0",
    }
  };
  const uploadOptions = {
    icon: "",
    iconOnly: true,
    className: "custom-upload-button rounded-4 ",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className: "custom-cancel-btn p-button-danger rounded",
  };

  const isFileTypeAllowed = (fileType) => {
    return allowedFileTypes.some((type) => fileType.startsWith(type.replace("*", "")));
  };

  return (
    <div>
      <Toast ref={toast}></Toast>

      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".upload" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <FileUpload
        ref={fileUploadRef}
        name="File"
        multiple
        accept={allowedFileTypes.join(",")}
        maxFileSize={maxFileSize}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
        customUpload
      />

      <div className="uploaded-files">
        <h2 className="card-title ms-4 mt-2 mb-3">Uploaded Files:</h2>
        <br/>
        <ul style={{marginTop: '5px'}}>
          {uploadedFiles.map((file, index) => (
            <li key={index}>
              <span style={{ marginLeft: "5px" }}>{file.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TemplateDemo;
