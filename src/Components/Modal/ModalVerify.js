import React, {useState} from 'react'
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';
import { getToken } from '../../config/Constant';
import axios from 'axios';
import { MEMO_SERVICE_VERIFY_DOCUMENT } from '../../config/ConfigUrl';


const ModalVerify = ({showVerify, handleCloseVerify, selectedFileId, selectedFileName}) => {
  const [file, setFile] = useState(null);  

  const token = getToken();


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      Swal.fire("Error!", "Please select a file to verify.", "error");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    formDataToSend.append('fileId', selectedFileId);
    formDataToSend.append('fileName', selectedFileName);

    try {
      Swal.fire({
        title: "Loading...",
        text: "Please wait while we process your request.",
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${MEMO_SERVICE_VERIFY_DOCUMENT}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.status === 200) {
        if(response.data === 'signature verifies: true') {
          Swal.fire("Success!", "This file is autentic from DS.", "success");
        }else if(response.data === 'signature verifies: false') {
          Swal.fire("Error!", "This file is not autentic from DS.", "error");
        }
      } else {
        Swal.fire("Error!", "Failed to send file for verification", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "There was an error submitting the form.", "error");
    }
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  
  
  return (
    <>
      <Modal  show={showVerify} onHide={handleCloseVerify} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify Memo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className='row justify-content-center'>
            <Form.Group>
              <Form.Label>
                Nomor Surat:
              </Form.Label>
              <Form.Control
                type='text'
                value={selectedFileId}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Nama File:
              </Form.Label>
              <Form.Control
                type='text'
                value={selectedFileName}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>File Target:</Form.Label>
              <Form.Control
                type='file'
                onChange={handleFileChange}
              />
            </Form.Group>

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVerify}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalVerify