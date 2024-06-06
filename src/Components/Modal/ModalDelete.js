import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ModalDelete = ({ itemId, onDeleteSuccess }) => {
  const MySwal = withReactContent(Swal);

  const handleDelete = async (event) => {
    event.preventDefault();

    const confirmDelete = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(`/api/deleteItem/${itemId}`);
        console.log("Server response:", response.data);
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        onDeleteSuccess(itemId); // Callback to update UI after successful deletion
      } catch (error) {
        console.error("Error deleting item:", error);
        MySwal.fire({
          title: "Error!",
          text: "There was an error deleting the file.",
          icon: "error",
        });
      }
    }
  };

  return (
    <>
      <Button className="btn-btn-danger" variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  );
};

export default ModalDelete;
