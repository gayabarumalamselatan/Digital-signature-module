import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "primereact/button";
import React, { useState } from "react";
import ModalsVV from "./Modals/ModalsVV";

const Report = () => {
  const [formData, setFormData] = useState({
    DueDate: "",
    Status: "",
  });

  const[data, setData] = useState([]);

  const fetchData = async () => {
    try{
      const response = await axios.get("/api/data");
      setFormData(response.data);
    }catch(error){
      console.error("Error fetching data: ", error);
    }
  }

  const [showDetails, setShowDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    try {
      const response = await axios.post("/api/submitReport", formData); // Ganti "/api/submitReport" dengan endpoint yang sesuai di server
      console.log("Server response:", response.data);

      // Tampilkan notifikasi atau informasi sukses jika diperlukan
      alert("Form submitted successfully!");

      setFormData({
        DueDate: "",
        Status: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleViewClick = (rowData) => {
    setSelectedRowData(rowData);
    setShowDetails(true);
  };

  const onHide = () => {
    setShowDetails(false);
  };

  return (
    <div className="container">
      <h3 className="text-start mb-3">Report</h3>
      <div className="card mb-3 mt-5 p-5 ">
        <div className="card">
          <div className="container mt-4 row justify-content-between gap-5">
            <div className="mb-3 ms-5 col-md-5">
              <label htmlFor="DueDate" className="form-label">
                Due Date
              </label>
              <input type="date" className="form-control" id="DueDate" name="DueDate" value={formData.DueDate} onChange={handleChange} />
            </div>
            <div className="mb-3 col-md-5" style={{ marginRight: "90px" }}>
              <label htmlFor="Status" className="form-label">
                Status
              </label>
              <select className="form-select col-4" id="Status" name="Status" value={formData.Status} onChange={handleChange}>
                <option value="">Select an option</option>
                <option value="Approve">Approve</option>
                <option value="Reject">Reject</option>
                <option value="Pending">Pending</option>
                {/* ... (opsi lainnya) */}
              </select>
              <div className="mb-3 col-12 p-5" style={{ marginLeft: "145px" }}>
                <Button label="Submit" className="btn btn-primary w-50" onClick={handleSubmit} />
              </div>
            </div>
          </div>
        </div>

        <div className="card py-5 mt-5">
          <div className="ms-5 me-5">
            <div className="table-responsive">
              <table className="table table-bordered rounded-3 table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Requestor</th>
                    <th scope="col">Request Date</th>
                    <th scope="col">Request Title</th>
                    <th scope="col">Request Detail</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">User Maker</th>
                    <th scope="col">User Approval 1</th>
                    <th scope="col">User Approval 2</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.map((item, index) => (
                      <tr key={index}>
                        <td scope="row">{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.requestor}</td>
                        <td>{item.requestDate}</td>
                        <td>{item.requestTitle}</td>
                        <td>{item.requestDetail}</td>
                        <td>{item.dueDate}</td>
                        <td>{item.userMaker}</td>
                        <td>{item.userApproval1}</td>
                        <td>{item.userApproval2}</td>
                        <td>{item.status}</td>
                        <td>
                          <ModalsVV />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
