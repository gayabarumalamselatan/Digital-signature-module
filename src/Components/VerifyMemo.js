import React, {useState} from 'react'
import Swal from 'sweetalert2';


const VerifyMemo = () => {
    
  
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
                <li className="breadcrumb-item active">Verify</li>
              </ol>
            </div>
          </div>    
        </div>
      </section>

      <section className='content'>
        <div className='card mx-3 px-4 py-5'>
          <form className='form-group'>
            <div className='row mb-2'>
              <label className='col-2 col-form-label'>
                Nomor Surat:
              </label>
              <div className='col-10'>
                <input 
                type="text" 
                className="form-control"
              />
              </div>
            </div>

            <div className='row mb-2'>
              <label className='col-2 col-form-label'> 
                Choose File: 
              </label>
              <div className='col-10'>
                <div class="input-group">
                  <input 
                    type="file" 
                    accept='application/pdf' 
                    className="form-control" 
                    aria-label="Upload"
                    style={{border: "1px solid #00052E", borderRadius: "10px"}}
                  />
                </div>
              </div>
            </div>
            <div className='d-flex text-end justify-content-end mt-3'>
              <button type="button" className="btn btn-secondary me-2" >Cancel</button>
              <button type="button" className="btn btn-primary">Verify</button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default VerifyMemo