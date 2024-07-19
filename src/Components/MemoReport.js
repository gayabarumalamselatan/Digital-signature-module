import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { getToken } from "../config/Constant";
import { MEMO_SERVICE_VIEW, MEMO_SERVICE_VIEW_PAGINATE } from "../config/ConfigUrl";
import * as XLSX from 'xlsx';
import { FaDownload, FaSyncAlt} from "react-icons/fa"

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
        // params: {
        //   due_date: formData.dueDate,
        //   status_memo: formData.statusMemo,
        // },
      });
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      setFilteredData(sortedData);
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

  const handleRefresh = () => {
    fetchData();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentDateTime = () => {
    const date = new Date();
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
  };

  const exportToXLS = () => {
    if (!filteredData || filteredData.length === 0) {
        alert("No data available to export");
        return;
    }
    
    const worksheetData = [
        [
            "Title",
            "NOMOR",
            "REQUESTOR",
            "REQUEST DATE",
            "REQUEST TITLE",
            "REQUEST DETAIL",
            "CREATED DATE",
            "DUE DATE",
            "STATUS MEMO",
            "USER APPROVAL 1 NOTE",
            "USER APPROVAL 2 NOTE",
            "USER APPROVAL 1 NAME",
            "USER APPROVAL 2 NAME",
        ],
        ...filteredData.map(row => [
            row.title,
            row.nomor,
            row.requestor,
            row.requestDate,
            row.requestTitle,
            row.requestDetail,
            formatDate(row.createDate),
            formatDate(row.dueDate),
            row.statusMemo,
            row.userApproval1Note,
            row.userApproval2Note,
            row.userApproval1Name,
            row.userApproval2Name,
        ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const fileName = `MemoReportToday_${getCurrentDateTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className>Memo Report</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/user">Home</a></li>
                <li className="breadcrumb-item active">Memo Report</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <div className="content">
        <div className="card mx-3 px-4 pt-4">
          <div className=" row ">
            <div className="col-6">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input type="date" className="form-control" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} />
            </div>

            <div className="col-6">
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
          
          <div className="card card-default mx-3">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-md-12">
                  <div className="col-md-12 d-flex justify-content-end align-items-center">
                    <div className="btn-group ml-2">
                      <button
                          type="button"
                          className="btn btn-default"
                          onClick={handleRefresh}
                      >
                          <FaSyncAlt />
                      </button>
                      <div className="dropdown">
                        <button className="btn btn-default dropdown-toggle" type="button" id="downloadDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <FaDownload /> Download
                        </button>
                        <div className="dropdown-menu" aria-labelledby="downloadDropdown">
                            <button className="dropdown-item" onClick={exportToXLS}>Download XLS</button>
                            {/* <button className="dropdown-item" onClick={exportToCSV}>Download CSV</button>
                            <button className="dropdown-item" onClick={downloadFileXls}>All Data XLS</button>
                            <button className="dropdown-item" onClick={downloadFileCsv}>All Data CSV</button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="mx-2">
                <div className="table-responsive table-bordered">
                  <table className="table table-bordered rounded-3 table-striped border-bottom">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Id</th>
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
                          <td>{item.id}</td>
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
