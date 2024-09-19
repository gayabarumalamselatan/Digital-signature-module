import axios from "axios";
import React, { useEffect, useState, } from "react";
import ModalEdit from './Modal/ModalEdit'
import { getToken, getUserName, getUserId } from "../config/Constant";
import Swal from "sweetalert2";
import { Pagination } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { MEMO_SERVICE_DELETE, MEMO_SERVICE_DOWNLOAD_DONE, MEMO_SERVICE_SEARCH_NOMOR_SURAT, MEMO_SERVICE_SEARCH_TITLE_SURAT, MEMO_SERVICE_VIEW, MEMO_SERVICE_VIEW_BASED_ON_USER, MEMO_SERVICE_VIEW_PAGINATE } from "../config/ConfigUrl";
import { text } from "@fortawesome/fontawesome-svg-core";


const ViewMemo = () => {
  const [data, setData] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchFilter, setSearchFilter] = useState("");
  const [searchFilterValue, setSearchFilterValue] = useState("");
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const MySwal = withReactContent(Swal);

  // Buat get token & userid
  const token = getToken();
  const [userName, setUserName] = useState(getUserName());
  //const userId = getUserId();
  

  // Buat ngambil token buat postman
  // Apus klo app udah jadi
  //const ngegettoken = sessionStorage.getItem('accessToken');
  // console.log('token', ngegettoken);
  // console.log('userId', userId);
  // console.log('UserName',userName);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const intervalId = setInterval(()=>{
      const newUserName = getUserName();
      if(newUserName !== userName){
        setUserName(newUserName);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(()=>{
    fetchData();
  },[currentPage, pageSize]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };


  // Classic get method, show all data
  // const fetchData = async ()=> {
  //   try{
  //     const response = await axios.get(`${MEMO_SERVICE_VIEW}`, {headers});
  //     setData(response.data);
  //   }catch(error){
  //     console.error('error', error);
  //   }
  // }

  //Descending order (Id dari data terbaru)
  const fetchData = async () => {
    try {
      let requestUrl;
      let urlParams;

      if (searchFilter !== "" && searchFilterValue !== "") {
        if (searchFilter === "nomor") {
          urlParams =`noSurat=${searchFilterValue}`
          requestUrl = `${MEMO_SERVICE_SEARCH_NOMOR_SURAT}?${urlParams}`;
        } else if (searchFilter === "title") {
          urlParams = `title=${searchFilterValue}`;
          requestUrl = `${MEMO_SERVICE_SEARCH_TITLE_SURAT}?${urlParams}`;
        }
      } else {
        requestUrl = `${MEMO_SERVICE_VIEW_BASED_ON_USER}?userName=${userName}`;
      }

      console.log("Request URL:", requestUrl);

      const response = await axios.get(requestUrl, { headers });
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      setData(sortedData);
      setTotalItem(response.data.totalItems);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const downloadDoneMemo = async (nomor) => {
    try{
      const response = await axios.get(`${MEMO_SERVICE_DOWNLOAD_DONE}?fileId=${nomor}`, {
        headers, 
        responseType: 'arraybuffer'
      });
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memo-${nomor}.pdf`; // Assuming the file is a PDF
      a.click();
    }catch(error){
      console.error('error', error);
    }
  };


  // Urutan Ascending (Id dari 1)
  // const fetchData = async () => {
  //   try {
  //     let urlParams;
  
  //     if (searchFilter !== "" && searchFilterValue !== "") {
  //       urlParams = `size=${pageSize}&page=${currentPage}&${searchFilter}=${searchFilterValue}`;
  //     } else { 
  //       urlParams = `size=${pageSize}&page=${currentPage}`;
  //     }
  
  //     const requestUrl = `http://10.8.135.84:18080/internal-memo-service/form/list/get-userName?userName=${userName}`;
  //     console.log("Request URL:", requestUrl);
  
  //     const response = await axios.get(`http://10.8.135.84:18080/internal-memo-service/form/list/get-userName?userName=${userName}`, { headers });
  //     //const sortedData = response.data.internalMemo.sort((a, b) => b.id - a.id); // Sort data on the frontend
  //     setData(response.data);
  //     setTotalItem(response.data.totalItems);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //   }
  // };
  
  const getStatusMemoColor = (statusMemo) => {
    switch (statusMemo) {
      case "REJECTED":
        return "#dc3545";
      case "PENDING":
      case "ON_PROGRESS":
      case "REWORK":
      case "APPROVE_BY_APPROVAL1":
      case "APPROVE_BY_APPROVAL2":
        return "#ffc107";
      case "DONE":
        return "#198754";
      default:
        return "";
    }
  };

  const durationColor = (approvalDate, dueDate) => {
    if (new Date(approvalDate) > new Date(dueDate)) {
      return "#dc3545";
    } else if (new Date(approvalDate) < new Date(dueDate)) {
      return "#198754"; 
    } else if (new Date(approvalDate) === new Date(dueDate)) {
      return "#198754"; // 
    } else {
      return "";
    }
  };

  const deleteData = async (id) => {
    try {
      const data = { id };
      const response = await axios.delete(`${MEMO_SERVICE_DELETE}`, { headers, data });
      return response.data;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  };

  const removeData = async (item) => {
    // const {nomor} = item;
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: `${item.nomor} will be deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        console.log(item);
        await deleteData(item.id);
        fetchData();
        MySwal.fire("Deleted!", `${item.nomor} has been deleted.`, "success");
      } catch (error) {
        console.error(error);
        MySwal.fire("Error!", "There was an error deleting the item.", "error");
      }
    }
  };

  const handleEditClick = (memo) => {
    setSelectedMemo(memo);
    setShowEditModal(true);
  };

  // Pagination properties
  const pageCount = Math.ceil(totalItem / pageSize);
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalItem);

  // Handle logic
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setCurrentPage(newPage);
     // Ensure data is fetched after the page change
    }
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0); // Kembalikan ke halaman pertama setelah mengubah ukuran halaman
    fetchData(); // Ensure data is fetched after the page size change
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      fetchData();
    }
  };

  const handleResetTable = () => {
    setSearchFilter("");
    setSearchFilterValue("");
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      fetchData();
    }
  };

  // Pagination Logic

  const renderPaginationItems = () => {
    const paginationItems = [];

    if (pageCount <= 5) {
      // If there are less than or equal to 5 pages, render all page numbers.
      for (let i = 0; i < pageCount; i++) {
        paginationItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i + 1}
          </Pagination.Item>
        );
      }
    } else {
      // If there are more than 5 pages, include ellipsis.
      const startPage = Math.max(0, currentPage - 2);
      const endPage = Math.min(pageCount - 1, currentPage + 2);

      if (startPage > 0) {
        paginationItems.push(
          <Pagination.Item key="start" onClick={() => handlePageChange(0)}>
            1
          </Pagination.Item>
        );

        if (startPage > 1) {
          paginationItems.push(<Pagination.Ellipsis key="start-ellipsis" />);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        paginationItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i + 1}
          </Pagination.Item>
        );
      }

      if (endPage < pageCount - 1) {
        if (endPage < pageCount - 2) {
          paginationItems.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }

        paginationItems.push(
          <Pagination.Item
            key="end"
            onClick={() => handlePageChange(pageCount - 1)}
          >
            {pageCount}
          </Pagination.Item>
        );
      }
    }

    return paginationItems;
  };

  const allowedButtons = ['digital_signature_admin'];


  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>View Memo</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">View Memo</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content mx-3">
        <div className="card">
          <div className="col-12">
            <div className="card-header" style={{ background: "transparent" }}>
              <h3 className="card-title mt-2">View</h3>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-6">
                  <form className="form-inline">
                    <div className="input-group">
                      <select
                        className="form-control"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        style={{ marginRight: "5px" }}
                      >
                        <option value="">Choose Filter</option>
                        <option value="nomor">Nomor</option>
                        <option value="title">Title</option>
                      </select>
                      <input
                        type="text"
                        className="form-control"
                        value={searchFilterValue}
                        onChange={(e) => setSearchFilterValue(e.target.value)}
                        placeholder="Search"
                        style={{ marginRight: "5px" }}
                      />
                      <div className="input-group">
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ marginRight: "5px" }}
                          onClick={handleResetTable}
                        >
                          Reset
                        </button>
                      </div>
                      <div className="input-group">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleSearchSubmit}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
               
                <div className="col-6 d-flex justify-content-end align-items-center">
                  <label htmlFor="pageSizeSelect" className="me-2">
                    Rows per page:
                  </label>
                    <select
                      className="form-form-select form-select-sm"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                
              </div>
              <div className="table-responsive">
                <table className="table table-bordered rounded-3 table-striped border-bottom" >
                  <thead style={{position: "sticky"}}>
                    <tr>
                      {/* Kolom id apus klo app udah jadi */}
                      <th scope="col">#</th>
                      <th scope="col">Title</th>
                      <th scope="col">Nomor</th>
                      <th scope="col">Requestor</th>
                      <th scope="col">Request Date</th>
                      <th scope="col">Request Title</th>
                      <th scope="col">Request Detail</th>
                      <th scope="col">Tipe Dokumen</th>
                      <th scope="col">Create Date</th>
                      <th scope="col">Due Date</th>
                      <th scope="col">Status Memo</th>
                      <th scope="col">User Maker</th>
                      <th scope="col">User Approval 1 Note</th>
                      <th scope="col">User Approval 2 Note</th>
                      <th scope="col">User Approval 1 Name</th>
                      <th scope="col">User Approval 2 Name</th>
                      <th scope="col">User Approval 1 Date</th>
                      <th scope="col">User Approval 2 Date</th>
                      <th scope="col">User Approval 1 Duration</th>
                      <th scope="col">User Approval 2 Duration</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{item.title}</td>
                        <td>{item.nomor}</td>
                        <td>{item.requestor}</td>
                        <td>{formatDate(item.requestDate)}</td>
                        <td>{item.requestTitle}</td>
                        <td>{item.requestDetail}</td>
                        <td>{item.tipeDokumen}</td>
                        <td>{formatDate(item.createDate)}</td>
                        <td>{formatDate(item.dueDate)}</td>
                        <td style={{color: getStatusMemoColor(item.statusMemo)}}>{item.statusMemo}</td>
                        <td>{item.userMaker}</td>
                        <td>{item.userApproval1Note}</td>
                        <td>{item.userApproval2Note}</td>
                        <td>{item.userApproval1Name}</td>
                        <td>{item.userApproval2Name}</td>
                        <td>{formatDate(item.userApproval1Date)}</td>
                        <td>{formatDate(item.userApproval2Date)}</td>
                        <td style={{ 
                          color: durationColor(item.userApproval1Date, item.dueDate, item.durationApproval1) 
                        }}>
                          {item.durationApproval1?.includes("-") ? item.durationApproval1.split('-').join('') : item.durationApproval1 ?? ""}
                        </td>
                        <td style={{ 
                          color: durationColor(item.userApproval2Date, item.dueDate, item.durationApproval2)
                        }}>
                          {item.durationApproval2?.includes("-") ? item.durationApproval2.split('-').join('') : item.durationApproval2 ?? ""}
                        </td>
                        <td>
                          <div>
                            <button className="btn btn-outline-primary mx-2" onClick={() => handleEditClick(item)}>
                              <FontAwesomeIcon icon={faEdit}/>
                            </button>
                            {allowedButtons.includes(userName)? 
                              (
                                <>
                                  <button className="btn btn-outline-danger me-2" onClick={() => removeData(item)}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                  </button> 
                                </> 
                              ) : (
                                <></>
                              )
                            }
                            {item.statusMemo === 'DONE' ? 
                            (
                              <>
                                <button className="btn btn-outline-success me-2" onClick={() => downloadDoneMemo(item.nomor)} style={{backgroundColor: "#198754", borderColor: "#198754"}}>
                                  <FontAwesomeIcon icon={faDownload}/>
                                </button> 
                              </>
                            ):(
                              <></>
                            )
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  Showing {Math.min(startIndex, totalItem)} to {Math.min(endIndex, totalItem)} of {totalItem} entries
                </div>
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  />
                  {renderPaginationItems()}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pageCount - 1}
                  />
                </Pagination>
              </div>
            </div>
          </div>
        </div>
        {selectedMemo && 
          <ModalEdit 
            show={showEditModal} 
            handleClose={() => setShowEditModal(false)} 
            memo={selectedMemo} 
            fetchData = {fetchData}
          />
        }
      </section>
    </>
  );
};

export default ViewMemo;

