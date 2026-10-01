import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormControl from "../../Components/FormControl";
import PasswordField from "../../Components/PasswordField";
import { Auth } from "../../Context/Auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import SuccessMessage from "../../Components/SuccessMessage";
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const socialIcons = [FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn];

const fields = [
  { name: "name", placeholder: "Full Name" },
  { name: "email", placeholder: "Email" },
  { name: "password", placeholder: "Password", isPassword: true },
  { name: "phone", placeholder: "Phone" },
  { name: "department", placeholder: "Department" },
  { name: "position", placeholder: "Position" },
  { name: "salary", placeholder: "Salary", type: "number" },
  { name: "address", placeholder: "Address" },
];

const required = (label) => Yup.string().required(`${label} required`);

const schema = Yup.object({
  name: required("Name"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password required"),
  phone: required("Phone"),
  department: required("Department"),
  position: required("Position"),
  address: required("Address"),
  salary: Yup.number()
    .typeError("Salary must be a number")
    .required("Salary required"),
});

const initialValues = Object.fromEntries(fields.map((f) => [f.name, ""]));

const Regist = () => {
  const auth = Auth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      status: "Active",
      startDate: new Date().toISOString().split("T")[0],
      initials: values.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      role: values.department.toLowerCase() === "hr" ? "hr" : "employee",
    };

    try {
      const response = await auth.register(payload);

      if (response.success) {
        setMessage("Registration successful!");
        setTimeout(() => navigate("/auth", { state: { active: false } }), 2000);
      } else {
        setMessage(response.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, values, isValid, isSubmitting }) => (
        <Form className="form-wrapper">
          <h1>Create Account</h1>

          {/* Social Icons */}
          <div className="social-icons">
            {socialIcons.map((Icon, i) => (
              <Link key={i} to="#"><Icon /></Link>
            ))}
          </div>

          <div className="form-scroll">
            {fields.map(({ isPassword, ...field }) => {
              const Field = isPassword ? PasswordField : FormControl;
              return (
                <Field
                  key={field.name}
                  {...(!isPassword && { control: "input" })}
                  {...field}
                  value={values[field.name]}
                  onChange={handleChange}
                />
              );
            })}
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