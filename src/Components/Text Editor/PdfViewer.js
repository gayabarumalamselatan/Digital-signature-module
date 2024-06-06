// import React, { useState, useEffect } from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import axios from "axios";

// function PdfViewer() {
//   const defaultLayoutPluginInstance = defaultLayoutPlugin();
//   const [pdfFile, setPdfFile] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchPdf = async () => {
//       try {
//         const response = await axios.get("https://pdfobject.com/pdf/sample.pdf", {
//           //can use server url
//           responseType: "blob", // Important to get the file as a blob
//         });
//         setPdfFile(URL.createObjectURL(response.data));
//       } catch (error) {
//         console.error("Error fetching PDF:", error);
//         setError("Error loading PDF");
//       }
//     };

//     fetchPdf();
//   }, []);

//   return (
//     <div className="container">
//       <div className="viewer mt-4">
//         {pdfFile ? (
//           <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js">
//             <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
//           </Worker>
//         ) : (
//           <>{error || "Loading PDF..."}</>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PdfViewer;

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";

function PdfViewer() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://pdfobject.com/pdf/sample.pdf", {
          responseType: "blob",
        });
        const url = URL.createObjectURL(response.data);
        setPdfFile(url);
        setFileName("sample.pdf");
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Error loading PDF");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfFile(url);
      setFileName(file.name);
      setError("");
    }
  };

  // const downloadPdf = () => {
  //   if (pdfFile) {
  //     const link = document.createElement("a");
  //     link.href = pdfFile;
  //     link.download = fileName;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

  return (
    <div className="container mt-4">
      <div className="card p-5">
        <div className="p-3">
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="upload-pdf">
            {/* Upload PDF */}
          </label>
          {/* <input className="form-control" type="file" accept=".pdf,.docx,.doc" onChange={handleFileUpload} id="upload-pdf" /> */}
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : pdfFile ? (
          <>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.2.146/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
            {/* <div className="mt-3 d-flex justify-content-between">
              <Button variant="primary" onClick={downloadPdf}>
                Download PDF
              </Button>
            </div> */}
          </>
        ) : (
          "Loading PDF..."
        )}
      </div>
    </div>
  );
}

export default PdfViewer;
