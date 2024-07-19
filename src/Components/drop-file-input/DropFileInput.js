import React, { useState } from "react";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { message, Upload, Progress, Button, Form, Alert } from "antd";
import axios from "axios";
import { MEMO_SERVICE_FILE_UPLOAD } from "../../config/ConfigUrl";
import { getToken } from "../../config/Constant";

const { Dragger } = Upload;

const DropFileInput = ({uploadedFiles, setUploadedFiles, fileError, setFileError}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  //const [fileError, setFileError] = useState(false);
 

  const handleUpload = () => {
    if (fileList.length === 0) {
      setFileError(true);
      return;
    }

    const token = getToken();
    if (!token) {
      message.error("Token not available. Unable to upload.");
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file);
    });

    setUploading(true);
    setFileError(false); // Reset error state

    axios
      .post(MEMO_SERVICE_FILE_UPLOAD, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      })
      .then((response) => {
        console.log("Upload response:", response.data);
        message.success("File uploaded successfully.");
        setFileList([]); // Clear file list after successful upload
        setUploadedFiles([...uploadedFiles, fileList[0].name]);
      })
      .catch((error) => {
        console.error("Upload failed:", error);
        message.error("File upload failed.");
      })
      .finally(() => {
        setUploading(false);
        setProgress(0);
      });
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
  };

  const props = {
    name: "file",
    multiple: false, // Allow only a single file to be selected
    accept: ".pdf,.doc,.docx",
    fileList: fileList.map((file) => ({
      uid: file.uid || Date.now(), // Generate a unique uid if not present
      name: file.name,
      status: "done", // Set status to 'done' to show as uploaded in UI
      icon: <DeleteOutlined onClick={() => handleRemove(file)} />,
    })),
    onChange(info) {
      const { status, originFileObj, uid } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      // Check if fileList is not empty and contains files with uid
      if (info.fileList.length > 0) {
        const newFileList = info.fileList.slice(-1); // Keep only the last file
        setFileList(newFileList.map((file) => file.originFileObj));
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    beforeUpload(file) {
      if (fileList.length > 0) {
        message.error("You can only upload one file.");
        return Upload.LIST_IGNORE;
      }

      const isPdfOrDoc = file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const isLessThan25MB = file.size / 1024 / 1024 < 25;

      if (!isPdfOrDoc) {
        message.error(`${file.name} is not a supported file format (PDF or DOC/DOCX).`);
        return Upload.LIST_IGNORE;
      }

      if (!isLessThan25MB) {
        message.error(`${file.name} exceeds the 25MB file size limit.`);
        return Upload.LIST_IGNORE;
      }

      return true;
    },
    customRequest({ file, onSuccess }) {
      // Simulate a successful upload
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onRemove(file) {
      handleRemove(file);
    },
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={{ display: "inline-block", width: "100%" }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single file upload only.</p>
          {uploading && <Progress percent={progress} indicating size="small" active />}
        </Dragger>
      </div>
      {fileError && <Alert message="Warning" description="You must upload a document before proceeding." type="warning" showIcon style={{ marginTop: 20 }} />}
      <Button type="primary" onClick={handleUpload} disabled={uploading} loading={uploading} style={{ marginTop: 30 }}>
        {uploading ? "Uploading" : "Upload"}
      </Button>
      {uploadedFiles.length > 0 && (
        <div className="justify-content-start text-start" style={{ marginTop: 20 }}>
          <h4>Uploaded Files:</h4>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropFileInput;