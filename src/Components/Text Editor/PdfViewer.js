// import { Viewer, Worker } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Alert, Spinner } from "react-bootstrap";
// import { getToken } from "../../config/Constant";

// function PdfViewer() {
//   const defaultLayoutPluginInstance = defaultLayoutPlugin();
//   const [pdfFile, setPdfFile] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const token = getToken();
//   const headers = { 
//     Authorization: `Bearer ${token}`, 
//     Accept: "application/json", // Expecting JSON response for the first request
// };

// useEffect(() => {
//     const fetchFilePath = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get("http://10.8.135.84:18080/internal-memo-service/form/listFilePath?id=81", {
//                 headers
//             });

//             // Verify the response data is an array with filePath
//             console.log("Response data:", response.data);
//             if (response.data && response.data.length > 0 && response.data[0].filePath) {
//                 const filePath = response.data[0].filePath;
//                 fetchPdf(filePath);
//             } else {
//                 throw new Error("Invalid response structure");
//             }
//         } catch (error) {
//             console.error("Error fetching file path:", error);
//             setError("Error loading file path");
//             setLoading(false);
//         }
//     };

//     const fetchPdf = async (filePath) => {
//         try {
//             const pdfResponse = await axios.get(`http://10.8.135.84:18080${filePath}`, {
//                 responseType: "blob",
//                 headers: {
//                     Authorization: `Bearer ${token}`, 
//                     Accept: "application/pdf"
//                 }
//             });
//             console.log(pdfResponse);
//             // Verify the response data is a blob
//             console.log("PDF response data type:", pdfResponse.data.type); // Should be "application/pdf"
//             if (pdfResponse.data.type === "application/pdf") {
//                 const url = URL.createObjectURL(pdfResponse.data);
//                 // Verify the created URL
//                 console.log("Created PDF URL:", url);
//                 setPdfFile(url);
//             } else {
//                 throw new Error("Unexpected response type");
//             }
//         } catch (error) {
//             console.error("Error fetching PDF:", error);
//             setError("Error loading PDF");
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchFilePath();
// }, []);


    
  
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setPdfFile(url);
//       setFileName(file.name);
//       setError("");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <div className="card p-5">
//         <div className="p-3">
//           <h2>PDF Viewer</h2>
//         </div>
//         <div className="mb-3">
//           {/* Uncomment this section for file upload */}
//           {/* <label className="form-label" htmlFor="upload-pdf">
//             Upload PDF
//           </label>
//           <input className="form-control" type="file" accept=".pdf,.docx,.doc" onChange={handleFileUpload} id="upload-pdf" /> */}
//         </div>
//         {error && <Alert variant="danger">{error}</Alert>}
//         {loading ? (
//           <div className="d-flex justify-content-center">
//             <Spinner animation="border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//           </div>
//         ) : pdfFile ? (
//           <>
//             <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.2.146/build/pdf.worker.min.js">
//               <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
//             </Worker>
//             {/* Add download button or other actions if needed */}
//           </>
//         ) : (
//           "Loading PDF..."
//         )}
//       </div>
//     </div>
//   );
// }

// export default PdfViewer;



// Fetch pdf locally
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
        // Directly reference the sample.pdf file in the public directory
        const url = "/simple.pdf";
        setPdfFile(url);
        setFileName("simple.pdf");
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Error loading PDF");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card p-5">
        <div className="p-3">
          <h2>PDF Viewer</h2>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : pdfFile ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.2.146/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        ) : (
          "Loading PDF..."
        )}
      </div>
    </div>
  );
}

export default PdfViewer;





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


  // Upload File Manual 
  // import { Viewer, Worker } from "@react-pdf-viewer/core";
  // import "@react-pdf-viewer/core/lib/styles/index.css";
  // import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
  // import "@react-pdf-viewer/default-layout/lib/styles/index.css";
  // import axios from "axios";
  // import "bootstrap/dist/css/bootstrap.min.css";
  // import React, { useEffect, useState } from "react";
  // import { Alert, Spinner } from "react-bootstrap";
  
  // function PdfViewer() {
  //   const defaultLayoutPluginInstance = defaultLayoutPlugin();
  //   const [pdfFile, setPdfFile] = useState(null);
  //   const [fileName, setFileName] = useState("");
  //   const [error, setError] = useState("");
  //   const [loading, setLoading] = useState(false);
  
  //   useEffect(() => {
  //     const fetchPdf = async () => {
  //       setLoading(true);
  //       try {
  //         const url = ``;
  //         setPdfFile(url);
  //         setFileName("sample.pdf");
  //       } catch (error) {
  //         console.error("Error fetching PDF:", error);
  //         setError("Error loading PDF");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchPdf();
  //   }, []);
  
  //   const handleFileUpload = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const url = URL.createObjectURL(file);
  //       setPdfFile(url);
  //       setFileName(file.name);
  //       setError("");
  //     }
  //   };
  
  //   return (
  //     <>
  //       <div className="container mt-4">
  //         <div className="card p-5">
  //           <div className="mb-3">
  //             <label className="form-label" htmlFor="upload-pdf">
  //               Upload PDF
  //               <input
  //                 type="file"
  //                 className="form-control"
  //                 id="upload-pdf"
  //                 accept="application/pdf"
  //                 onChange={handleFileUpload}
  //               />
  //             </label>
  //           </div>
  //           {error && <Alert variant="danger">{error}</Alert>}
  //           {loading ? (
  //             <div className="d-flex justify-content-center">
  //               <Spinner animation="border" role="status">
  //                 <span className="visually-hidden">Loading...</span>
  //               </Spinner>
  //             </div>
  //           ) : pdfFile ? (
  //             <>
  //               <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.2.146/build/pdf.worker.min.js">
  //                 <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
  //               </Worker>
  //             </>
  //           ) : (
  //             "Loading PDF..."
  //           )}
  //         </div>
  //       </div>
  //     </>
  //   );
  // }
  
  // export default PdfViewer;
  