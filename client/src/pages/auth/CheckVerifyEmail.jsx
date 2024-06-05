import { useContext } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux/es/hooks/useSelector";

const CheckVerifyEmail = () => {
  const user = useSelector((state) => state.user);

  return (
    <Container style={{ textAlign: "center", marginTop: "20px" }}>
      <h1 style={{ fontFamily: "Arial, sans-serif", fontSize: "24px" }}>
        Email: {user.user.email} -----{" "}
        {user.user.isVerified ? (
          <span className="verified" style={{ color: "green" }}>Verified</span>
        ) : (
          <span className="not-verified" style={{ color: "red" }}>Not Verified</span>
        )}
      </h1>
    </Container>
  );
};

export default CheckVerifyEmail;