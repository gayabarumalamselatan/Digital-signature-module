import React, { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { saveAs } from "file-saver";
import { Button } from "react-bootstrap";

const Signature = ({getSignature, signatureBlob}) => {
  const sigCanvas = useRef({});

  // useEffect(() => {
  //   if (signatureBlob) {
  //     sigCanvas.current.fromDataURL(signatureBlob);
  //   }
  // }, [signatureBlob]);

useEffect( () => {
  handleSave();
},[]);  
  


  // const handleSave = (format) => {
  //   const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL(`image/${format}`);
  //   const blob = dataURLToBlob(dataURL);
  //   saveAs(blob, `signature.${format}`);
  // };


  const clear = () => sigCanvas.current.clear();

  const handleSave = () => {
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    //const base64Signature = dataURLToBlob(dataURL);
    const blob = dataURLToBlob(dataURL);
    //const base64Signature = btoa(String.fromCharCode(...new Uint8Array(blob)));
    const base64Signature = dataURL.split(",")[1];
    getSignature(base64Signature);
  };

  const dataURLToBlob = (dataURL) => {
    const binary = atob(dataURL.split(",")[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "image/png" });
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
    <div className="container px-0">
      <div className="card" style={cardStyle} >
        <div className="card-body"  style={cardBodyStyle}>
          <h5 className="card-title">Signature Canvas</h5>
          <SignatureCanvas ref={sigCanvas} style={boxShadowStyle} canvasProps={{ width: 400, height: 150, className: "sigCanvas" }} />
          <div className="d-flex mt-3">
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
            {/* <Button className="btn btn-primary ms-2" onClick={handleSave}>
              Download  
            </Button> */}
            <div className="ms-auto text-end mt-auto">
            {/* <p className="text-end me-2 mb-0 text-danger">(Optional)</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signature;