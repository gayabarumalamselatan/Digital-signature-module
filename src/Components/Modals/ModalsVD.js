// import { Modal, Button } from "react-bootstrap";
// import { useState } from "react";

// function ModalsVD() {
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   return (
//     <>
//       <Button className="ms-2 me-2" variant="danger" onClick={handleShow}>
//         Delete
//       </Button>

//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure want to delete this data?</Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleClose}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

// export default ModalsVD;

import React from "react";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import withReactContent from "sweetalert2-react-content";

const ModalsVD = () => {
  const MySwal = withReactContent(Swal);

  const handleDelete = async (event) => {
    event.preventDefault();

    const Delete = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  return (
    <>
      <Button className="btn-btn-danger" variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  );
};

export default ModalsVD;
