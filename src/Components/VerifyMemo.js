import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { getToken } from '../config/Constant';
import { Button, Pagination } from 'react-bootstrap';
import ModalVerify from './Modal/ModalVerify';
import { MEMO_SERVICE_FILE_FILTER, MEMO_SERVICE_FILE_LISTS, MEMO_SERVICE_FILE_NAME } from '../config/ConfigUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCircleCheck } from '@fortawesome/free-solid-svg-icons';

const VerifyMemo = () => {
  const [data, setData] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [searchFilterValue, setSearchFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState({});
  const [selectedFileName, setSelectedFileName] = useState({});

    // Pagination properties
    const pageCount = Math.ceil(totalItem / pageSize);
    const startIndex = currentPage * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalItem);

  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };


  useEffect(() => {
    fetchData();
  },[])


  const fetchData = async () => {
    try {
      let requestUrl;
      let urlParams;

      if (searchFilter !== "" && searchFilterValue !== "") {
        if (searchFilter === "nomor") {
          urlParams =`fileId=${encodeURIComponent(searchFilterValue)}`
          requestUrl = `${MEMO_SERVICE_FILE_FILTER}?${urlParams}`;
        } else if (searchFilter === "fileName") {
          urlParams = `fileName=${encodeURIComponent(searchFilterValue)}`;
          requestUrl = `${MEMO_SERVICE_FILE_NAME}?${urlParams.toString()}`;
        }
      } else {
        requestUrl = `${MEMO_SERVICE_FILE_LISTS}`;
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


  const handleVerifyClick = (fileId, fileName) => {
    setShowVerifyModal(true);
    setSelectedFileId(fileId);  
    setSelectedFileName(fileName);
  };

  const handleCloseVerify = () => {
    setShowVerifyModal(false);
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


  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0); // Kembalikan ke halaman pertama setelah mengubah ukuran halaman
    fetchData(); 
  };


  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setCurrentPage(newPage);
     // Ensure data is fetched after the page change
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


  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Verify Memo</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Verify Memo</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content mx-3">
        <div className="card">
          <div className="col-12">
            <div className="card-header" style={{ background: "transparent" }}>
              <h3 className="card-title mt-2">File List</h3>
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
                        <option value="fileName">File Name</option>
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
                      <th scope='col'>Memo Number</th>
                      <th scope='col'>File Name</th>
                      <th scope='col'>File Type</th>
                      <th scope='col'>File Path</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{item.fileId}</td>
                        <td>{item.fileName}</td>
                        <td>{item.fileType}</td>
                        <td>{item.filePath}</td>
                        <td>
                          <div>
                            <Button variant='secondary' onClick={() => handleVerifyClick(item.fileId, item.fileName)}>
                              <FontAwesomeIcon icon={faFileCircleCheck}/>
                            </Button>
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
        {showVerifyModal && 
          <ModalVerify 
            showVerify={showVerifyModal} 
            handleCloseVerify={handleCloseVerify}
            selectedFileId={selectedFileId}
            selectedFileName={selectedFileName}
          />
        }
      </section>
    </>
  )
}

export default VerifyMemo