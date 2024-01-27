import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import btn from "../../components/btn.module.css";
import AlertBox from "../../components/AlertBox";

import {
  employerList as getList,
  verifyEmployer,
} from "../../services/admin.service";

function EmployerList() {
  const [alertKey, setAlertKey] = useState(0);

  const showAlert = () => {
    setAlertKey((prevKey) => prevKey + 1);
  };

  const [data, setData] = useState([]);

  const [msg, setMsg] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [sendData, setSendData] = useState({});

  const { user } = useSelector((state) => ({ ...state }));

  const handleCancle = () => {
    setConfirmModal(false);
  };
  const handleConfirm = async () => {
    setConfirmModal(false);
    // console.log(user.id);

    await verifyEmployer(user.user.token, sendData)
      .then((res) => {
        setMsg(
          `Employer ID ${sendData.employer_id}: status => ${sendData.status}`
        );
      })
      .catch((err) => {
        console.error("Failed to update user status", err);
      });
    //เเก้เเล้วให้มันเเสดงค่าปัจจุบัน
    setData((prevUsers) =>
      prevUsers.map((user, index) =>
        user.employer_id === sendData.employer_id
          ? { ...user, status: sendData.status }
          : user
      )
    );

    showAlert(); //
  };

  const handleStatusChange = async (employer_id, newStatus) => {
    setConfirmModal(true);

    setSendData({
      employer_id: employer_id,
      status: newStatus,
    });
  };

  useEffect(() => {
    loadData(user.user.token);
  }, []);

  const loadData = async (authtoken) => {
    // get employer list in model
    await getList(authtoken)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h3>บริษัท/หน่วยงาน</h3>

      <br />

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">ลำดับ</th>
              <th scope="col">ชื่อบริษัท/หน่วยงาน</th>
              <th scope="col">ที่อยู่</th>
              <th scope="col">ชื่อผู้ติดต่อ</th>
              <th scope="col">อีเมลติดต่อ</th>
              <th scope="col">เบอร์ติดต่อ</th>
              <th scope="col">ชื่อผู้ใช้</th>
              <th scope="col">id</th>
              <th scope="col">สถานะ</th>
              <th scope="col">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {data
              ? data.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.company_name}</td>
                    <td>{item.address}</td>
                    <td>{item.contact_name}</td>
                    <td>{item.contact_email}</td>
                    <td>{item.contact_tel}</td>
                    <td>{item.username}</td>
                    <td>{item.employer_id}</td>
                    <td>
                      <select
                        className="form-select from-select-sm"
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.employer_id, e.target.value)
                        }
                      >
                        <option value="verified">verified</option>
                        <option value="notverify">notverify</option>
                      </select>
                    </td>
                    <td>ACTION</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      {msg ? <h3 className="text-muted">{msg}</h3> : <></>}

      <div
        className={`modal fade ${confirmModal ? "show" : ""}`}
        tabIndex={-1}
        role="dialog"
        style={{ display: confirmModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {`ยืนยันการเปลี่ยนสถานะ`}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCancle}
              ></button>
            </div>
            <div className="modal-body">
              {" "}
              {`ยืนยันการเปลี่ยนสถานะเป็น ${sendData.status} ?`}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={`${btn.btn_blue}`}
                onClick={handleConfirm}
              >
                ยืนยัน
              </button>
              <button
                type="button"
                className={`${btn.btn_grey}`}
                onClick={handleCancle}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>

      <Link to={"/admin"}>Back</Link>

      {msg ? <AlertBox key={alertKey} message={msg} duration={3000} /> : <></>}
    </>
  );
}

export default EmployerList;
