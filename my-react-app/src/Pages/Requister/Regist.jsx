import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormControl from "../../Components/FormControl";
import PasswordField from "../../Components/PasswordField";
import { Auth } from "../../Context/Auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import SuccessMessage from "../../Components/SuccessMessage";
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const Regist = () => {
  const auth = Auth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // ✅ Validation
  const schema = Yup.object({
    name: Yup.string().required("Name required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password required"),
    phone: Yup.string().required("Phone required"),
    department: Yup.string().required("Department required"),
    position: Yup.string().required("Position required"),
    address: Yup.string().required("Address required"),
    salary: Yup.number()
      .typeError("Salary must be a number")
      .required("Salary required"),
  });

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        phone: "",
        department: "",
        position: "",
        address: "",
        salary: "",
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        const roleValue = values.department.toLowerCase() === "hr" ? "hr" : "employee";

        const payload = {
          ...values,
          status: "Active",
          startDate: new Date().toISOString().split("T")[0],
          initials: values.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          role: roleValue,
        };

        try {
          const response = await auth.register(payload);

          if (response.success) {
            setMessage("Registration successful!");
            setTimeout(() => {
              navigate("/auth", { state: { active: false } });
            }, 2000);
          } else {
            setMessage(response.message || "Registration failed");
          }
        } catch (error) {
          setMessage("Something went wrong");
        }

        setSubmitting(false);
      }}
    >
      {({ handleChange, values, isValid, isSubmitting }) => (
        <Form className="form-wrapper">
          <h1>Create Account</h1>

          {/* Social Icons */}
          <div className="social-icons">
            <Link to="#"><FaGoogle /></Link>
            <Link to="#"><FaFacebookF /></Link>
            <Link to="#"><FaGithub /></Link>
            <Link to="#"><FaLinkedinIn /></Link>
          </div>

          <div className="form-scroll">
            <FormControl
              control="input"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Full Name"
            />

            <FormControl
              control="input"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Email"
            />

            <PasswordField
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Password"
            />

            <FormControl
              control="input"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="Phone"
            />

            <FormControl
              control="input"
              name="department"
              value={values.department}
              onChange={handleChange}
              placeholder="Department"
            />

            <FormControl
              control="input"
              name="position"
              value={values.position}
              onChange={handleChange}
              placeholder="Position"
            />

            <FormControl
              control="input"
              name="salary"
              value={values.salary}
              onChange={handleChange}
              placeholder="Salary"
              type="number"
            />

            <FormControl
              control="input"
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>

          <button type="submit" disabled={!isValid || isSubmitting} className="SubmitBtn">
            Sign Up
          </button>

          <SuccessMessage message={message} />
        </Form>
      )}
    </Formik>
  );
};

export default Regist;