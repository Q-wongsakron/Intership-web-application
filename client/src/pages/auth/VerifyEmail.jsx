import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("id");
  const token = searchParams.get("token");
  const [verified, setVerified] = useState(false);
  const user = useSelector((state) => state.user);
  console.log(userId)
  useEffect(() => {
    (async () => {
        if (user.user.isVerified) {
            setTimeout(() => {
              return navigate("/employer/profile");
            }, 3000);
          } else{
            if (token) {
            //post request
            setIsLoading(true);
            
            const response = await axios.post(
                import.meta.env.VITE_APP_API + `/verify-email`,
                {token, userId}
            );

            if (response.data.success === false) {
              setVerified(false);
              setError(response.data.message);
              toast.error(response.data.message, {
                autoClose: 5000,
                position: "top-right",
                onClose: () => {
                  // Navigate to ("/employer/profile") and refresh the page when the toast is closed
                  window.location.href = "/";
                }
              });
            } else {
              setVerified(true);
              toast.success(response.data.message, {
                autoClose: 5000,
                position: "top-right",
                onClose: () => {
                  // Navigate to ("/employer/profile") and refresh the page when the toast is closed
                  window.location.href = "/";
                }
              });
            }

            setIsLoading(false);
            console.log("res", response);

            // if (response.error) {
            //     return setError(response);
            // }

            //updateUser(response);
            }
        }
    })();
  }, [token, userId]);

  return (
    <div>
      {isLoading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {verified ? (
            <div>
              <Alert severity="success">
                Email successfuly verified, redirecting...
              </Alert>
            </div>
          ) : (
            <div>
              
                <Alert severity="error">{error}</Alert>
              
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
