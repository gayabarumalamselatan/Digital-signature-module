import React, {useState} from 'react'
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';


const ModalVerify = ({showVerify, handleCloseVerify, selectedFileId, selectedFileName}) => {
    
  // const requiredForm = () => { 
  //   const requiredField = [
  //     'nomorSurat', 'fileSurat'
  //   ];

  //   const newErrors = {};

  //   requiredField.forEach(field => {
  //     if (!formData[field]) newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required!`;
  //   });
  // };

  
  
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
              />
            </Form.Group>

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVerify}>
            Cancel
          </Button>
          <Button variant="primary">
            Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalVerify