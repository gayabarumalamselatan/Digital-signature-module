import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { getToken } from "../config/Constant";
import { MEMO_SERVICE_VIEW, MEMO_SERVICE_VIEW_PAGINATE } from "../config/ConfigUrl";


const MemoReport = () => {
  const [formData, setFormData] = useState({
    dueDate: "",
    statusMemo: "",
  });

  const [filteredData, setFilteredData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputError, setInputError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    if (isSubmitted) {
      fetchData();
    }
  }, [isSubmitted]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await axios.get(`${MEMO_SERVICE_VIEW}`, {
        headers: {
          Authorization:` Bearer ${token}`,
        },
        params: {
          due_date: formData.dueDate,
          status_memo: formData.statusMemo,
        },
      });

      setFilteredData(response.data);
      setSearchError(""); // Reset search error message if successful
    } catch (error) {
      console.error("Error fetching data: ", error);
      setSearchError("Error fetching data. Please try again."); // Set error message if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (formData.dueDate === "" || formData.statusMemo === "") {
      setInputError("Please fill in both fields.");
    } else {
      setInputError("");
      setIsSubmitted(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <section className="content-header pt-2">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="card-title">Memo Report</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/user">Home</a></li>
                <li className="breadcrumb-item active">View Memo</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <div className="content mx-3">
        <div className="card">
          <div className="container mt-4 row justify-content-between gap-5">
            <div className="mb-3 ms-5 col-md-5">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input type="date" className="form-control" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} />
            </div>
            <div className="mb-3 col-md-5" style={{ marginRight: "90px" }}>
              <label htmlFor="statusMemo" className="form-label">
                Status Memo
              </label>
              <select className="form-select" id="statusMemo" name="statusMemo" value={formData.statusMemo} onChange={handleChange}>
                <option value="">Select an option</option>
                <option value="ON_PROGRESS">ON_PROGRESS</option>
                <option value="PENDING">PENDING</option>
                <option value="REJECTED">REJECTED</option>
                <option value="REWORK">REWORK</option>
                <option value="APPROVE_BY_APPROVAL1">APPROVE_BY_APPROVAL1</option>
                <option value="APPROVE_BY_APPROVAL2">APPROVE_BY_APPROVAL2</option>
                {/* ... (other options) */}
              </select>
              <div className="mb-3 py-5 text-end">
                <Button label="Search" className="btn btn-primary text-end" onClick={handleSearch} />
              </div>
            </div>
          </div>
          {inputError && (
            <div className="container mt-4 row justify-content-between gap-5">
              <div className="col-md-5">
                <div className="alert alert-danger" role="alert">
                  {inputError}
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="card py-5 mt-5">
            <div className="ms-5 me-5">
              <p>Loading...</p>
            </div>
          </div>
        )}

        {searchError && (
          <div className="card py-5 mt-5">
            <div className="ms-5 me-5">
              <p>{searchError}</p>
            </div>
          </div>
        )}

        {isSubmitted && !isLoading && filteredData.length > 0 && (
          <div className="card py-5 mt-5">
            <div className="ms-5 me-5">
              <div className="table-responsive table-bordered">
                <table className="table table-bordered rounded-3 table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Title</th>
                      <th scope="col">Nomor</th>
                      <th scope="col">Requestor</th>
                      <th scope="col">Request Date</th>
                      <th scope="col">Request Title</th>
                      <th scope="col">Request Detail</th>
                      <th scope="col">Create Date</th>
                      <th scope="col">Due Date</th>
                      <th scope="col">Status Memo</th>
                      <th scope="col">User Approval 1 Note</th>
                      <th scope="col">User Approval 2 Note</th>
                      <th scope="col">User Approval 1 Name</th>
                      <th scope="col">User Approval 2 Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index}>
                        <td scope="row">{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.nomor}</td>
                        <td>{item.requestor}</td>
                        <td>{item.requestDate}</td>
                        <td>{item.requestTitle}</td>
                        <td>{item.requestDetail}</td>
                        <td>{item.createDate}</td>
                        <td>{item.dueDate}</td>
                        <td>{item.statusMemo}</td>
                        <td>{item.userApproval1Note}</td>
                        <td>{item.userApproval2Note}</td>
                        <td>{item.userApproval1Name}</td>
                        <td>{item.userApproval2Name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {isSubmitted && !isLoading && filteredData.length === 0 && !searchError && (
          <div className="card py-5 mt-5">
            <div className="ms-5 me-5">
              <p>Data not found.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MemoReport;
