// import React from "react";
// import ModalsVD from "../components/Modals/ModalsVD.js";
// import ModalsVE from "../components/Modals/ModalsVE.js";
// import ModalsVV from "../components/Modals/ModalsVV.js";
// import "../components/styling/View.css";

// const View = () => {
//   return (
//     <div className="container">
//       <h3 className="text-start mb-3">View</h3>
//       <div className="card">
//         <div className="card-body p-5">
//           <div className="table-responsive">
//             <table class="table table-bordered  rounded-3 table-striped">
//               <thead>
//                 <tr>
//                   <th scope="col">#</th>
//                   <th scope="col">Title</th>
//                   <th scope="col">Requestor</th>
//                   <th scope="col">Request Date</th>
//                   <th scope="col">Request Title</th>
//                   <th scope="col">Request Detail</th>
//                   <th scope="col">Due Date</th>
//                   <th scope="col">User Maker</th>
//                   <th scope="col">User Approval 1</th>
//                   <th scope="col">User Approval 2</th>
//                   <th scope="col">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <th scope="row">1</th>
//                   <td>Mark</td>
//                   <td>Otto</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td className="gap-2">
//                     <ModalsVE />
//                     <ModalsVD />
//                     <ModalsVV />
//                   </td>
//                 </tr>
//                 <tr>
//                   <th scope="row">2</th>
//                   <td>Jacob</td>
//                   <td>Thornton</td>
//                   <td>@fat</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>
//                     <ModalsVE />
//                     <ModalsVD />
//                     <ModalsVV />
//                   </td>
//                 </tr>
//                 <tr>
//                   <th scope="row">3</th>
//                   <td>Larry the Bird</td>
//                   <td>@twitter</td>
//                   <td>@twitter</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>@mdo</td>
//                   <td>
//                     <ModalsVE />
//                     <ModalsVD />
//                     <ModalsVV />
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default View;

import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalsVD from "../components/Modals/ModalsVD.js";
import ModalsVE from "../components/Modals/ModalsVE.js";
import ModalsVV from "../components/Modals/ModalsVV.js";
import "../components/styling/View.css";

const View = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/data"); // Ganti dengan endpoint yang sesuai
      setData(response.data); // Menyimpan data dari respons ke state data
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <div className="container">
      <h3 className="text-start mb-3">View</h3>
      <div className="card">
        <div className="card-body p-5">
          <div className="table-responsive">
            <table className="table table-bordered  rounded-3 table-striped">
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
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.title}</td>
                    <td>{item.requestor}</td>
                    <td>{item.requestDate}</td>
                    <td>{item.requestTitle}</td>
                    <td>{item.requestDetail}</td>
                    <td>{item.dueDate}</td>
                    <td>{item.userMaker}</td>
                    <td>{item.userApproval1}</td>
                    <td>{item.userApproval2}</td>
                    <td className="gap-2">
                      <ModalsVE />
                      <ModalsVD />
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
  );
};

export default View;
