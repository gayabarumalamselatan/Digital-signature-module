import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    Signature: "",
  });

  const sigCanvas = useRef(null);

  const clear = () => {
    sigCanvas.current.clear();
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const save = () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Please provide a signature first.");
    } else {
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      console.log(dataURL);
      // You can send the dataURL to your backend server for saving the signature
    }
  };

  return (
    <>
      <h3>Enter Signature</h3>
      <div style={{ border: "1px solid black", width: 500, height: 200, borderRadius: 15 }}>
        <SignatureCanvas id="Signature" name="Signature" value={formData.Signature} onChange={handleChange} ref={sigCanvas} penColor="black" canvasProps={{ width: 500, height: 200, className: "sigCanvas" }} />
      </div>

      <div>
        <button className="btn btn-secondary" onClick={clear}>
          Clear
        </button>
        <button className="btn btn-primary" onClick={save}>
          Save
        </button>
      </div>
    </>
  );
};

export default SignaturePad;
