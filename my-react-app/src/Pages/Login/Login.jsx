import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormControl from "../../Components/FormControl";
import PasswordField from "../../Components/PasswordField";
import { Auth } from "../../Context/Auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import SuccessMessage from "../../Components/SuccessMessage";
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

import "../AuthPage/auth.css";

const Login = ({ successMessage }) => {
  const auth = Auth();
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState("");

  const redirectPath = location.state?.path || "/";

  const schema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password required"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={schema}
      onSubmit={async (values) => {
        setMessage("");
        try {
          const response = await auth.login(values);

          if (response.success) {
            // تحويل فوري بدون انتظار
            navigate(redirectPath, { replace: true });
          } else {
            setMessage(response.message);
          }
        } catch (error) {
          setMessage("Server error. Please try again later.");
        }
      }}
    >
      {({ handleChange, values, isSubmitting }) => (
        <Form>
          <h1>Sign In</h1>

          <div className="social-icons">
            <Link to="#"><FaGoogle /></Link>
            <Link to="#"><FaFacebookF /></Link>
            <Link to="#"><FaGithub /></Link>
            <Link to="#"><FaLinkedinIn /></Link>
          </div>

          <FormControl
            control="input"
            name="email"
            label="Email"
            autoComplete="username"
            value={values.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <PasswordField
            name="password"
            value={values.password}
            onChange={handleChange}
            autoComplete="current-password"
            placeholder="Password"
          />

          <Link className="Forget" to="#">Forget Your Password?</Link>

          <button type="submit" className="SubmitBtn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <SuccessMessage message={successMessage || message} />
        </Form>
      )}
    </Formik>
  );
};

export default Login;