import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { getToken } from "../../config/Constant";
import { MEMO_SERVICE_LOAD_PDF } from "../../config/ConfigUrl";
  
  const token = getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  
  function PdfViewer({fileName, filePath}) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [pdfFile, setPdfFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const fetchPdf = async () => {
        setLoading(true);
        try {
          const url = `${MEMO_SERVICE_LOAD_PDF}?fileName=${encodeURIComponent(fileName)}&filePath=${encodeURIComponent(filePath)}`;
    
          const response = await axios.get(url, {
            headers,
            responseType: "blob",
          });
    
          const pdfUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          setPdfFile(pdfUrl);
        } catch (error) {
          console.error("Error fetching PDF:", error);
          setError("Error loading PDF");
        } finally {
          setLoading(false);
        }
      };
      fetchPdf();
    }, [fileName, filePath]);

    console.log('filename: ', fileName);
    console.log('filepath: ', filePath);

    return (
      <>
        <div className="container mt-4">
          <div className="card p-5">
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
              </>
            ) : (
              "Loading PDF..."
            )}
          </div>
        </div>
      </>
    );
  }
  
  export default PdfViewer;