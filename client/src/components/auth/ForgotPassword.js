import { Field, reduxForm } from "redux-form";
import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import axios from "axios";

const form = reduxForm({
  form: "forgotPassword",
});

function ForgotPassword() {
  const [emailResponse, setEmailResponse] = useState("");

  useEffect(() => {
    window.$(document).ready(function () {
      window.$("#forgot_form").validate({
        rules: {
          email: { required: true, email: true },
        },
        messages: {
          email: { required: "Please enter this field" },
        },
      });
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    axios
      .post(`${API_URL}/auth/forgot-password`, { email })
      .then((res) => {
        setEmailResponse(
          "<div class='alert alert-success text-center'>" +
            res.data.message +
            "</div>"
        );
        setTimeout(function () {
          window.$("input[name='email").val("");
        }, 2000);
      })
      .catch((err) => {
        setEmailResponse(
          "<div class='alert alert-danger text-center'>" +
            "user not found" +
            "</div>"
        );
        setTimeout(function () {
          window.$("input[name='email").val("");
        }, 2000);
      });
  };

  return (
    <div className="container min-height-full-page">
      <div className="col-sm-6 col-sm-offset-3">
        <div className="page-title text-center">
          <h2>Forget Password</h2>
        </div>
        <>
          <p className="text-center">
            Please enter your email to get new password.
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: emailResponse,
            }}
          ></div>
          <form id="forgot_form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Email</label>
              <Field
                name="email"
                className="form-control"
                component="input"
                type="text"
              />
            </div>

            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary">
                Reset Password
              </button>
            </div>
          </form>
        </>
      </div>
    </div>
  );
}

export default form(ForgotPassword);
