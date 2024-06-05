import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function ModalsView() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        View
      </Button>

      <Modal className="modal-xl" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h2>View</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="my-4">
            <ul className="row">
              <p className="col-sm-3">Trade ID</p>
              <p className="col-sm-9">: pppp</p>
            </ul>
            <ul className="row">
              <p className="col-sm-3">Currency</p>
              <p className="col-sm-9">: qwertyuiop</p>
            </ul>
            <ul className="row">
              <p className="col-sm-3">Product Type</p>
              <p className="col-sm-9">: qwertyuiop</p>
            </ul>
            <ul className="row">
              <p className="col-sm-3">Bank Code</p>
              <p className="col-sm-9">: qwertyuiop</p>
            </ul>
            <ul className="row">
              <p className="col-sm-3">Counter Party</p>
              <p className="col-sm-9">: qwertyuiop</p>
            </ul>
            <ul className="row">
              <p className="col-sm-3">Bank Account Nostro</p>
              <p className="col-sm-9">: qwertyuiop</p>
            </ul>
            <ul className="row">
              <p className="col-sm-3">Counter Party Nostro</p>
              <p className="col-sm-9">: qwertyuiop</p>
            </ul>
            <ul className="row">
              <p className="col-sm-3">Counter Party Account</p>
              <p className="col-sm-9">: qwertyuiop</p>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalsView;
