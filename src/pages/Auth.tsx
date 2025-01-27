import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Auth = () => {
  return (
    <Routes>
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="/" element={<Navigate to="signin" replace />} />
    </Routes>
  );
};

export default Auth;