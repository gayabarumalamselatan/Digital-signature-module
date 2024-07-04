import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { saveAs } from "file-saver";
import { Button } from "react-bootstrap";

const Signature = () => {
  const sigCanvas = useRef({});

  const clear = () => sigCanvas.current.clear();

  const handleSave = (format) => {
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL(`image/${format}`);
    const blob = dataURLToBlob(dataURL);
    saveAs(blob, `signature.${format}`);
  };

  const dataURLToBlob = (dataURL) => {
    const binary = atob(dataURL.split(",")[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: `image/png` });
  };

  const boxShadowStyle = {
    maxWidth:"500px",
  };

  const cardStyle = {
    borderRadius: "20px",
    boxShadow: "0px 0px 13px 0px rgba(0,0,0,0.58) inset",
    webkitBoxShadow: "0px 0px 13px 0px rgba(0,0,0,0.58) inset",
    mozBoxShadow: "0px 0px 13px 0px rgba(0,0,0,0.58) inset"
  };

  const cardBodyStyle = {
    borderRadius: "20px"
  }

  return (
    <div className="container mt-5 px-0">
      <div className="card" style={cardStyle} >
        <div className="card-body"  style={cardBodyStyle}>
          <h5 className="card-title">Signature Canvas</h5>
          <SignatureCanvas ref={sigCanvas} style={boxShadowStyle} canvasProps={{ width: 400, height: 150, className: "sigCanvas" }} />
          <div className="mt-3">
            <Button variant="danger" onClick={clear} style={{borderRadius:"15px"}} 
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#dc3545";
                e.target.style.border = "1px solid #dc3545";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#dc3545";
                e.target.style.color = "#fff";
                e.target.style.border = "1px solid transparent";
              }} >
              Clear
            </Button>
            <Button className="btn btn-primary ms-2" onClick={() => handleSave("png")}>
              Download  
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signature;